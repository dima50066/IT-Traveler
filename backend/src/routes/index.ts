import { Router } from "express";
import authRouter from "./auth";
import pointRouter from "./points";

const router = Router();

router.use("/auth", authRouter);
router.use("/points", pointRouter);

export default router;
