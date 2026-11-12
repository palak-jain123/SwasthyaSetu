const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: String,
  username: String,
  age: Number,
  gender: String,
  bloodGroup: String,
  domicile: String,
  currentAddress: String
});

module.exports = mongoose.model("Worker", workerSchema);