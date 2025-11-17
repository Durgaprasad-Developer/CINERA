import express from "express";
import { verifyAdmin } from "../Middlewares/verifyAdmin.js";
import { getAllContent, createContent, updateContent, deleteContent } from "../Controllers/contentControllers.js";
import { getSimilarContent } from "../Controllers/recommendationControllers.js";


const router = express.Router();

// All routes protected by admin middleware
router.get("/", verifyAdmin, getAllContent);
router.post("/", verifyAdmin, createContent);
router.put("/:id", verifyAdmin, updateContent);
router.delete("/:id", verifyAdmin, deleteContent);
router.get("/:id/similar", getSimilarContent);

export default router;
