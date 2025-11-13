import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import contentRoutes from "./contentRoutes.js";


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use("/admin/content", contentRoutes);


export default router;
