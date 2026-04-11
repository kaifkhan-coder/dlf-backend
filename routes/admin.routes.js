import express from "express";
import Item from "../models/Items.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import Claim from "../models/Claim.js";

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

router.patch("/claims/:id/approve", auth, admin, async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: "Not found" });

  claim.status = "approved";
  await claim.save();

  res.json({ message: "Approved" });
});

router.patch("/admin/claims/:id/reject", auth, admin, async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: "Not found" });

  claim.status = "rejected";
  await claim.save();

  res.json({ message: "Rejected" });
});

router.get("/admin/claims", auth, admin, async (req, res) => {
  const claims = await Claim.find()
    .populate("userId", "name email")
    .populate("itemId", "title image");

  const formatted = claims.map(c => ({
    _id: c._id,
    userName: c.userId?.name,
    studentId: c.userId?.email,
    proofText: c.proofText,
    itemId: c.itemId,
    status: c.status
  }));

  res.json(formatted);
});

export default router;
