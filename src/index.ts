import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MONGODB_URL, PORT } from "./config.js";
import { router } from "./routes/api.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API работает" });
});

app.use("/api", router);

try {
  await mongoose.connect(MONGODB_URL);
  console.log("База данных подключена");
} catch (e) {
  console.log("База не подключилась");
  console.log(e);
}

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});

export default app;
