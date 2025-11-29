import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import { trackEvent } from "../Controllers/analyticsControllers.js";

const router = express.Router();

router.post("/track", verifyUser, trackEvent);

export default router;
