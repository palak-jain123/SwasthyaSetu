const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedbackModel");


// ================= SUBMIT FEEDBACK =================
router.post("/feedback", async (req, res) => {
  try {
    const { feedback, name, email, mobile } = req.body;

    // Basic validation
    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required" });
    }

    const newFeedback = new Feedback({
      feedback,
      name,
      email,
      mobile
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: newFeedback
    });

  } catch (error) {
    res.status(500).json({
      message: "Error saving feedback",
      error: error.message
    });
  }
});


// ================= GET ALL FEEDBACK =================
router.get("/feedback", async (req, res) => {
  try {
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(allFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;