import { Router } from "express";
import ApiResponse from "../../common/utils/api.response.js";
import * as authService from "./auth.service.js";
import cookie from "cookie-parser";

const register = async (req, res) => {
  const user = await authService.registerService(req.body);
  ApiResponse.created(res, "User registered successfully", user);
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginService(
    req.body,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiResponse.ok(res, "User logged in", { user, accessToken });
};

const logout = async (req, res) => {
  const user = await authService.logoutService(req.user.id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  ApiResponse.ok(res, "User logged out", user);
};

export { register, login, logout };
