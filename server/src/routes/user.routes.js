import { Router } from "express";
import { register, login, token } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();
// Register a new user
router.route("/register").post(register);
// Login an existing user
router.route("/login").post(login);
router.route("/token").get(verifyJWT, token); // Endpoint to get token by user ID
export default router;
