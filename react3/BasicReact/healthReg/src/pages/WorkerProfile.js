import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const WorkerProfile = () => {
  const { userId } = useParams();
  const [worker, setWorker] = useState(null);
  const [records, setRecords] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Worker details
        const resWorker = await axios.get(`http://localhost:7001/api/workers/${userId}`);
        setWorker(resWorker.data);

        // Records from backend
        const resRecords = await axios.get(`http://localhost:7001/api/workers/${userId}/records`);
        setRecords(resRecords.data);

        const resVaccines = await axios.get(`http://localhost:7001/api/workers/${userId}/vaccines`);
        setVaccines(resVaccines.data);

        const resHospitals = await axios.get(`http://localhost:7001/api/hospitals`);
        setHospitals(resHospitals.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return <p style={{marginTop:100}}>Loading...</p>;
  if (!worker) return <p style={{marginTop:100}}>Worker not found</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <h2>Welcome {worker.name}</h2>

      {/* Profile Section */}
      <div style={{ margin: "20px 0", padding: "15px", border: "1px solid #ccc", borderRadius: "10px" }}>
        <p><strong>Username:</strong> {worker.username}</p>
        <p><strong>Age:</strong> {worker.age}</p>
        <p><strong>Gender:</strong> {worker.gender}</p>
        <p><strong>Blood Group:</strong> {worker.bloodGroup}</p>
        <p><strong>Domicile:</strong> {worker.domicile}</p>
        <p><strong>Address:</strong> {worker.currentAddress}</p>
      </div>

      {/* QR Scanner */}
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <h3>Doctor QR Access</h3>
        <QRCodeCanvas value={`http://localhost:3000/patient/${worker._id}`} size={180} />
        <p>Doctor can scan this QR to access health records</p>
      </div>

      {/* Medical Records */}
      <div style={{ marginTop: 30 }}>
        <h3>Medical Records</h3>
        {records.length ? (
          records.map((r, i) => (
            <div key={i} style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px", borderRadius: "6px" }}>
              <p><strong>Date:</strong> {r.date}</p>
              <p><strong>Hospital:</strong> {r.hosp}</p>
              <p><strong>Doctor:</strong> {r.doc}</p>
              <p><strong>Diagnosis:</strong> {r.diag}</p>
              <p><strong>Prescription:</strong> {r.rx}</p>
              <p><strong>Status:</strong> {r.status}</p>
            </div>
          ))
        ) : <p>No records available</p>}
      </div>

      {/* Vaccinations */}
      <div style={{ marginTop: 30 }}>
        <h3>Vaccination History</h3>
        {vaccines.length ? (
          <ul>
            {vaccines.map((v, i) => (
              <li key={i}>
                {v.vac} - {v.dose} ({v.date}) at {v.hosp} [{v.done ? "Done" : "Pending"}]
              </li>
            ))}
          </ul>
        ) : <p>No vaccination data</p>}
      </div>
    </div>
  );
};

export default WorkerProfile;