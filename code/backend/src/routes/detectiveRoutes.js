import { Router } from "express";
import { getInfoLevel } from "../controllers/detectiveController.js";

const router = Router();

router.get("/info-level/:id", getInfoLevel);

export default router;