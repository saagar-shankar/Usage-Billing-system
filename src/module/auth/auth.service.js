import User from "./auth.model.js";
import ApiError from "../../common/utils/api.error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashTheToken,
} from "../../common/utils/jwt.utils.js";

// register a user
const registerService = async (data) => {
  const { name, email, password } = data;
  if (!name || !email || !password)
    throw ApiError.badRequest("Missing name, email or password");

  const existingUser = await User.findOne({ email });

  if (existingUser)
    throw ApiError.conflict("User with this email already exists");

  const user = await User.create({
    name,
    email,
    password,
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj };
};

// login user

const loginService = async (data) => {
  const { email, password } = data;
  if (!email || !password)
    throw ApiError.badRequest("Missing email or password");

  const user = await User.findOne({ email }).select("+password");

  if (!user) throw ApiError.badRequest("User not found");

  const verifiedPassword = await user.comparePassword(password);
  if (!verifiedPassword) throw ApiError.badRequest("Invalid email or password");

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
  });

  user.refreshToken = hashTheToken(refreshToken);

  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

// logout a user

const logoutService = async (userId) => {
  if (!userId) throw ApiError.badRequest("user not authenticated");

  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export { registerService, logoutService, loginService };
