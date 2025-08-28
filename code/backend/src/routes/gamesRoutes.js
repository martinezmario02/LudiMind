import { Router } from "express";
import { usedGames, newGames } from "../controllers/gamesController.js";

const router = Router();

router.get("/used-games", usedGames);
router.get("/new-games", newGames);

export default router;