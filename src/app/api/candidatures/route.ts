import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import JobApplication from "@/models/JobApplication";
import { jobApplicationSchema } from "@/lib/validations";
import { generateReference } from "@/lib/utils";
import { sendEmail, candidatureConfirmationEmail, adminNotificationEmail } from "@/lib/email";
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

    const total = await JobApplication.countDocuments(query);
    const applications = await JobApplication.find(query)
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
          if (key === "acceptTerms") {
            data[key] = value === "true";
          } else {
            data[key] = value;
          }
        }
      }
    } else {
      data = await request.json();
    }

    const parsed = jobApplicationSchema.parse(data);
    const referenceId = `CAND-${generateReference()}`;

    const application = await JobApplication.create({
      ...parsed,
      referenceId,
      status: "nouveau",
    });

    // Confirmation
    try {
      await sendEmail({
        to: parsed.email,
        subject: `Confirmation de votre candidature - ${referenceId}`,
        html: candidatureConfirmationEmail(parsed.fullName, referenceId),
      });
    } catch {
      // Non bloquant
    }

    // Notification admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `Nouvelle candidature - ${referenceId}`,
          html: adminNotificationEmail("candidature", parsed.fullName, referenceId),
        });
      }
    } catch {
      // Non bloquant
    }

    return NextResponse.json({ success: true, data: { referenceId, _id: application._id } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
