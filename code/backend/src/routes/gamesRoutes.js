import { Router } from "express";
import { usedGames, newGames, infoGame, completedLevels, totalScore, getLevels, resultLevel, allGames, helpUsed, totalGlobalScore, completedLevelsGlobal } from "../controllers/gamesController.js";

const router = Router();

router.get("/all-games", allGames);
router.get("/used-games", usedGames);
router.get("/new-games", newGames);
router.get("/info-game/:id", infoGame);
router.get("/completed-levels/:id", completedLevels);
router.get("/total-score/:id", totalScore);
router.get("/levels/:id", getLevels);
router.get("/result/:id", resultLevel);
router.post("/help/:id", helpUsed);
router.get("/total-global-score", totalGlobalScore);
router.get("/completed-levels-global", completedLevelsGlobal);

export default router;