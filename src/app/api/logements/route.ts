import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { listingSchema } from "@/lib/validations";
import { verifyToken, extractToken } from "@/lib/auth";
import { generateReference } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minSurface = searchParams.get("minSurface");
    const rooms = searchParams.get("rooms");
    const furnished = searchParams.get("furnished");
    const sort = searchParams.get("sort") || "date_desc";

    const query: Record<string, unknown> = { status: { $in: ["disponible", "reserve"] } };

    if (type) query.type = type;
    if (city) query.city = { $regex: city, $options: "i" };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { neighborhood: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (minSurface) query.surface = { $gte: Number(minSurface) };
    if (rooms) query.rooms = rooms === "5" ? { $gte: 5 } : Number(rooms);
    if (furnished === "true") query.furnished = true;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      date_desc: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      surface_desc: { surface: -1 },
    };

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("title type price surface rooms bedrooms bathrooms furnished city neighborhood photos status reference createdAt")
      .lean();

    const data = listings.map((l) => ({
      _id: String(l._id),
      title: l.title,
      type: l.type,
      price: l.price,
      surface: l.surface,
      bedrooms: l.bedrooms,
      furnished: l.furnished,
      city: l.city,
      neighborhood: l.neighborhood,
      mainPhoto: l.photos?.[0] || null,
      status: l.status,
      createdAt: l.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "Token invalide" }, { status: 401 });

    await connectDB();
    const body = await request.json();
    const parsed = listingSchema.parse(body);

    const listing = await Listing.create({
      ...parsed,
      reference: generateReference(),
      photos: [],
    });

    return NextResponse.json({ success: true, data: listing }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Données invalides" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
