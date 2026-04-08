import express from "express";
import Claim from "../models/Claim.js";

const router = express.Router();

// ✅ Create claim
router.post("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, email, color, description } = req.body;

    const claim = await Claim.create({
      itemId,
      name,
      email,
      color,
      description,
    });

    res.json({ message: "Claim submitted", claim });
  } catch (err) {
    res.status(500).json({ message: "Error creating claim" });
  }
});

// ✅ Get all claims (admin)
router.get("/", async (req, res) => {
  const claims = await Claim.find().populate("itemId");
  res.json(claims);
});

// ✅ Approve / Reject
router.patch("/:id", async (req, res) => {
  const { status } = req.body;

  const claim = await Claim.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(claim);
});

export default router;