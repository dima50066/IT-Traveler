import { Router } from "express";
import {
  googleAuthRedirect,
  googleAuthCallback,
  getGoogleProfile,
} from "../controllers/auth";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/", ctrlWrapper(googleAuthRedirect));
router.get("/callback", ctrlWrapper(googleAuthCallback));
router.get("/profile", authenticate, ctrlWrapper(getGoogleProfile));

export default router;
