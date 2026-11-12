const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");

// ✅ GET prescription by migrantId
router.get("/:id", async (req, res) => {
  try {
    const data = await Prescription.find({
      migrantId: req.params.id
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;