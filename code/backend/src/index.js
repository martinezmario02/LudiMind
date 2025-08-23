import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
// import gameRoutes from "./routes/gameRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
// app.use("/games", gameRoutes);

app.listen(3000, () => console.log("✅ Backend en http://localhost:3000"));