import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./config/supabase.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin/index.js";
import staffRoutes from "./routes/staff/index.js";
import cashierRoutes from "./routes/cashier/index.js";
import publicRoutes from "./routes/public/index.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
].filter(Boolean);

// CORS - cho phép frontend gọi API
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (như curl, Postman, test, mobile app)
      if (!origin) return callback(null, true);

      // Cho phép tất cả các port localhost / 127.0.0.1 khi chạy local development
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/test-supabase", async (req, res) => {
  const { data, error } = await supabase.from("auth.users").select("*");

  if (error) return res.status(500).json(error);
  res.json(data);
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/cashier", cashierRoutes);
app.use("/api/public", publicRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

export default app;
