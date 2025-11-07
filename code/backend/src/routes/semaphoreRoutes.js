import { Router } from "express";
import { getInfoLevel, getFeelings, checkFeeling, getFeelingResult, getActions, checkAction, getActionResult, saveScore } from "../controllers/semaphoreController.js";

const router = Router();

router.get("/info-level/:id", getInfoLevel);
router.get("/feelings/:id", getFeelings);
router.post("/check-feeling", checkFeeling);
router.get("/result-feeling/:id", getFeelingResult);
router.get("/actions/:id", getActions);
router.post("/check-action", checkAction);
router.get("/result-action/:id", getActionResult);
router.post("/save-score/:id", saveScore);

export default router;