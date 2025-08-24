import { Router } from "express";
import { register, login, resetPassword, setPassword } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/set-password", setPassword);

export default router;