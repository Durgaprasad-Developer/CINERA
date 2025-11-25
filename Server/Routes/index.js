import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import contentRoutes from "./contentRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import streamRoutes from "./streamRoutes.js";
import userRoutes from "./userRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";



const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use("/admin/content", contentRoutes);
router.use("/admin/upload", uploadRoutes);
router.use("/stream", streamRoutes);
router.use("/user", userRoutes);
router.use("/analytics", analyticsRoutes);



export default router;
