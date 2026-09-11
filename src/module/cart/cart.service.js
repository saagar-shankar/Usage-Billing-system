import Event from "./cart.event.model.js";
import User from "../auth/auth.model.js";
import Booking from "./cart.model.js";
import ApiError from "../../common/utils/api.error.js";
import ROLES from "../../common/config/constants.js";

// create a new service like spa, conference office etc(by vendor/admin)
const createNewEvent = async (data, userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notfound("User does not exist");
  }

  if (user.role !== ROLES.VENDOR) {
    throw ApiError.forbidden("Only vendors can create services");
  }

  const { name, description, capacity, firstHourCost, additionalHourCost } =
    data;

  const existingEvent = await Event.findOne({
    name: name.toLowerCase(),
  });

  if (existingEvent) {
    throw ApiError.conflict("A service with this name already exists");
  }

  const event = await Event.create({
    name,
    description,
    capacity,
    firstHourCost,
    additionalHourCost,
    vendorId: userId,
  });

  return event;
};

// delete an event(like spa, conference office, etc)

const deleteEvent = async (eventId, user) => {
  const event = await Event.findById(eventId);
  if (!event) throw ApiError.notFound("No such event exist");

  if (user.role !== ROLES.ADMIN && event.vendorId.toString() !== user.id)
    throw ApiError.forbidden("You are not allowed to perform this action");

  await Event.findByIdAndDelete(eventId);
  return { message: `${event.name} event deleted successfully` };
};

// allow user to book event
const bookEvent = async (data, userId) => {
  const { name, slotsBooked } = data;

  const serviceName = name.toLowerCase();

  const eventExists = await Event.findOne({
    name: serviceName,
  });

  if (!eventExists) {
    throw ApiError.badRequest("Invalid service name or service does not exist");
  }

  if (slotsBooked > eventExists.capacity - eventExists.consumedSlots) {
    throw ApiError.badRequest("Not enough slots available");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notfound("User not found");
  }

  const bookedService = await Booking.create({
    user: user._id,
    event: eventExists._id,
    slotsBooked,
    startTime: new Date(),
  });

  eventExists.consumedSlots += slotsBooked;

  await eventExists.save();

  return bookedService;
};

// get all service
const getAllService = async () => {
  const events = await Event.find({});
  return events;
};

// stop using services(stop spa, conference office service)

const endService = async (serviceName, userId) => {
  if (!serviceName || !userId) {
    throw ApiError.badRequest("Missing service name or UserId");
  }

  const name = serviceName.toLowerCase();

  const eventInfo = await Event.findOne({ name });

  if (!eventInfo) {
    throw ApiError.notfound("No such event found or exists");
  }

  const bookingInfo = await Booking.findOne({
    user: userId,
    event: eventInfo._id,
    status: "active",
  });

  if (!bookingInfo) {
    throw ApiError.notfound("Active booking not found");
  }

  bookingInfo.endTime = new Date();

  const durationMs = bookingInfo.endTime - bookingInfo.startTime;

  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

  const totalCost =
    eventInfo.firstHourCost * bookingInfo.slotsBooked +
    bookingInfo.slotsBooked *
      eventInfo.additionalHourCost *
      Math.max(0, durationHours - 1);

  bookingInfo.status = "completed";
  bookingInfo.totalCost = totalCost;

  eventInfo.consumedSlots -= bookingInfo.slotsBooked;

  await bookingInfo.save();
  await eventInfo.save();

  return {
    bookingInfo,
    eventInfo,
  };
};

// pay for the service consumed
const payForService = async (serviceName, userId) => {
  if (!serviceName || !userId)
    throw ApiError.badRequest("Missing Service-name or userid");

  const name = serviceName.toLowerCase();

  const serviceExists = await Event.findOne({ name });
  if (!serviceExists)
    throw ApiError.badRequest(
      "Incorrect service name. please write correct service name",
    );

  const bookingInfo = await Booking.findOne({
    user: userId,
    event: serviceExists._id,
    status: "completed",
  });

  if (!bookingInfo)
    throw ApiError.badRequest("No Booking found fot this service");

  if (bookingInfo.paymentStatus === "PAID")
    throw ApiError.conflict("Already paid for this service");

  bookingInfo.paymentStatus = "PAID";
  bookingInfo.paidAt = new Date();

  await bookingInfo.save();

  return bookingInfo;
};

export {
  createNewEvent,
  deleteEvent,
  bookEvent,
  getAllService,
  endService,
  payForService,
};
