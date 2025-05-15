import { Router } from "express";
import authRouter from "./auth";
import pointRouter from "./points";
import chatRouter from "./chat";

const router = Router();

router.use("/auth", authRouter);
router.use("/points", pointRouter);
router.use("/chat", chatRouter);

export default router;
