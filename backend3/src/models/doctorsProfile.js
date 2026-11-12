import { useEffect, useState } from "react";
import axios from "axios";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // must be userId
    if (!userId) return;

    axios.get(`http://localhost:7001/api/doctor/${userId}`)
      .then(res => {
        console.log("Doctor API Response:", res.data);
setDoctor(res.data.doctor)
      })
      .catch(err => console.log("Error fetching doctor:", err));
  }, []);

  if (!doctor) return <div>Loading...</div>;

  return (
    <div>
      <h1>{doctor.name}</h1>
      <p>Mobile: {doctor.mobile}</p>
      <p>License: {doctor.licenseId}</p>
      <p>Specialization: {doctor.specialization}</p>
      <p>Status: {doctor.status}</p>
    </div>
  );
};

export default DoctorProfile;