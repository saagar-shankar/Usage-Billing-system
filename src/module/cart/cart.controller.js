import * as cartService from "./cart.service.js";
import ApiResponse from "../../common/utils/api.response.js";

const createEvent = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;
  const event = await cartService.createNewEvent(data, userId);

  return ApiResponse.created(res, "Event created successfully", event);
};

const eventDeletion = async (req, res) => {
  const eventId = req.params.id;
  const user = req.user;

  const result = await cartService.deleteEvent(eventId, user);
  return ApiResponse.ok(res, "Event deleted successfully", result);
};

const eventBooking = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;

  const booked = await cartService.bookEvent(data, userId);
  return ApiResponse.ok(res, "Event booked successfully.", booked);
};

const allServices = async (req, res) => {
  const events = await cartService.getAllService();
  return ApiResponse.ok(res, "All services mentioned below", events);
};

const stopService = async (req, res) => {
  const { serviceName } = req.params;

  const userId = req.user.id;

  const { bookingInfo, eventInfo } = await cartService.endService(
    serviceName,
    userId,
  );

  return ApiResponse.ok(res, "Service ended successfully", {
    bookingInfo,
    eventInfo,
  });
};

const pay = async (req, res) => {
  const { serviceName } = req.params;
  const userId = req.user.id;

  const bookingInfo = await cartService.payForService(serviceName, userId);
  return ApiResponse.ok(res, "Payment successful", bookingInfo);
};

export {
  createEvent,
  eventDeletion,
  eventBooking,
  allServices,
  stopService,
  pay,
};
