import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import { searchContent } from "../Controllers/searchControllers.js";

const router = express.Router();

router.get("/", verifyUser, searchContent);

export default router;
