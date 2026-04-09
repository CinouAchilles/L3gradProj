import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import cartRouter from "./routes/cart.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import orderRouter from "./routes/order.routes.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
const __dirname = path.resolve();

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/orders", orderRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

console.log("Server is running...");
