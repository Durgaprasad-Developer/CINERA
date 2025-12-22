import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import contentRoutes from "./contentRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import streamRoutes from "./streamRoutes.js";
import userRoutes from "./userRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import historyRoutes from './userHistoryRoutes.js';
import favoritesRoutes from './userFavoritesRoutes.js'
import recommendationRoutes from './recommendationRoutes.js'
import homeRoutes from './homeRoutes.js'
import searchRoutes from "./searchRoutes.js";
import notificationRoutes from "./notificationRoutes.js"
import billingRoutes from "./billingRoutes.js"
import adminPlansRoutes from "./adminPlansRoutes.js"
import userContentRoutes from "./userContentRoutes.js"



const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use("/admin/content", contentRoutes);
router.use("/admin/upload", uploadRoutes);
router.use("/stream", streamRoutes);
router.use("/user", userRoutes);
router.use("/analytics", analyticsRoutes);
router.use('/user/history', historyRoutes);
router.use("/user/favorites", favoritesRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/home", homeRoutes);
router.use("/search", searchRoutes);
router.use("/notifications", notificationRoutes);
router.use("/billing", billingRoutes);
router.use("/admin/plans", adminPlansRoutes);
router.use("/user/content", userContentRoutes);










export default router;
