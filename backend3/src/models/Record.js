const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  diag: String,
  rx: String,
  hosp: String,
  doc: String,
  date: String
});

module.exports = mongoose.model("Record", recordSchema);