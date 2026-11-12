import React from "react";
import { BsBank } from "react-icons/bs";
import { RiHealthBookLine } from "react-icons/ri";
import { BsBuildings } from "react-icons/bs";
import { RiFundsLine } from "react-icons/ri";
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
//................ SCHEMES..........................
const Schemes = () => {
    
  const schemes = [
    { name: 'Ayushman Bharat PM-JAY', cover: '₹5 Lakh/year', icon: <BsBank />, tags: ['Hospitalisation', 'Surgery', 'ICU'], color: '#5d8aa8' },
    { name: 'Karunya Arogya Suraksha', cover: '₹5 Lakh/year', icon: <RiHealthBookLine />, tags: ['Kerala State', 'Free Treatment', '500+ hospitals'], color: '#3a9e72' },
    { name: 'ESI Scheme', cover: 'Medical + Cash', icon: <BsBuildings />, tags: ['Factory Workers', 'Construction', 'Maternity'], color: '#f0a500' },
    { name: 'Migrant Worker Welfare Fund', cover: 'Emergency aid', icon: <RiFundsLine />, tags: ['Accident', 'Death Benefit', 'Repatriation'], color: '#8bb0c8' },
  ];
  return (
    <>
    <Header/>
    <section style={{ padding: '90px 5%', background: 'linear-gradient(160deg,#1c3547 0%,#2d5a7a 100%)' }}>
      <div style={{ marginBottom: '52px' }}>
        <span className="eyebrow" style={{ color: '#8bb0c8' }}>Available Schemes</span>
        <h2 className="section-title" style={{ color: '#fff' }}>Free Health Coverage<br />You're Entitled To</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
        {schemes.map((s, i) => (
          <div
            key={i}
            className="lift"
            onClick={() => window.location.href = '/login'}
            style={{
              background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)',
              borderTop: `3px solid ${s.color}`, borderRadius: '8px', padding: '28px 24px', cursor: 'pointer', transition: 'background .2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,.13)' }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{s.icon}</div>
            <h3 style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '17px', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>{s.name}</h3>
            <div style={{ fontFamily: "'Inconsolata',monospace", fontSize: '13px', color: '#a8d0e8', marginBottom: '14px', fontWeight: 600 }}>{s.cover}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {s.tags.map((t, j) => (
                <span key={j} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '2px', background: 'rgba(93,138,168,.2)', color: 'rgba(255,255,255,.75)', fontFamily: "'Inconsolata',monospace", letterSpacing: '.04em' }}>{t}</span>
              ))}
            </div>
            <div style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inconsolata',monospace", letterSpacing: '.06em' }}>
              CLICK TO APPLY →
            </div>
          </div>
        ))}
      </div>
    </section>
    </>
  );
};
export default Schemes;