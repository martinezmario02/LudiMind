import { Router } from "express";
import { getTasksInfo, getStation, getAllStations, getLinesWithStations, checkSequence } from "../controllers/metroController.js";

const router = Router();

router.get("/tasks/:id", getTasksInfo);
router.get("/stations/:id", getStation);
router.get("/stations", getAllStations);
router.get("/lines-stations", getLinesWithStations);
router.post("/tasks/:id/check", checkSequence);

export default router;