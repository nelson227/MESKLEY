import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { extractToken, verifyToken } from "../lib/auth.js";
import { generateReference } from "../lib/utils.js";
import { sendEmail, candidatureConfirmationEmail, adminNotificationEmail } from "../lib/email.js";
import { broadcast } from "../server.js";

const router = Router();

// GET
router.get("/", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const status = req.query.status as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const where = status ? { status: status as never } : {};
    const total = await prisma.jobApplication.count({ where });
    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = applications.map((a) => ({ ...a, _id: a.id }));
    res.json({ success: true, data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// GET /:id
router.get("/:id", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const app = await prisma.jobApplication.findUnique({ where: { id: req.params.id } });
    if (!app) return res.status(404).json({ success: false, error: "Candidature introuvable" });

    res.json({ success: true, data: { ...app, _id: app.id } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const referenceId = `CAND-${generateReference()}`;

    const application = await prisma.jobApplication.create({
      data: {
        referenceId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        desiredPosition: body.desiredPosition,
        educationLevel: body.educationLevel,
        yearsExperience: body.yearsExperience,
        availability: body.availability,
        cvUrl: body.cvUrl || "",
        coverLetterUrl: body.coverLetterUrl || null,
        message: body.message || null,
        status: "nouveau",
      },
    });

    try {
      await sendEmail({ to: body.email, subject: `Confirmation candidature - ${referenceId}`, html: candidatureConfirmationEmail(body.fullName, referenceId) });
    } catch { /* non bloquant */ }

    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({ to: process.env.ADMIN_EMAIL, subject: `Nouvelle candidature - ${referenceId}`, html: adminNotificationEmail("candidature", body.fullName, referenceId) });
      }
    } catch { /* non bloquant */ }

    broadcast({ type: "candidatures:changed" });
    res.status(201).json({ success: true, data: { referenceId, _id: application.id } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// PUT /:id
router.put("/:id", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const application = await prisma.jobApplication.update({ where: { id: req.params.id }, data: req.body });
    broadcast({ type: "candidatures:changed" });
    res.json({ success: true, data: application });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;
