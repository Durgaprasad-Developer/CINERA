import express from "express";
import { getSignedStreamUrl } from "../Controllers/streamControllers.js";

const router = express.Router();

router.get("/:id", getSignedStreamUrl);

export default router;
