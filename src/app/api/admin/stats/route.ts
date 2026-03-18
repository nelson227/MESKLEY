import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import RentalApplication from "@/models/RentalApplication";
import JobApplication from "@/models/JobApplication";
import ContactMessage from "@/models/ContactMessage";
import { verifyToken, extractToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Token invalide" }, { status: 401 });

    await connectDB();

    const [
      totalListings,
      availableListings,
      totalApplications,
      pendingApplications,
      totalCandidatures,
      unreadMessages,
    ] = await Promise.all([
      Listing.countDocuments(),
      Listing.countDocuments({ status: "disponible" }),
      RentalApplication.countDocuments(),
      RentalApplication.countDocuments({ status: "nouveau" }),
      JobApplication.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
    ]);

    // Dernières demandes
    const recentApplications = await RentalApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("dossierId fullName status createdAt")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalListings,
        availableListings,
        totalApplications,
        pendingApplications,
        totalCandidatures,
        unreadMessages,
        recentApplications,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
