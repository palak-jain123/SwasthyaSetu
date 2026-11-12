import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import responsive from "./responsive";
//header..............
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
//...........Worker Registration...........
const WorkerReg = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    gender: "",
    dob: "",
    age: "",
    aadhaar: "",
    bloodGroup: "",
    disorder: "",
    domicile: "",
    currentAddress: "",
    consent: false,
  });

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // AGE CALCULATION
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };

    if (name === "dob") updatedForm.age = calculateAge(value);

    setForm(updatedForm);
  };

  // SEND OTP
  const sendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:7001/api/otp/send", {
        aadhaar: form.aadhaar,
      });

      alert("OTP Sent: " + res.data.otp);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:7001/api/otp/verify", {
        aadhaar: form.aadhaar,
        otp: otp,
      });

      alert(res.data.message);
      setOtpVerified(true);
    } catch (err) {
      alert("Invalid OTP ❌");
    }
  };

  // VALIDATION
  const validate = () => {
    let err = {};

    if (!form.name.match(/^[A-Za-z ]{3,}$/))
      err.name = "Enter valid full name";

    if (!form.username.match(/^[A-Za-z0-9_]{6,}$/))
      err.username = "Username must be at least 6 characters";

    if (
      !form.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
      )
    )
      err.password = "Weak password";

    if (!form.gender) err.gender = "Gender required";

    if (!form.dob) err.dob = "DOB required";
    else if (form.age < 18 || form.age > 60)
      err.dob = "Age must be between 18 and 60";

    if (!/^\d{12}$/.test(form.aadhaar))
      err.aadhaar = "Invalid Aadhaar";

    if (!form.bloodGroup)
      err.bloodGroup = "Select blood group";

    if (!/^\d{6,12}$/.test(form.domicile))
      err.domicile = "Invalid domicile";

    if (!form.currentAddress.trim() || form.currentAddress.length < 10)
      err.currentAddress = "Enter valid address";

    if (!form.consent)
      err.consent = "Consent required";

    if (!otpVerified)
      err.otp = "Please verify OTP";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      console.log("Sending:", form.aadhaar, form.domicile);


      // REGISTER
const response = await axios.post("http://localhost:7001/api/auth/register", {
  ...form,
  role: "migrant",          // ✅ ADD THIS
  otpVerified: otpVerified
});

const userId = response.data.userId;
const name = response.data.name;
const qrCode = response.data.qrCode;

// ✅ STORE EVERYTHING
localStorage.setItem("userId", userId);
localStorage.setItem("name", name);
localStorage.setItem("qrCode", qrCode);

// ✅ NAVIGATE
navigate("/worker-qr");

    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Registration Failed ❌");
    }
  };
  return (
    <>
    <Header/>
      <style>{responsive}</style>

      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>Workers Registration Form</h2>

          <form onSubmit={handleSubmit} style={styles.form}>

            {/* NAME */}
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} style={styles.input} />
            <p style={styles.error}>{errors.name}</p>

            {/* USERNAME */}
            <input name="username" placeholder="Username" value={form.username} onChange={handleChange} style={styles.input} />
            <p style={styles.error}>{errors.username}</p>

            {/* PASSWORD */}
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
             <span
              onClick={() => setShowPassword((v) => !v)}
              style={styles.eyeIcon}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye-off SVG
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#888">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.196.47-2.334 1.29-3.29M6.53 6.53A8.96 8.96 0 0112 5c5 0 9 4 9 7a8.96 8.96 0 01-2.285 3.715M3 3l18 18" />
                  <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth={2} />
                </svg>
              ) : (
                // Eye SVG
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#888">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </span>
            </div>
            <p style={styles.error}>{errors.password}</p>

            {/* GENDER */}
            <select name="gender" value={form.gender} onChange={handleChange} style={styles.select}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <p style={styles.error}>{errors.gender}</p>

            {/* DOB */}
            <input type="date" name="dob" value={form.dob} onChange={handleChange} style={styles.input} />
            <p style={styles.error}>{errors.dob}</p>

            {/* AGE */}
            <input value={form.age} disabled placeholder="Age" style={styles.input} />

            {/* AADHAAR */}
<input
  name="aadhaar" placeholder="Aadhaar Number"
  value={form.aadhaar}
  onChange={handleChange}
  disabled={otpVerified}   // ✅ ADD THIS
/>
            <p style={styles.error}>{errors.aadhaar}</p>

            {/* OTP */}
            <button type="button" onClick={sendOtp} style={styles.button}>Send OTP</button>

            <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={styles.input} />

            <button type="button" onClick={verifyOtp} style={styles.button}>Verify OTP</button>
            <p style={styles.error}>{errors.otp}</p>

            {/* BLOOD GROUP */}
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} style={styles.select}>
              <option value="">Blood Group</option>
              <option>A+</option><option>B+</option><option>O+</option>
            </select>
            <p style={styles.error}>{errors.bloodGroup}</p>

            {/* DISORDER */}
            <input name="disorder" placeholder="Physical Disorder" value={form.disorder} onChange={handleChange} style={styles.input} />

            {/* DOMICILE */}
            <input name="domicile" placeholder="Domicile Number" value={form.domicile} onChange={handleChange} style={styles.input} />
            <p style={styles.error}>{errors.domicile}</p>

            {/* ADDRESS */}
            <textarea name="currentAddress" placeholder="Address" value={form.currentAddress} onChange={handleChange} style={styles.textarea} />
            <p style={styles.error}>{errors.currentAddress}</p>

            {/* CONSENT */}
            <label style={styles.checkbox}>
              <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
              I agree to share my data with Government Authorities
            </label>

            <button type="submit" style={styles.button}>Register</button>

          </form>
        </div>
      </div>
    </>
  );
};

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

export default WorkerReg;