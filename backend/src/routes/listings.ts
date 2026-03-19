import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { extractToken, verifyToken } from "../lib/auth.js";
import { generateReference } from "../lib/utils.js";
import { broadcast } from "../lib/ws.js";

const router = Router();

// GET /api/logements
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const { type, search, city, minPrice, maxPrice, minSurface, rooms, furnished, sort } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { status: { in: ["disponible", "reserve"] } };

    if (type) where.type = type as string;
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { city: { contains: search as string, mode: "insensitive" } },
        { neighborhood: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {} as Record<string, number>;
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (minSurface) where.surface = { gte: Number(minSurface) };
    if (rooms) where.rooms = rooms === "5" ? { gte: 5 } : Number(rooms);
    if (furnished === "true") where.furnished = true;

    const sortMap: Record<string, Record<string, string>> = {
      date_desc: { createdAt: "desc" },
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
      surface_desc: { surface: "desc" },
    };

    const total = await prisma.listing.count({ where });
    const listings = await prisma.listing.findMany({
      where,
      orderBy: sortMap[(sort as string) || "date_desc"] || { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, title: true, type: true, price: true, surface: true,
        bedrooms: true, furnished: true, city: true, neighborhood: true,
        photos: true, status: true, createdAt: true, reference: true,
      },
    });

    const data = listings.map((l: { id: string; photos?: string[] }) => ({
      ...l,
      _id: l.id,
      mainPhoto: l.photos?.[0] || null,
    }));

    res.json({ success: true, data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// GET /api/logements/:id
router.get("/:id", async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) return res.status(404).json({ success: false, error: "Logement introuvable" });

    res.json({ success: true, data: { ...listing, _id: listing.id } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// POST /api/logements
router.post("/", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const body = req.body;
    const listing = await prisma.listing.create({
      data: {
        ...body,
        reference: generateReference(),
        photos: body.photos || [],
        features: body.features || [],
        availableDate: new Date(body.availableDate),
      },
    });

    broadcast({ type: "listings:changed" });
    res.status(201).json({ success: true, data: listing });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// PUT /api/logements/:id
router.put("/:id", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const body = req.body;
    if (body.availableDate) body.availableDate = new Date(body.availableDate);

    const listing = await prisma.listing.update({ where: { id: req.params.id }, data: body });
    broadcast({ type: "listings:changed" });
    res.json({ success: true, data: listing });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// DELETE /api/logements/:id
router.delete("/:id", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    await prisma.listing.delete({ where: { id: req.params.id } });
    broadcast({ type: "listings:changed" });
    res.json({ success: true, message: "Logement supprimé" });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;
