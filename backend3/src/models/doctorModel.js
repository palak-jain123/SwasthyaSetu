const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  hospitalId: {   // ✅ ADD THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  licenseId: String,
  mobile: String,
  specialization: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);