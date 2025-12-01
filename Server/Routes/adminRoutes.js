import express from "express";
import { verifyAdmin } from "../Middlewares/verifyAdmin.js";
import { getAdminDashboard } from "../Controllers/adminDashboardControllers.js";
import { createGenre, getGenres, deleteGenre } from "../Controllers/genreControllers.js";

const router = express.Router();

// Admin check
router.get("/status", verifyAdmin, (req, res) => {
  res.json({ ok: true });
});

// Full analytics dashboard
router.get("/dashboard", verifyAdmin, getAdminDashboard);

// Genres
router.post("/genres", verifyAdmin, createGenre);
router.get("/genres", verifyAdmin, getGenres);
router.delete("/genres/:id", verifyAdmin, deleteGenre);
export default router;
