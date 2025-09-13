import { Router } from "express";
import { getInfoLevel, getDrawersInfo, getObjectsInfo, addObjectToDrawer, getDrawerContents } from "../controllers/drawerController.js";

const router = Router();

router.get("/info-level/:id", getInfoLevel);
router.get("/drawers-info/:id", getDrawersInfo);
router.post("/objects-info", getObjectsInfo);
router.post("/add-object", addObjectToDrawer);
router.get("/contents/:id", getDrawerContents);

export default router;