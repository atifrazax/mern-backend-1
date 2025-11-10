import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/api.routes.js";
import cookieParser from "cookie-parser";
import rateLimit from "./utils/rateLimit.js";
const app = express();
connectDB();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
); // Enable CORS

app.use(rateLimit); // Apply the rate limit

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to backend API" });
});

app.use("/api", apiRoutes); // Use the API routes

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
