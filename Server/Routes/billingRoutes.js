import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
} from "../Controllers/billingController.js";

const router = express.Router();

router.post("/create-order", verifyUser, createOrder);
router.post("/verify", verifyUser, verifyPayment);
router.get("/status", verifyUser, getSubscriptionStatus);

export default router;
