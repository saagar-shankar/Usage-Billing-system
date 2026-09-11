import * as controller from "./cart.controller.js";
import { authenticate, authorized } from "../auth/auth.middleware.js";
import { Router } from "express";
import ROLES from "../../common/config/constants.js";

const router = Router();
// Create service
router.post(
  "/create-events",
  authenticate,
  authorized(ROLES.VENDOR),
  controller.createEvent,
);

// Delete service
router.delete(
  "/event/:id",
  authenticate,
  authorized(ROLES.ADMIN, ROLES.VENDOR),
  controller.eventDeletion,
);

// Book service
router.post(
  "/book-events",
  authenticate,
  authorized(ROLES.CUSTOMER),
  controller.eventBooking,
);

// End service
router.patch(
  "/services/:serviceName/end",
  authenticate,
  authorized(ROLES.CUSTOMER),
  controller.stopService,
);

// Pay for service
router.patch(
  "/services/:serviceName/pay",
  authenticate,
  authorized(ROLES.CUSTOMER),
  controller.pay,
);

// Get all services
router.get("/all-events", authenticate, controller.allServices);

export default router;
