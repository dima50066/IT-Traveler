import express from "express";
import {
  getPoints,
  createPoint,
  updatePoint,
  deletePoint,
} from "../controllers/points";
import { validateBody } from "../middlewares/validateBody";
import { createPointSchema, updatePointSchema } from "../validation/point";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";

const router = express.Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getPoints));
router.post(
  "/",
  upload.single("image"),
  validateBody(createPointSchema),
  ctrlWrapper(createPoint)
);
router.put(
  "/:id",
  upload.single("image"),
  validateBody(updatePointSchema),
  ctrlWrapper(updatePoint)
);
router.delete("/:id", ctrlWrapper(deletePoint));

export default router;
