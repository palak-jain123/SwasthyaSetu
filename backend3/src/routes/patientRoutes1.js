const express = require("express");
const router = express.Router();
const MigrantProfile = require("../models/migrantProfile1");

// GET all patients
router.get("/patients", async (req, res) => {
  try {
    const patients = await MigrantProfile.find();
    res.json(patients);   // ✅ IMPORTANT
  } catch (err) {
    res.status(500).json({ message: "Error fetching patients" });
  }
});

module.exports = router;