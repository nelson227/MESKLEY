import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { verifyToken, extractToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Token invalide" }, { status: 401 });

    await connectDB();
    const formData = await request.formData();
    const listingId = formData.get("listingId") as string;
    const files = formData.getAll("photos") as File[];

    if (!listingId || files.length === 0) {
      return NextResponse.json({ success: false, error: "Photos et ID du logement requis" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      return uploadToCloudinary(buffer, "meskley-location/listings");
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map((r) => r.url);

    await Listing.findByIdAndUpdate(listingId, { $push: { photos: { $each: urls } } });

    return NextResponse.json({ success: true, data: { urls } });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
