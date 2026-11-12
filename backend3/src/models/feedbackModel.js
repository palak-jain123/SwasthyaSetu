const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  feedback: String,
  name: String,
  email: String,
  mobile: String
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);