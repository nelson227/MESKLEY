import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { verifyToken, extractToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "ID invalide" }, { status: 400 });
    }

    const listing = await Listing.findById(id).lean();
    if (!listing) {
      return NextResponse.json({ success: false, error: "Logement introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...listing, _id: String(listing._id) } });
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
    const listing = await Listing.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!listing) {
      return NextResponse.json({ success: false, error: "Logement introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: listing });
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

    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
      return NextResponse.json({ success: false, error: "Logement introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Logement supprimé" });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
