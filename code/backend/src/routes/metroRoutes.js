import { Router } from "express";
import { getTasksInfo, getStation, getAllStations, getLinesWithStations } from "../controllers/metroController.js";

const router = Router();

router.get("/tasks/:id", getTasksInfo);
router.get("/stations/:id", getStation);
router.get("/stations", getAllStations);
router.get("/lines-stations", getLinesWithStations);

export default router;