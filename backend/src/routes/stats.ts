import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { extractToken, verifyToken } from "../lib/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const [listings, applications, candidatures, contacts] = await Promise.all([
      prisma.listing.count(),
      prisma.rentalApplication.count(),
      prisma.jobApplication.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

    const recentApplications = await prisma.rentalApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, fullName: true, status: true, createdAt: true, dossierId: true },
    });

    res.json({
      success: true,
      data: {
        counts: { listings, applications, candidatures, unreadContacts: contacts },
        recentApplications: recentApplications.map((a) => ({ ...a, _id: a.id })),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;
