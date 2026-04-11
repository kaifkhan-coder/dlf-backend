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

router.put("/claims/:id/approve", async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: "Not found" });
  claim.status = "approved";
  await claim.save();
  res.json({ message: "Approved" });
});

router.put("/claims/:id/reject", async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: "Not found" });
  claim.status = "rejected";
  await claim.save();
  res.json({ message: "Rejected" });
});

export default router;
