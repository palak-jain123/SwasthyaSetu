import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import responsive from "./responsive";
//header..............
import { Link } from "react-router-dom";
import logo from "./logo.png";

const headerStyles = {
  navbar: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "85px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0px 15px",
    background: "#5d8aa8",
    border: "3px solid white",
    boxSizing: "border-box",
    zIndex: "1000",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },

  logoImg: {
    height: "75px",
    width: "auto",
    objectFit: "contain",
  },

 menu: {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  gap: "35px",
  fontFamily: "'Poppins', Arial, sans-serif",
},

 link: {
  textDecoration: "none",
  color: "white",
  fontWeight: "600",
  fontSize: "20px",
  fontFamily: "'Poppins', Arial, sans-serif",
 }};
const Header = () => {
  return (
    <>
    
     <div style={headerStyles.navbar}>

        {/* LOGO */}
        <div style={headerStyles.logo}>
          <img src={logo} alt="Health Logo" style={headerStyles.logoImg} />
        </div>

        {/* MENU */}
        <div style={headerStyles.menu}>
          <Link to="/"        style={headerStyles.link}>Home</Link>
          <Link to="/about"   style={headerStyles.link}>About Us</Link>
          <Link to="/scheme"  style={headerStyles.link}>Scheme</Link>
          <Link to="/contact" style={headerStyles.link}>Contact Us</Link>
          <Link to="/login"   style={headerStyles.link}>Login</Link>
        </div>

      </div>
    </>
  );
};
const DoctorReg = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    licenseId: "",
    mobile: "",
    specialization: "",
    hospitalId: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});

  const [hospitals, setHospitals] = useState([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get("http://localhost:7001/api/hospitals");
        console.log("API RESPONSE:", res.data);
        setHospitals(res.data.data);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      } finally {
        setHospitalsLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("CHANGE:", name, value);
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    let err = {};
    if (!form.name.match(/^[A-Za-z ]{3,}$/)) err.name = "Enter valid full name";
    if (!form.username.match(/^[A-Za-z0-9_]{6,}$/))
      err.username = "Username must be at least 6 characters";
    if (
      !form.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
      )
    )
      err.password =
        "Password must contain uppercase, lowercase, number & special character -A-Z, a-z, 0-9, @$!%*?&";
    if (!form.licenseId.match(/^[A-Z0-9]{6,12}$/))
      err.licenseId = "Enter valid Doctor License ID";
    if (!/^\d{10}$/.test(form.mobile)) err.mobile = "Mobile number must be 10 digits";
    if (!form.specialization) err.specialization = "Specialization required";
    if (!form.hospitalId) err.hospitalId = "Select your hospital";
    if (!form.consent) err.consent = "Consent is mandatory";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      console.log("FORM DATA BEFORE SEND:", form);
      const res = await axios.post(
        "http://localhost:7001/api/auth/doctor-register",
        form
      );
      alert(res.data.message);
      console.log("Registered Doctor:", res.data.doctor);
      navigate("/login");
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  // ── styles ───────────────────────────────
  const styles = {
    page: {
      background: "#f8fffc",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px 16px",
      paddingTop: "90px",
    },

    card: {
      background: "white",
      width: "440px",
      padding: "28px 30px",
      borderRadius: "12px",
      boxShadow: "0 0 14px #5d8aa8",
    },

    title: {
      textAlign: "center",
      color: "#5d8aa8",
      marginBottom: "20px",
      fontSize: "20px",
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },

    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
    },

    select: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      background: "white",
      color: "#333",
      cursor: "pointer",
    },

    textarea: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      resize: "vertical",
      boxSizing: "border-box",
      outline: "none",
      fontFamily: "inherit",
    },

    passwordWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },

    eyeIcon: {
      position: "absolute",
      right: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },

    button: {
      background: "#5d8aa8",
      color: "white",
      border: "none",
      padding: "12px",
      borderRadius: "6px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
      fontSize: "15px",
    },

    error: {
      color: "red",
      fontSize: "11px",
      margin: "2px 0",
      minHeight: "15px",
    },

    checkbox: {
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
      marginTop: "6px",
    },
  };

  // ── render ───────────────────────────────
  return (
    <>
      <Header />
      <style>{responsive}</style>
      <div style={styles.page}>
        <div className="reg-card" style={styles.card}>
          <h2 style={styles.title}>Doctor Registration Form</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
            />
            <p style={styles.error}>{errors.name}</p>

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              style={styles.input}
            />
            <p style={styles.error}>{errors.username}</p>

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />
            <p style={styles.error}>{errors.password}</p>

            {/* License ID */}
            <input
              type="text"
              name="licenseId"
              placeholder="License ID"
              value={form.licenseId}
              onChange={handleChange}
              style={styles.input}
            />
            <p style={styles.error}>{errors.licenseId}</p>

            {/* Mobile */}
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              style={styles.input}
            />
            <p style={styles.error}>{errors.mobile}</p>

            {/* Specialization */}
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={form.specialization}
              onChange={handleChange}
              style={styles.input}
            />
            <p style={styles.error}>{errors.specialization}</p>

            {/* Hospital Dropdown */}
            <select
              name="hospitalId"
              value={form.hospitalId}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">-- Select Hospital --</option>
              {hospitals.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} — {h.city}
                </option>
              ))}
            </select>
            <p style={styles.error}>{errors.hospitalId}</p>

            {/* Consent */}
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
              />
              &nbsp;I agree to share my data with Government Authorities
            </label>
            <p style={styles.error}>{errors.consent}</p>

            <button type="submit" style={styles.button}>
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DoctorReg;