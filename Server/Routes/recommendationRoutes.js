import express from "express";
import { verifyUser } from "../Middlewares/verifyUser.js";
import { getSimilarContent } from "../Controllers/recommendationControllers.js";
import { getUserRecommendations } from "../Controllers/recommendationUserControllers.js";
import { becauseYouWatched } from "../Controllers/becauseControllers.js";

const router = express.Router();

// Similar content (public but auth recommended)
router.get("/content/:id/similar", verifyUser, getSimilarContent);

// Personalized recommendations
router.get("/personal", verifyUser, getUserRecommendations);

// Because-you-watched
router.get("/because", verifyUser, becauseYouWatched);

export default router;
