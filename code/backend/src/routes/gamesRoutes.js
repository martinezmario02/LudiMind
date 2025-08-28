import { Router } from "express";
import { usedGames, newGames } from "../controllers/gamesController.js";

const router = Router();

router.post("/used-games", usedGames);
router.post("/new-games", newGames);

export default router;