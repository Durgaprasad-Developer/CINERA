import express from 'express';
import { verifyAdmin } from '../Middlewares/verifyAdmin.js';

const router = express.Router();

router.get('/status', verifyAdmin, async (req, res) => {
  return res.json({ ok: true, admin: req.admin });
});

export default router;
