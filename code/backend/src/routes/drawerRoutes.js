import { Router } from "express";
import { getInfoLevel, getDrawersInfo, getObjectsInfo, addObjectToDrawer, getDrawerContents, removeObjectFromDrawer, getUnassignedObjects, solveDrawerLevel, resetLevel } from "../controllers/drawerController.js";

const router = Router();

router.get("/info-level/:id", getInfoLevel);
router.get("/drawers-info/:id", getDrawersInfo);
router.post("/objects-info", getObjectsInfo);
router.post("/add-object", addObjectToDrawer);
router.get("/content/:id", getDrawerContents);
router.post("/remove-object", removeObjectFromDrawer);
router.get("/unassigned-objects/:id", getUnassignedObjects);
router.post("/solve-level", solveDrawerLevel);
router.post("/reset-level/:id", resetLevel);

export default router;