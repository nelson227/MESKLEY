import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initWebSocket } from "./lib/ws.js";

import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";
import applicationRoutes from "./routes/applications.js";
import candidatureRoutes from "./routes/candidatures.js";
import contactRoutes from "./routes/contact.js";
import uploadRoutes from "./routes/upload.js";
import statsRoutes from "./routes/stats.js";

const app = express();
const server = createServer(app);

// --- WebSocket ---
initWebSocket(server);

// --- Middlewares ---
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/logements", listingRoutes);
app.use("/api/demandes-location", applicationRoutes);
app.use("/api/candidatures", candidatureRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin/stats", statsRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = parseInt(process.env.PORT || "4000");
server.listen(PORT, () => {
  console.log(`[API] Serveur démarré sur le port ${PORT}`);
  console.log(`[WS]  WebSocket prêt sur le même port`);
});
