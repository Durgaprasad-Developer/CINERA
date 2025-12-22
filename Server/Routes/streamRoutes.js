import express from "express";
import { getSignedStreamUrl } from "../Controllers/streamControllers.js";
import { verifyUser } from "../Middlewares/verifyUser.js";

const router = express.Router();

router.get("/:id", verifyUser, getSignedStreamUrl);

export default router;
