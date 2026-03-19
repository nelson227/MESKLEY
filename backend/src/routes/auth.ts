import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyPassword, createToken, extractToken, verifyToken, hashPassword } from "../lib/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ success: false, error: "Identifiants incorrects" });

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ success: false, error: "Identifiants incorrects" });

    await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    const token = await createToken({ id: admin.id, email: admin.email, role: admin.role });

    res.json({ success: true, data: { token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const admin = await prisma.adminUser.findUnique({ where: { id: payload.id as string }, select: { id: true, email: true, name: true, role: true } });
    if (!admin) return res.status(404).json({ success: false, error: "Utilisateur introuvable" });

    res.json({ success: true, data: admin });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;
