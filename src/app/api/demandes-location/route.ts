import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RentalApplication from "@/models/RentalApplication";
import { rentalApplicationSchema } from "@/lib/validations";
import { generateDossierId } from "@/lib/utils";
import { sendEmail, rentalConfirmationEmail, adminNotificationEmail } from "@/lib/email";
import { verifyToken, extractToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Token invalide" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const total = await RentalApplication.countDocuments(query);
    const applications = await RentalApplication.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const contentType = request.headers.get("content-type") || "";
    let data: Record<string, unknown>;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = {};
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
          if (["householdSize", "monthlyIncome", "maxBudget", "guarantorIncome"].includes(key)) {
            data[key] = Number(value);
          } else if (["hasGuarantor", "acceptTerms"].includes(key)) {
            data[key] = value === "true";
          } else {
            data[key] = value;
          }
        }
      }
    } else {
      data = await request.json();
    }

    const parsed = rentalApplicationSchema.parse(data);
    const dossierId = generateDossierId();

    const application = await RentalApplication.create({
      ...parsed,
      dossierId,
      status: "nouveau",
    });

    // Envoyer email de confirmation au candidat
    try {
      await sendEmail({
        to: parsed.email,
        subject: `Confirmation de votre demande - ${dossierId}`,
        html: rentalConfirmationEmail(parsed.fullName, dossierId),
      });
    } catch {
      // Email non bloquant
    }

    // Notification admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `Nouvelle demande de location - ${dossierId}`,
          html: adminNotificationEmail("demande de location", parsed.fullName, dossierId),
        });
      }
    } catch {
      // Non bloquant
    }

    return NextResponse.json({ success: true, data: { dossierId, _id: application._id } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
