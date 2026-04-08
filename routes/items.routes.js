import express from "express";
import Item from "../models/Items.js";
import auth from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { generateQRCode } from "../utils/qr.js";

const router = express.Router();

// ✅ GET all items (public list)
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/qr/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    const qr = await generateQRCode(req.params.id);
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ My items
router.get("/my", auth, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get item by id
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ item });
    await Notification.create({
  userId: item.userId,
  message: "Your item might be found!",
});
  } catch {
    res.status(400).json({ message: "Invalid item id" });
  }
});

// ✅ Create item (upload image)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { type, title, category, description, location, date, color, contact } = req.body;

    if (!type || !title || !category || !description || !location || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const item = await Item.create({
      userId: req.user.id,
      type,
      title,
      category,
      description,
      location,
      date,
      color: color || "",
      contact: contact || "",
      image,
      status: "PENDING",
    });

    res.status(201).json({ message: "Item created", item });
  } catch (err) {
    console.error("CREATE ITEM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;