import { Router } from "express";
import authRouter from "./auth";
import pointRouter from "./points";
import chatRouter from "./chat";
import tripRouter from "./trip";

const router = Router();

router.use("/auth", authRouter);
router.use("/points", pointRouter);
router.use("/chat", chatRouter);
router.use("/trip", tripRouter);

export default router;
