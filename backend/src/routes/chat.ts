import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chat";
import { authenticate } from "../middlewares/authenticate";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const router = express.Router();

router.use(authenticate);

router.post("/", ctrlWrapper(sendMessage));
router.get("/", ctrlWrapper(getChatHistory));

export default router;
