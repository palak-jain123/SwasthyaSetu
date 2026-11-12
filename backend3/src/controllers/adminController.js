const Doctor = require("../models/doctorModel");

// 🔹 Get pending doctors
exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "pending" });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Approve doctor
exports.approveDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });
    res.json({ message: "Doctor approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Reject doctor
exports.rejectDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });
    res.json({ message: "Doctor rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};