import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RentalApplication from "@/models/RentalApplication";
import { verifyToken, extractToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = extractToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Token invalide" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "ID invalide" }, { status: 400 });
    }

    const application = await RentalApplication.findById(id).lean();
    if (!application) {
      return NextResponse.json({ success: false, error: "Demande introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: application });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = extractToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Token invalide" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "ID invalide" }, { status: 400 });
    }

    const body = await request.json();
    const application = await RentalApplication.findByIdAndUpdate(id, body, { new: true });
    if (!application) {
      return NextResponse.json({ success: false, error: "Demande introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: application });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = extractToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Token invalide" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "ID invalide" }, { status: 400 });
    }

    const application = await RentalApplication.findByIdAndDelete(id);
    if (!application) {
      return NextResponse.json({ success: false, error: "Demande introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Demande supprimée" });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
