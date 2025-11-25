import express from "express";
import {
  userSignup,
  userLogin,
  sendResetOtp,
  verifyOtpAndReset,
} from "../Controllers/userAuthController.js";

import { verifyUser } from "../Middlewares/verifyUser.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);

router.post("/forgot-password", sendResetOtp);
router.post("/reset-password", verifyOtpAndReset);

router.get("/me", verifyUser, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
