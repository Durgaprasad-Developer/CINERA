import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import contentRoutes from "./contentRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import streamRoutes from "./streamRoutes.js";



const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use("/admin/content", contentRoutes);
router.use("/admin/upload", uploadRoutes);
router.use("/stream", streamRoutes);


export default router;
