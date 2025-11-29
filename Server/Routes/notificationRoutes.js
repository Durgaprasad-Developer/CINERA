import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import { getUserNotifications } from "../Controllers/notificationControllers.js";
import { sendEmail } from "../Utils/emailClient.js";

const router = express.Router();

// Get all notifications
router.get("/", verifyUser, getUserNotifications);

// Test email route
router.get("/test-email", async (req, res) => {
  const ok = await sendEmail({
    to: "bdurga.24bcs10012@sst.scaler.com",
    subject: "CINERA TEST EMAIL",
    html: "<h1>🔥 Email Function Working!</h1>",
  });

  res.json({ success: ok });
});

// 🔥🔥🔥 VERY IMPORTANT EXPORT
export default router;
