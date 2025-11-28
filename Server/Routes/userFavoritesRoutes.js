import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import {
  likeContent,
  unlikeContent,
  favoriteContent,
  unfavoriteContent,
  getFavorites,
  getLikes
} from "../Controllers/favoritesControllers.js";

const router = express.Router();

// Likes
router.post("/like", verifyUser, likeContent);
router.delete("/like/:contentId", verifyUser, unlikeContent);

// Favorites
router.post("/favorite", verifyUser, favoriteContent);
router.delete("/favorite/:contentId", verifyUser, unfavoriteContent);

// Lists
router.get("/", verifyUser, getFavorites);
router.get("/likes", verifyUser, getLikes);

export default router;
