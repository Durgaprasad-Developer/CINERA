import express from "express";
import { userSignup, userLogin, sendResetOtp, verifyOtpAndReset, logoutUser, googleLogin } from "../Controllers/userAuthController.js";
import { verifyUser } from "../Middlewares/verifyUser.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/forgot-password", sendResetOtp);
router.post("/reset-password", verifyOtpAndReset);
router.post("/logout", logoutUser);
router.post("/google", googleLogin);


// any protected user actions:
router.get("/profile", verifyUser, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
