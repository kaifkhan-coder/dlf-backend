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

router.patch("/claims/:id/reject", auth, admin, async (req, res) => {
  try {
    console.log("👉 REJECT API HIT:", req.params.id);

    const claim = await Claim.findById(req.params.id);
    console.log("FOUND CLAIM:", claim);

    if (!claim) return res.status(404).json({ message: "Not found" });

    claim.status = "rejected";
    await claim.save();

    res.json({ message: "Rejected" });

  } catch (err) {
    console.error("❌ REJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/claims", auth, admin, async (req, res) => {
  try {

const claims = await Claim.find()
  .populate("itemId", "title image")
  .populate("userId", "name email");

const formatted = claims.map(c => ({
  _id: c._id,
  userName: c.userId?.name || "Unknown",
  studentId: c.userId?.email || "N/A",
  proofText: c.proofText,
  itemId: c.itemId,
  status: c.status
}));
    res.json(formatted);
  } catch (err) {
    console.error("❌ CLAIM ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
