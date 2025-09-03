import { Router } from "express";
import { getTasksInfo, getStation } from "../controllers/metroController.js";

const router = Router();

router.get("/tasks/:id", getTasksInfo);
router.get("/stations/:id", getStation);

export default router;