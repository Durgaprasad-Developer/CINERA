// Routes/billingRoutes.js
import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  createPaymentLink,
  getPaymentHistory,
  razorpayWebhook,
  getUserPlans
} from "../Controllers/billingController.js";

const router = express.Router();

router.post("/create-order", verifyUser, createOrder);
router.post("/verify", verifyUser, verifyPayment);
router.get("/status", verifyUser, getSubscriptionStatus);
router.get("/history", verifyUser, getPaymentHistory);
router.post("/create-payment-link", verifyUser, createPaymentLink);

// webhook: Razorpay will POST here. This must be unprotected and use raw body parser in server setup.
router.post("/webhook/razorpay", razorpayWebhook);
router.get("/", verifyUser, getUserPlans);


export default router;
