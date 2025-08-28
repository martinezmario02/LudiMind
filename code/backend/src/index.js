import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import gamesRoutes from "./routes/gamesRoutes.js";

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://frontend:80"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);

app.listen(5000, () => console.log("✅ Backend en http://localhost:5000"));