const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  migrantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MigrantProfile",   // 🔥 LINK
    required: true
  },
  doctorName: String,
  diagnosis: String,
  medicines: [{ name: String, dose: String, duration: String }],
  notes: String,
  date: { type: Date, default: Date.now }
});
module.exports =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);