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

const router = express.Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getPoints));
router.post("/", validateBody(createPointSchema), ctrlWrapper(createPoint));
router.put("/:id", validateBody(updatePointSchema), ctrlWrapper(updatePoint));
router.delete("/:id", ctrlWrapper(deletePoint));

export default router;
