import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { extractToken, verifyToken } from "../lib/auth.js";
import { generateDossierId } from "../lib/utils.js";
import { sendEmail, rentalConfirmationEmail, adminNotificationEmail } from "../lib/email.js";
import { broadcast } from "../lib/ws.js";

const router = Router();

// GET /api/demandes-location
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
    const total = await prisma.rentalApplication.count({ where });
    const applications = await prisma.rentalApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = applications.map((a: { id: string }) => ({ ...a, _id: a.id }));
    res.json({ success: true, data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// GET /api/demandes-location/:id
router.get("/:id", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const app = await prisma.rentalApplication.findUnique({ where: { id: req.params.id } });
    if (!app) return res.status(404).json({ success: false, error: "Demande introuvable" });

    res.json({ success: true, data: { ...app, _id: app.id } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// POST /api/demandes-location
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const dossierId = generateDossierId();

    const application = await prisma.rentalApplication.create({
      data: {
        dossierId,
        fullName: body.fullName,
        birthDate: new Date(body.birthDate),
        phone: body.phone,
        email: body.email,
        idNumber: body.idNumber,
        nationality: body.nationality,
        familyStatus: body.familyStatus,
        householdSize: Number(body.householdSize),
        employmentStatus: body.employmentStatus,
        employerName: body.employerName || null,
        jobTitle: body.jobTitle || null,
        monthlyIncome: Number(body.monthlyIncome),
        employmentDuration: body.employmentDuration || null,
        listingId: body.listingId || null,
        desiredMoveIn: new Date(body.desiredMoveIn),
        desiredDuration: body.desiredDuration,
        maxBudget: Number(body.maxBudget),
        currentAddress: body.currentAddress || null,
        currentStatus: body.currentStatus || null,
        movingReason: body.movingReason || null,
        hasGuarantor: body.hasGuarantor === true || body.hasGuarantor === "true",
        guarantorName: body.guarantorName || null,
        guarantorRelation: body.guarantorRelation || null,
        guarantorPhone: body.guarantorPhone || null,
        guarantorIncome: body.guarantorIncome ? Number(body.guarantorIncome) : null,
        idDocument: body.idDocument || "",
        incomeProof: body.incomeProof || null,
        addressProof: body.addressProof || null,
        otherDocuments: body.otherDocuments || [],
        message: body.message || null,
        status: "nouveau",
      },
    });

    try {
      await sendEmail({ to: body.email, subject: `Confirmation - ${dossierId}`, html: rentalConfirmationEmail(body.fullName, dossierId) });
    } catch { /* non bloquant */ }

    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({ to: process.env.ADMIN_EMAIL, subject: `Nouvelle demande - ${dossierId}`, html: adminNotificationEmail("demande de location", body.fullName, dossierId) });
      }
    } catch { /* non bloquant */ }

    broadcast({ type: "applications:changed" });
    res.status(201).json({ success: true, data: { dossierId, _id: application.id } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// PUT /api/demandes-location/:id
router.put("/:id", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const application = await prisma.rentalApplication.update({ where: { id: req.params.id }, data: req.body });
    broadcast({ type: "applications:changed" });
    res.json({ success: true, data: application });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

// DELETE /api/demandes-location/:id
router.delete("/:id", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    await prisma.rentalApplication.delete({ where: { id: req.params.id } });
    broadcast({ type: "applications:changed" });
    res.json({ success: true, message: "Demande supprimée" });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;
