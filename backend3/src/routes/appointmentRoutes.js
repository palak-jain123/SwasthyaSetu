const express = require("express");
const router = express.Router();

const Doctor = require("../models/doctorModel");
const Appointment = require("../models/Appointment");

// BOOK APPOINTMENT
router.post("/", async (req, res) => {
  try {
    const { userId, name, hospitalId, doctorId, specialization, date, time, reason } = req.body;

    let assignedDoctorId = doctorId;

    if (!assignedDoctorId) {
      const doctors = await Doctor.find({ hospitalId, specialization });
      if (doctors.length === 0) {
        return res.json({ message: "No doctor available" });
      }
      assignedDoctorId = doctors[Math.floor(Math.random() * doctors.length)]._id;
    }

    const newAppointment = new Appointment({
      userId,
      name,
      doctorId: assignedDoctorId,
      hospitalId,
      specialization,
      date,
      time,
      reason,
      status: "PENDING"
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment request sent",
      data: newAppointment
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET APPOINTMENTS FOR A DOCTOR
// In appointmentRoute.js, find this route:
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const data = await Appointment.find({ doctorId: req.params.doctorId })
      .sort({ createdAt: -1 });

    console.log("Found appointments:", data.length); // ← add this
    res.json({ success: true, data });
  } catch (err) {
    console.error("APPOINTMENT ROUTE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});
// APPROVE / REJECT APPOINTMENT
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await Appointment.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Update error" });
  }
});

// GET USER APPOINTMENTS
router.get("/:userId", async (req, res) => {
  try {
    const data = await Appointment.find({ userId: req.params.userId })
      .populate("doctorId");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Error fetching" });
  }
});

module.exports = router;