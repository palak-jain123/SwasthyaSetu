import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import responsive from "./responsive";
import logo from "./logo.png";
import { Link } from "react-router-dom";


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


const Login = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [forgotMode, setForgotMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};

    if (!form.username) err.username = "Username is required";
    if (!form.password && !forgotMode) err.password = "Password is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ LOGIN FUNCTION
  const handleLogin = async () => {
  if (!validate()) return;

  try {
    const res = await axios.post(
      "http://localhost:7001/api/auth/login",
      {
        username: form.username,
        password: form.password
      }
    );

    console.log("LOGIN RESPONSE:", res.data);

    const { token, role, userId } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);

    alert("Login Successful");

    const userRole = role.toLowerCase();

    if (userRole === "migrant") {
      navigate("/worker-home");
    } else if (userRole === "doctor") {
      navigate("/doctor-dashboard");
    } else if (userRole === "government") {
      navigate("/government-dashboard");
    } else if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else {
      alert("Unknown role: " + role);
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert(err.response?.data?.message || "Invalid Username or Password");
  }
};

  // RESET PASSWORD
  const handleResetPassword = async () => {
  if (!form.username || !newPassword) {
    alert("Fill all fields");
    return;
  }

  try {
    await axios.post("http://localhost:7001/api/auth/reset-password", {
      username: form.username,
      newPassword: newPassword
    });

    alert("Password updated successfully");
    setForgotMode(false);
  } catch (err) {
    alert("Error resetting password");
  }
};

  // Eye Icons
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

  return (
    <>
    <Header />
      <style>{responsive}</style>

      <div style={styles.page}>

        <div className="reg-card" style={styles.card}>

          <h2 style={styles.title}>
            {forgotMode ? "Reset Password" : "Health Portal Login"}
          </h2>

          <form style={styles.form} onSubmit={(e) => e.preventDefault()}>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              style={styles.input}
            />

            <p style={styles.error}>{errors.username}</p>

            {!forgotMode && (
              <>
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
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </span>

                </div>

                <p style={styles.error}>{errors.password}</p>

<button type="button" style={styles.btnPrimary} onClick={handleLogin}>                  Sign In
                </button>

                <p style={styles.link} onClick={() => setForgotMode(true)}>
                  Forgot Password?
                </p>

                <button
                  style={styles.btnOutline}
                  onClick={() => navigate("/choose-role")}
                >
                  Sign Up
                </button>

              </>
            )}

            {forgotMode && (
              <>

                <div style={styles.passwordWrapper}>

                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ ...styles.input, paddingRight: "42px" }}
                  />

                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    {showNewPassword ? <EyeOff /> : <EyeOpen />}
                  </span>

                </div>

               <button type="button" onClick={handleResetPassword}>
                  Reset Password
                </button>

                <p style={styles.link} onClick={() => setForgotMode(false)}>
                  ← Back to Login
                </p>

              </>
            )}

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
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer",
  },
  btnPrimary: {
    width: "100%",
    background: "#5d8aa8",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  btnOutline: {
    width: "100%",
    background: "white",
    color: "#5d8aa8",
    border: "2px solid #5d8aa8",
    padding: "11px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
  },
  link: {
    color: "#5d8aa8",
    cursor: "pointer",
    fontSize: "13px",
    marginTop: "10px",
    textAlign: "center",
    fontWeight: "600",
    textDecoration: "underline",
  },
  error: {
    color: "red",
    fontSize: "11px",
    minHeight: "15px",
  },
};

export default Login;