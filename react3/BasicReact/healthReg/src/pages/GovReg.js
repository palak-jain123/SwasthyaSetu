import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import responsive from "./responsive";

const GovernmentReg = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    username: "",
    password: "",
    contact: "",
    pincode: "",
    district: "",
    state: "",
    address: "",
    consent: false,
  });

  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus]   = useState(""); // "found" | "error" | ""

  // ── handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Auto-fetch district & state when pincode reaches 6 digits
  const handlePincodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm((prev) => ({ ...prev, pincode: value, district: "", state: "" }));
    setPincodeStatus("");

    if (value.length === 6) {
      setPincodeLoading(true);
      try {
        const res  = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          const po = data[0].PostOffice[0];
          setForm((prev) => ({ ...prev, district: po.District, state: po.State }));
          setPincodeStatus("found");
        } else {
          setPincodeStatus("error");
        }
      } catch {
        setPincodeStatus("error");
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  // ── validation ─────────────────────────────────────────────────────────────

  const validate = () => {
    let err = {};

    if (!form.employeeId.match(/^[A-Z0-9]{4,}$/))
      err.employeeId = "Enter valid Employee ID (uppercase alphanumeric, min 4)";

    if (!form.employeeName.match(/^[A-Za-z ]{3,}$/))
      err.employeeName = "Enter valid employee name";

    if (!form.username.match(/^[A-Za-z0-9_]{6,}$/))
      err.username = "Username must be at least 6 characters";

    if (!form.password.match(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/))
      err.password = "Password must contain letters and numbers (min 6)";

    if (!/^\d{10}$/.test(form.contact))
      err.contact = "Contact must be 10 digits";

    if (!/^\d{6}$/.test(form.pincode))
      err.pincode = "Enter valid 6-digit pincode";
    else if (!form.district)
      err.pincode = "Invalid pincode — district could not be fetched";

    if (!form.address.trim())
      err.address = "Address required";

    if (!form.consent)
      err.consent = "Consent required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ── submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userData = {
      username: form.username,
      password: form.password,
      role: "government",
    };

    localStorage.setItem(form.username, JSON.stringify(userData));
    alert("Government Registration Successful");
    navigate("/government-dashboard");
  };

  // ── Eye Icon SVGs (same as DoctorReg) ──────────────────────────────────────
  const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#888">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOff = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#888">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.196.47-2.334 1.29-3.29M6.53 6.53A8.96 8.96 0 0112 5c5 0 9 4 9 7a8.96 8.96 0 01-2.285 3.715M3 3l18 18" />
      <circle cx="12" cy="12" r="3" stroke="#888" strokeWidth={2} />
    </svg>
  );

  // ── render ─────────────────────────────────────────────────────────────────

   return (
  <>
    <style>{responsive}</style>
    <div style={styles.page}>
      <div className="reg-card" style={styles.card}>
        <h2 style={styles.title}>Government  Registration Form</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* 1. Employee ID */}
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            style={styles.input}
          />
          <p style={styles.error}>{errors.employeeId}</p>

          {/* 2. Employee Name */}
          <input
            type="text"
            name="employeeName"
            placeholder="Employee Name"
            value={form.employeeName}
            onChange={handleChange}
            style={styles.input}
          />
          <p style={styles.error}>{errors.employeeName}</p>

          {/* 3. Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />
          <p style={styles.error}>{errors.username}</p>

          {/* 4. Password + Eye Icon */}
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={{ ...styles.input, paddingRight: "42px" }}
            />
            <span
              onClick={() => setShowPassword((v) => !v)}
              style={styles.eyeIcon}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <EyeOpen />}
            </span>
          </div>
          <p style={styles.error}>{errors.password}</p>

          {/* 5. Contact */}
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            maxLength={10}
            style={styles.input}
          />
          <p style={styles.error}>{errors.contact}</p>

          {/* 6. Pincode */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handlePincodeChange}
              maxLength={6}
              style={styles.input}
            />
            {pincodeLoading && (
              <span style={{ ...styles.pinBadge, color: "#b8600a", background: "#fff8e1" }}>
                🔄 Fetching…
              </span>
            )}
            {!pincodeLoading && pincodeStatus === "found" && (
              <span style={{ ...styles.pinBadge, color: "#2e7d32", background: "#e8f5e9" }}>
                ✅ Found
              </span>
            )}
            {!pincodeLoading && pincodeStatus === "error" && (
              <span style={{ ...styles.pinBadge, color: "#c0392b", background: "#fdecea" }}>
                ❌ Invalid
              </span>
            )}
          </div>
          <p style={styles.error}>{errors.pincode}</p>

          {/* 7. District & State — auto-filled */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              readOnly
              placeholder="District & State"
              value={
                form.district
                  ? `${form.district}${form.state ? ",  " + form.state : ""}`
                  : ""
              }
              style={{
                ...styles.input,
                background: form.district ? "#eaf4ff" : "#f9f9f9",
                color:      form.district ? "#1a237e"  : "#aaa",
                fontWeight: form.district ? "600"       : "400",
                cursor: "not-allowed",
              }}
            />
            {form.district && (
              <span style={styles.autoChip}>Auto</span>
            )}
          </div>
          <p style={styles.error}></p>

          {/* 8. Office Address */}
          <textarea
            name="address"
            placeholder="Office Address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            style={styles.textarea}
          />
          <p style={styles.error}>{errors.address}</p>

          {/* 9. Consent */}
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
            />
            &nbsp;I confirm that I am an authorized government employee
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

// ── styles — exact copy from DoctorReg ───────────────────────────────────────

const styles = {
  page: {
    background: "#f8fffc",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 0",
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
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
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
  pinBadge: {
    display: "inline-block",
    marginTop: "5px",
    fontSize: "12px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  autoChip: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "10px",
    fontWeight: "700",
    background: "#5d8aa8",
    color: "white",
    padding: "2px 7px",
    borderRadius: "20px",
    letterSpacing: "0.4px",
    pointerEvents: "none",
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
    margin: "2px 0 2px 0",
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

export default GovernmentReg;
