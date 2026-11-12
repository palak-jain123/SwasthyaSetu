const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  mobile: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true,
    enum: [
      "General Medicine",
      "Cardiology",
      "Orthopedics",
      "Paediatrics",
      "Gynaecology",
      "Emergency"
    ]
  },

  message: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);