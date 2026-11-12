import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import responsive from "./responsive";


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


//.....................CHOOSE ROLE PAGE.................

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    
  <>
    <Header/>
    <style>{responsive}</style>
    <div style={styles.page}>
      <div className="reg-card" style={styles.card}>
        <h2 style={styles.title}>Choose Your Role</h2>

        <button
          style={styles.button}
          onClick={() => navigate("/doctor-register")}
        >
           Doctor
        </button>

        <button
          style={styles.button}
          onClick={() => navigate("/worker-register")}
        >
          Migrant Worker
        </button>

        

      </div>
    </div>
     </>
  );
};

const styles = {
  page: {
    minHeight: "85vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef4f8",
    
  },
  card: {
    background: "white",
    width: "350px",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 15px #5d8aa8",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#5d8aa8",
  },
  button: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    background: "#5d8aa8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default ChooseRole;
 