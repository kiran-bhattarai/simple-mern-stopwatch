import {Router} from "express";
import authController from "../controllers/auth.controller.js";
import limiterMiddleware from "../middlewares/auth/limiter.middleware.js";

const router = Router();
router.post("/signup", limiterMiddleware, authController.signup);
router.post("/login", limiterMiddleware, authController.login);
router.get("/check", authController.check);
router.post("/logout", authController.logout);

export default router;