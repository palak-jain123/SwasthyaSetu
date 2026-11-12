const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  email: String,
  specialization: String,
  experience: Number,
  mobile: String,
});

module.exports = mongoose.model("DoctorProfile", doctorSchema);