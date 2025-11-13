import express from "express";
import { verifyAdmin } from "../Middlewares/verifyAdmin.js";
import { getAllContent, createContent, updateContent, deleteContent } from "../Controllers/contentControllers.js";

const router = express.Router();

// All routes protected by admin middleware
router.get("/", verifyAdmin, getAllContent);
router.post("/", verifyAdmin, createContent);
router.put("/:id", verifyAdmin, updateContent);
router.delete("/:id", verifyAdmin, deleteContent);

export default router;
