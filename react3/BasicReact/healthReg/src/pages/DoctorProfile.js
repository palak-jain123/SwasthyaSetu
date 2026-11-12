import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorProfile = () => {

  // ✅ Get logged-in doctor info from localStorage
  const doctorId = localStorage.getItem("doctorId");
  const doctorName = localStorage.getItem("doctorName");

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
      fetchAppointments();
    }
  }, [doctorId]);

  // ✅ Fetch doctor details
  const fetchDoctor = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7001/api/doctor/${doctorId}`
      );
      setDoctor(res.data);
    } catch (err) {
      console.error("Doctor fetch error:", err);
    }
  };

  // ✅ Fetch appointments of logged-in doctor
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7001/api/dashboard/appointments`
      );

      const filtered = res.data.filter(
        (a) => a.doctorId === doctorId
      );

      setAppointments(filtered);
    } catch (err) {
      console.error("Appointments fetch error:", err);
    }
  };

  // ❌ If not logged in
  if (!doctorId) {
    return <p>Please login first ❌</p>;
  }

  // ⏳ Loading
  if (!doctor) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: 20 }}>

      {/* ✅ Instant name + API fallback */}
      <h2>Welcome Dr. {doctor?.name || doctorName}</h2>

      <div style={{
        padding: 15,
        border: "1px solid #ccc",
        borderRadius: 8,
        marginBottom: 20
      }}>
        <p><strong>Username:</strong> {doctor.username}</p>
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>Hospital:</strong> {doctor.hospital}</p>
        <p><strong>Status:</strong> {doctor.status}</p>
      </div>

      <h3>Appointments</h3>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((a, i) => (
          <div key={i} style={{
            padding: 12,
            border: "1px solid #ddd",
            marginBottom: 10,
            borderRadius: 6
          }}>
            <p><b>Patient:</b> {a.patient}</p>
            <p><b>Time:</b> {a.time}</p>
            <p><b>Status:</b> {a.status}</p>
          </div>
        ))
      )}

    </div>
  );
};

export default DoctorProfile;