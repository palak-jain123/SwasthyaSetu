// doctorRoute.js — CORRECTED
const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");

// GET doctors by hospital + specialization
router.get("/doctors/:hospitalId/:specialization", async (req, res) => {
  try {
    const { hospitalId, specialization } = req.params;
    const doctors = await Doctor.find({ hospitalId, specialization });
    res.json({ data: doctors });  // ✅ FIXED — was res.json({ doctor }) by mistake
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// GET doctor profile by userId
router.get("/doctor/:userId", async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor });  // ✅ correct
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;