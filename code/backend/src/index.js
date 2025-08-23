// En tu app principal (index.js)
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Configuración de CORS más específica
app.use(cors({
  origin: ["http://localhost:3000", "http://frontend:80"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use("/auth", authRoutes);

app.listen(5000, () => console.log("✅ Backend en http://localhost:5000"));