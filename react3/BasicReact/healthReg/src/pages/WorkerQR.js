import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
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
    height: "80px",
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
    height: "70px",
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
const WorkerQR = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ get userId safely
  const userId =
    location.state?.userId || localStorage.getItem("userId");

  const qrCodeFromBackend = location.state?.qrCode;

  // ✅ always define qrValue (no condition before hooks)
  const qrValue = userId
    ? `http://localhost:3000/patient/${userId}`
    : "";

  // ❌ DO NOT put useEffect here conditionally (removed error)

  // ❌ Instead handle invalid case like this
  if (!userId && !qrCodeFromBackend) {
    return <h2 style={{ marginTop: "120px" }}>Invalid QR Data</h2>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (


    <>
    <Header />
    <div style={styles.container}>
      <h2>Your Health QR Code</h2>

      {/* Backend QR or Generated QR */}
      {qrCodeFromBackend ? (
        <img
          src={qrCodeFromBackend}
          alt="QR Code"
          style={{ width: "220px", height: "220px" }}
        />
      ) : (
        <QRCodeCanvas value={qrValue} size={220} />
      )}

      <p style={{ marginTop: "10px" }}>
        Show this QR to doctor to access your records
      </p>

      {/* Print */}
      <button onClick={handlePrint} style={styles.button}>
        Download / Print QR
      </button>

      {/* Go Dashboard */}
      <button
        onClick={() => navigate("/worker-home")}
        style={{ ...styles.button, background: "green" }}
      >
        Go to Dashboard
      </button>
    </div>
    </>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "120px",
  },
  button: {
    marginTop: "15px",
    padding: "10px 15px",
    background: "#5d8aa8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default WorkerQR;