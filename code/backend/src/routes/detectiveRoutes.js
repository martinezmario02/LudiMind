import { Router } from "express";
import { getInfoLevel, checkEmotionSolution, getEmotionChoices, checkReactionChoice } from "../controllers/detectiveController.js";

const router = Router();

router.get("/info-level/:id", getInfoLevel);
router.post("/check/:id", checkEmotionSolution);
router.get("/choices/:id", getEmotionChoices);
router.post("/check-choice/:choiceId", checkReactionChoice);

export default router;