const express = require("express");
const router = express.Router();
const Enquiry = require("../models/enquiryModel");

// ================= CREATE ENQUIRY =================
router.post("/enquiry", async (req, res) => {
  try {
    const { name, email, mobile, department, message } = req.body;

    // Basic validation
    if (!name || !email || !mobile || !department || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const enquiry = new Enquiry({
      name,
      email,
      mobile,
      department,
      message
    });

    await enquiry.save();

    res.status(201).json({
      message: "Enquiry submitted successfully",
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      message: "Error saving enquiry",
      error: error.message
    });
  }
});


// ================= GET ALL ENQUIRIES =================
router.get("/enquiry", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= GET BY DEPARTMENT =================
router.get("/enquiry/department/:dept", async (req, res) => {
  try {
    const data = await Enquiry.find({ department: req.params.dept });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;