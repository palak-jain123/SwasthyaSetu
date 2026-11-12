const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: String,
  time: String,
  type: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);