import { Router } from "express";
import { usedGames, newGames, infoGame } from "../controllers/gamesController.js";

const router = Router();

router.get("/used-games", usedGames);
router.get("/new-games", newGames);
router.get("/info-game/:id", infoGame);

export default router;