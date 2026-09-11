import ApiError from "../../common/utils/api.error.js";
import ROLES from "../../common/config/constants.js";
import User from "./auth.model.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

const authenticate = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.includes("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw ApiError.unauthorize("Not Authenticated. Please Login");
  }

  const verifiedToken = verifyAccessToken(token);
  const user = await User.findById(verifiedToken.id);

  if (!user) throw ApiError.notFound("User not exists");

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
};

const authorized = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.unauthorized(
        "You do not have the permission to perform this action",
      );
    }
    next();
  };
};

export { authenticate, authorized };
