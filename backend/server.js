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
import aiRouter from "./routes/ai.routes.js";

dotenv.config();



const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://l3gradproj.onrender.com",
].filter(Boolean);
const __dirname = path.resolve();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" })); // Allow base64 image payloads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // Middleware to parse cookies
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/ai", aiRouter);
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
