const Hospital = require("../models/hospitalModel");
const Doctor = require("../models/doctorModel");

// ✅ GET ALL HOSPITALS
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json({ success: true, data: hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET HOSPITAL BY ID
exports.getHospitalById = async (req, res) => {
  try {
    const hospitalId = req.params.id;

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const doctors = await Doctor.find({ hospitalId });

    const specializations = [
      ...new Set(doctors.map(d => d.speciality))
    ];

    res.json({
      success: true,
      data: {
        ...hospital._doc,
        specializations
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};