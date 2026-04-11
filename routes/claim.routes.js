import express from "express";
import Claim from "../models/Claim.js";
import Item from "../models/Items.js";

const router = express.Router();

// CREATE CLAIM
router.post("/", async (req, res) => {
  try {
    const { itemId, userName, studentId, proofText } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Invalid Item" });
    }

    if (item.status === "claimed") {
      return res.status(400).json({ message: "Already claimed" });
    }

    const existing = await Claim.findOne({ itemId, studentId });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const claim = new Claim({
      itemId,
      userName,
      studentId,
      proofText
    });

    await claim.save();

    res.json({ message: "Claim submitted", claim });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL CLAIMS (Admin)
router.get("/", async (req, res) => {
  const claims = await Claim.find().populate("itemId, userId").sort({ createdAt: -1 }, "name email proofText status studentId");
  res.json(claims);
});

// APPROVE CLAIM
router.put("/:id/approve", async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: "Not found" });

  claim.status = "approved";
  await claim.save();

  await Item.findByIdAndUpdate(claim.itemId, { status: "claimed" });

  res.json({ message: "Approved" });
});

// REJECT CLAIM
router.put("/:id/reject", async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: "Not found" });

  claim.status = "rejected";
  await claim.save();

  res.json({ message: "Rejected" });
});



export default router;