import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { extractToken, verifyToken } from "../lib/auth.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

router.post("/", async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: "Non autorisé" });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ success: false, error: "Token invalide" });

    const { image } = req.body;
    if (!image) return res.status(400).json({ success: false, error: "Image manquante" });

    const result = await cloudinary.uploader.upload(image, { folder: "meskley-location" });
    res.json({ success: true, data: { url: result.secure_url, publicId: result.public_id } });
  } catch {
    res.status(500).json({ success: false, error: "Erreur upload" });
  }
});

export default router;
