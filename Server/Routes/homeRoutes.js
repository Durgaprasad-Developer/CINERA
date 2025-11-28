import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import {
  getTrending,
  getPopular,
  getRecent,
  getByGenre
} from "../Controllers/homeControllers.js";

const router = express.Router();

router.get("/trending", verifyUser, getTrending);
router.get("/popular", verifyUser, getPopular);
router.get("/recent", verifyUser, getRecent);
router.get("/genre/:genre", verifyUser, getByGenre);

export default router;
