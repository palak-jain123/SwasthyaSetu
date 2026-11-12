const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
ref: "user",
    required: true
  },

  doctorId: {   // ✅ VERY IMPORTANT
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  hospitalId: {  // ✅ IMPORTANT
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },

  name: String,
  specialization: String,

  date: Date,
  time: String,
  reason: String,

  status: {   // ✅ CORE LOGIC FIELD
    type: String,
    enum: ["PENDING", "CONFIRMED", "REJECTED"],
    default: "PENDING"
  }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);