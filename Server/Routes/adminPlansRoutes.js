// Routes/adminPlansRoutes.js
import express from "express";
import { verifyAdmin } from "../Middlewares/verifyAdmin.js";
import {
  createPlan, updatePlan, deletePlan, listPlans
} from "../Controllers/adminPlansControllers.js";

const router = express.Router();

router.post("/", verifyAdmin, createPlan);
router.put("/:id", verifyAdmin, updatePlan);
router.delete("/:id", verifyAdmin, deletePlan);
router.get("/", verifyAdmin, listPlans);

export default router;
