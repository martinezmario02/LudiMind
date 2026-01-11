import { Router } from "express";
import { register, login, resetPassword, setPassword, getCurrentUser, getCurrentStudent, visualLogin, visualRegister, changeName, deleteAccount } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/set-password", setPassword);
router.get("/me", getCurrentUser);
router.get("/me-visual", getCurrentStudent);
router.post("/visual-login", visualLogin);
router.post("/visual-register", visualRegister);
router.post("/change-name", changeName);
router.post("/delete-account", deleteAccount);

export default router;