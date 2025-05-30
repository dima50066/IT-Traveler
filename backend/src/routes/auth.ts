import { Router } from "express";
import {
  googleAuthRedirect,
  googleAuthCallback,
  getGoogleProfile,
  getAllUsersHandler,
} from "../controllers/auth";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/", ctrlWrapper(googleAuthRedirect));
router.get("/callback", ctrlWrapper(googleAuthCallback));
router.get("/profile", authenticate, ctrlWrapper(getGoogleProfile));
router.get("/users", authenticate, ctrlWrapper(getAllUsersHandler));

export default router;
