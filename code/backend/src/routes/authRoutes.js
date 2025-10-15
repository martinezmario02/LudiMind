import { Router } from "express";
import { register, login, resetPassword, setPassword, getCurrentUser, visualLogin, visualRegister } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/set-password", setPassword);
router.get("/me", getCurrentUser);
router.post("/visual-login", visualLogin);
router.post("/visual-register", visualRegister);

export default router;