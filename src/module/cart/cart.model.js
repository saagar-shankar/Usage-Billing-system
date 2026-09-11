import mongoose, { Schema } from "mongoose";
import Event from "./cart.event.model.js";
import User from "../auth/auth.model.js";

const bookingSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    slotsBooked: {
      type: Number,
      required: true,
      min: 1,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },

    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "FAILED", "PAID"],
      default: "PENDING",
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
