import express from "express";
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  inviteUser,
} from "../controllers/trip";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import { validateBody } from "../middlewares/validateBody";
import { authenticate } from "../middlewares/authenticate";
import {
  createTripSchema,
  updateTripSchema,
  inviteUserSchema,
} from "../validation/trip";

const router = express.Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getTrips));
router.post("/", validateBody(createTripSchema), ctrlWrapper(createTrip));
router.put("/:id", validateBody(updateTripSchema), ctrlWrapper(updateTrip));
router.delete("/:id", ctrlWrapper(deleteTrip));

router.patch(
  "/:id/invite",
  validateBody(inviteUserSchema),
  ctrlWrapper(inviteUser)
);

export default router;
