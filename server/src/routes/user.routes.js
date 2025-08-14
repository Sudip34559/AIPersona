import { Router } from "express";
import { register, login } from "../controllers/user.controller.js";
const router = Router();
// Register a new user
router.route("/register").post(register);
// Login an existing user
router.route("/login").post(login);
export default router;
