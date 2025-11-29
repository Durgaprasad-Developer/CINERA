import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import {
  saveProgress,
  getUserHistory,
  getProgressForContent,
  getContinueWatching
} from "../Controllers/historyControllers.js";

const router = express.Router();

router.post("/", verifyUser, saveProgress);
router.get("/", verifyUser, getUserHistory);
router.get("/continue", verifyUser, getContinueWatching);
router.get("/:contentId", verifyUser, getProgressForContent);


export default router;
