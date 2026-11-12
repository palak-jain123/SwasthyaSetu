const express = require("express");
const router = express.Router();

const Doctor = require("../models/doctorModel");

// ✅ Get all pending doctors
router.get("/pending-doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "pending" });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Approve doctor
router.put("/approve/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, {
      status: "approved"
    });

    res.json({ message: "Doctor Approved ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Reject doctor
router.put("/reject/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, {
      status: "rejected"
    });

    res.json({ message: "Doctor Rejected ❌" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all approved doctors
router.get("/approved-doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;