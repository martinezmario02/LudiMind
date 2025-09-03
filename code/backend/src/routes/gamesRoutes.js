import { Router } from "express";
import { usedGames, newGames, infoGame, completedLevels, totalScore, getLevels } from "../controllers/gamesController.js";

const router = Router();

router.get("/used-games", usedGames);
router.get("/new-games", newGames);
router.get("/info-game/:id", infoGame);
router.get("/completed-levels/:id", completedLevels);
router.get("/total-score/:id", totalScore);
router.get("/levels/:id", getLevels);

export default router;