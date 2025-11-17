import express from 'express';
import { verifyAdmin } from '../Middlewares/verifyAdmin.js';
import { getAdminStats } from "../Controllers/adminDashboardControllers.js";
import { createGenre, getGenres, deleteGenre } from '../Controllers/genreControllers.js';



const router = express.Router();

router.get('/status', verifyAdmin, async (req, res) => {
  return res.json({ ok: true, admin: req.admin });
});
router.get("/stats", verifyAdmin, getAdminStats);
router.post("/genres", verifyAdmin, createGenre);
router.get("/genres", verifyAdmin, getGenres);
router.delete("/genres/:id", verifyAdmin, deleteGenre);


export default router;
