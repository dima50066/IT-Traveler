import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authCallback, getProfile } from "../controllers/auth";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const router = Router();

router.get("/callback", authenticate, ctrlWrapper(authCallback));
router.get("/profile", authenticate, ctrlWrapper(getProfile));

export default router;
