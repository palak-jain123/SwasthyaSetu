const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: String,
  city: String,
  type: String,
  speciality: [String],
  phone: String,
  address: String
});

module.exports = mongoose.model("Hospital", hospitalSchema);