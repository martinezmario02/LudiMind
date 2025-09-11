import { Router } from "express";
import { getInfoLevel, getDrawersInfo, getObjectsInfo } from "../controllers/drawerController.js";

const router = Router();

router.get("/info-level/:id", getInfoLevel);
router.get("/drawers-info/:id", getDrawersInfo);
router.post("/objects-info", getObjectsInfo);

export default router;