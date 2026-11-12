import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";

const responsive = `
  * { box-sizing: border-box; }

  /* ── Tablet 768px ── */
  @media (max-width: 768px) {
    .reg-card { width: 90% !important; padding: 22px 20px !important; }
    .nav-menu { gap: 18px !important; }
    .nav-link  { font-size: 16px !important; }
  }

  /* ── Mobile 480px ── */
  @media (max-width: 480px) {
    .reg-card { width: 95% !important; padding: 18px 14px !important; border-radius: 10px !important; }
    .reg-card input, .reg-card select, .reg-card textarea { font-size: 13px !important; padding: 9px 10px !important; }
    .reg-card button[type="submit"] { font-size: 14px !important; padding: 11px !important; }
    .reg-card h2 { font-size: 17px !important; }
    .nav-menu { gap: 10px !important; }
    .nav-link  { font-size: 13px !important; }
    .nav-admin { display: none !important; }
  }

  /* ── Small Mobile 360px ── */
  @media (max-width: 360px) {
    .reg-card { width: 100% !important; border-radius: 0 !important; box-shadow: none !important; padding: 16px 12px !important; }
    .nav-menu { gap: 8px !important; }
    .nav-link  { font-size: 11px !important; }
  }
`;

const Header = () => {
  return (
    <>
      <style>{responsive}</style>
      <div style={styles.navbar}>

        {/* LOGO */}
        <div style={styles.logo}>
          <img src={logo} alt="Health Logo" style={styles.logoImg} />
        </div>

        {/* MENU */}
        <div style={styles.menu} className="nav-menu">
          <Link to="/"        style={styles.link} className="nav-link">Home</Link>
          <Link to="/about-us"   style={styles.link} className="nav-link">About Us</Link>
          <Link to="/scheme"  style={styles.link} className="nav-link">Scheme</Link>
          <Link to="/contact" style={styles.link} className="nav-link">Contact Us</Link>
          <Link to="/login"   style={styles.link} className="nav-link">Login</Link>
        </div>

       

      </div>
    </>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "150px",          // ✅ navbar height
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
    height: "130px",          // ✅ fixed: was 200px (overflow), now fits in 150px navbar
    width: "auto",
    objectFit: "contain",
  },

  menu: {
    flex: 1,                  // ✅ fixed: was "5", now stretches properly
    display: "flex",
    justifyContent: "center",
    gap: "35px",
  },

  link: {
    textDecoration: "none",
    color: "white",
    fontWeight: "600",
    fontSize: "20px",
  },

  admin: {
    cursor: "pointer",
    border: "2px solid white",
    padding: "10px",
    borderRadius: "50%",
    marginRight: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Header;
