import express from "express";
import { trackEvent } from "../Controllers/analyticsControllers.js";

const router = express.Router();

router.post("/track", trackEvent);

export default router;
