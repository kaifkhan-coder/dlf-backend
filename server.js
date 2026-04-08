import dotenv from "dotenv";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/items.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import UserRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notification.routes.js";
import ClaimRoutes from "./routes/claim.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: true, // allow all localhost ports
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => res.send("API is running of Campus Trace ✅"));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/claims", ClaimRoutes);
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(process.env.PORT, () =>
      console.log(`Server: http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));