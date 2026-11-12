import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PatientView = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:7001/api/profile/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Patient Details</h2>
      <p>Name: {data.name}</p>
      <p>Age: {data.age}</p>
      <p>Blood Group: {data.bloodGroup}</p>
      <p>Disorder: {data.disorder}</p>
    </div>
  );
};

export default PatientView;