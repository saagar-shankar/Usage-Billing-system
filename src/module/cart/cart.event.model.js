import mongoose, { Schema } from "mongoose";
import User from "../auth/auth.model.js";

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    consumedSlots: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.capacity;
        },
        message: "Consumed slots cannot exceed capacity",
      },
    },

    firstHourCost: {
      type: Number,
      required: true,
      min: 1,
    },

    additionalHourCost: {
      type: Number,
      required: true,
      min: 1,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
