import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get notifications
router.get("/", async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark as read
router.patch("/:id", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: "Updated" });
});

export default router;