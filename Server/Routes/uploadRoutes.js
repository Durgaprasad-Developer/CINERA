import express from "express";
import { verifyAdmin } from "../Middlewares/verifyAdmin.js";
import { generateUploadUrl } from "../Controllers/uploadControllers.js";

const router = express.Router();

router.post("/upload-url", verifyAdmin, generateUploadUrl);

export default router;
