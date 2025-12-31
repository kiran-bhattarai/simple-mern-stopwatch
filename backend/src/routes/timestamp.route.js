import {Router} from "express";
import timestampController from "../controllers/timestamp.controller.js";

const router = Router();
router.post("/timestamps", timestampController.timestampPost);
router.get("/timestamps", timestampController.timestampGet);
router.delete("/timestamps/:id", timestampController.timestampDelete);

export default router;