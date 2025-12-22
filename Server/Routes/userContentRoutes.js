import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import { getContentDetail } from "../Controllers/userContentControllers.js";

const router = express.Router();

/**
 * GET /content/:id
 * User content detail (published only)
 */
router.get("/:id", verifyUser, getContentDetail);

export default router;
