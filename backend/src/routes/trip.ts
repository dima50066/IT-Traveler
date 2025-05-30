import express from "express";
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  inviteUser,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  reorderTodos,
  batchAddTodos,
  markAllTodos,
} from "../controllers/trip";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import { validateBody } from "../middlewares/validateBody";
import { authenticate } from "../middlewares/authenticate";
import {
  createTripSchema,
  updateTripSchema,
  inviteUserSchema,
  updateTodoSchema,
  reorderSchema,
  markAllSchema,
  batchAddSchema,
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

router.patch("/:id/todo/add", ctrlWrapper(addTodo));
router.patch(
  "/:id/todo/reorder",
  validateBody(reorderSchema),
  ctrlWrapper(reorderTodos)
);
router.patch(
  "/:id/todo/mark-all",
  validateBody(markAllSchema),
  ctrlWrapper(markAllTodos)
);
router.post(
  "/:id/todo/batch",
  validateBody(batchAddSchema),
  ctrlWrapper(batchAddTodos)
);
router.patch("/:id/todo/:todoId/toggle", ctrlWrapper(toggleTodo));
router.patch(
  "/:id/todo/:todoId",
  validateBody(updateTodoSchema),
  ctrlWrapper(updateTodo)
);
router.delete("/:id/todo/:todoId", ctrlWrapper(deleteTodo));

export default router;
