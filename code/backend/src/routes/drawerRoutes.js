import { Router } from "express";
import { getInfoLevel, getDrawersInfo } from "../controllers/drawerController.js";

const router = Router();

router.get("/info-level/:id", getInfoLevel);
router.get("/drawers-info/:id", getDrawersInfo);

export default router;