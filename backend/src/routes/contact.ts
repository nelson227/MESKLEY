import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { sendEmail, adminNotificationEmail } from "../lib/email.js";
import { broadcast } from "../lib/ws.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { fullName, email, subject, message: msg } = req.body;

    const contact = await prisma.contactMessage.create({
      data: { fullName, email, subject, message: msg },
    });

    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({ to: process.env.ADMIN_EMAIL, subject: `Nouveau message - ${subject}`, html: adminNotificationEmail("message de contact", fullName, `Sujet: ${subject}`) });
      }
    } catch { /* non bloquant */ }

    broadcast({ type: "contacts:changed" });
    res.status(201).json({ success: true, data: { _id: contact.id } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;
