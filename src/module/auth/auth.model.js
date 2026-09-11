import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import ROLES from "../../common/config/constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name cant be empty"],
      minlength: 3,
      maxlength: 25,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      minlength: 5,
      maxlength: 30,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password can't be empty"],
      minlength: 8,
      maxlength: 20,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
    },

    refreshToken: {
      type: String,
      select: false,
    },

    refreshTokenExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
