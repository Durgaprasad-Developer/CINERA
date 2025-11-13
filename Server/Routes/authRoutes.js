import express from 'express';
import { adminLogin } from '../Controllers/authController.js';

const router = express.Router();

router.post('/login', adminLogin);

export default router;
