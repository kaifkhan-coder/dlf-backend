import express from "express";
import Item from "../models/Items.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// ✅ Admin: get all items
router.get("/items", auth, admin, async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json({ items });
});

// ✅ Admin: update item status
router.patch("/items/:id/status", auth, admin, async (req, res) => {
  const { status } = req.body;

  const allowed = ["PENDING", "VERIFIED", "REJECTED", "RETURNED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  res.json({ item });
});


export default router;
