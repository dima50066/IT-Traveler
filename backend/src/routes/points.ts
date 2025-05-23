import express from "express";
import {
  listPoints,
  createPoint,
  updatePoint,
  deletePoint,
  searchPlaces,
  reorderPoints,
} from "../controllers/points";
import { validateBody } from "../middlewares/validateBody";
import { createPointSchema, updatePointSchema } from "../validation/point";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";
import { checkTripAccess } from "../middlewares/checkTripAccess";

const router = express.Router();

router.use(authenticate);

router.get("/list", checkTripAccess, ctrlWrapper(listPoints));
router.post(
  "/",
  upload.single("image"),
  validateBody(createPointSchema),
  checkTripAccess,
  ctrlWrapper(createPoint)
);
router.put(
  "/:id",
  upload.single("image"),
  validateBody(updatePointSchema),
  checkTripAccess,
  ctrlWrapper(updatePoint)
);
router.delete("/:id", checkTripAccess, ctrlWrapper(deletePoint));

router.get("/search", ctrlWrapper(searchPlaces));

router.patch("/reorder/:tripId", checkTripAccess, ctrlWrapper(reorderPoints));

export default router;
