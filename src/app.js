import express from "express";
import cookieParser from "cookie-parser";
import cartRoutes from "./module/cart/cart.routes.js";
import authRoutes from "./module/auth/auth.routes.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: "True",
    message: "Health route is running..",
  });
});

export default app;
