import React from "react";
import { GiProgression } from "react-icons/gi"; //1
import { FaLocationArrow } from "react-icons/fa6"; //2 
import { FaHandshakeSimple } from "react-icons/fa6";//3
import { MdLockOutline } from "react-icons/md";//4
import { GiElectric } from "react-icons/gi";//5
import { BsClipboard2Check } from "react-icons/bs" //6
import { GrUserWorker } from "react-icons/gr";//7
import { SiChianetwork } from "react-icons/si";//8
import { MdOutlineWorkOutline } from "react-icons/md";//9
import { BsShieldShaded } from "react-icons/bs";//10
//header..............
import { Link } from "react-router-dom";
import logo from "./logo.png";

const Header = () => {
  return (
    <>
    
      <div style={styles.navbar}>

        {/* LOGO */}
        <div style={styles.logo}>
          <img src={logo} alt="Health Logo" style={styles.logoImg} />
        </div>

        {/* MENU */}
        <div style={styles.menu}>
          <Link to="/"        style={styles.link}>Home</Link>
          <Link to="/about"   style={styles.link}>About Us</Link>
          <Link to="/scheme"  style={styles.link}>Scheme</Link>
          <Link to="/contact" style={styles.link}>Contact Us</Link>
          <Link to="/login"   style={styles.link}>Login</Link>
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
  fontFamily: "'Poppins', Arial, sans-serif", // ✅ FIX
},

};
//...........ABOUT US..................
const AboutUs = () => {
  const partners = [
    { icon: <BsClipboard2Check />, short: "MoHFW",  full: "Ministry of Health & Family Welfare" },
    { icon: < GrUserWorker />, short: "MoLE",   full: "Ministry of Labour & Employment" },
    { icon: <SiChianetwork />, short: "NHM",    full: "National Health Mission, Kerala" },
    { icon: <MdOutlineWorkOutline />, short: "BOCW",   full: "Building & Construction Workers Welfare Board" },
    { icon: < BsShieldShaded/>, short: "PMJAY",  full: "Pradhan Mantri Jan Arogya Yojana" },
    { icon: <BsClipboard2Check />, short: "e-Shram",full: "e-Shram Portal — Ministry of Labour" },
  ];

  return (
    <>
    <Header/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Nunito:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .about-page {
          font-family: 'Nunito', sans-serif;
          background: #f4f8fb;
          color: #1c3547;
        }

        /* ── HERO ── */
        .about-hero {
          background: linear-gradient(135deg, #1c3547 0%, #2d5a7a 50%, #5d8aa8 100%);
          padding: 80px 20px 90px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .about-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: #f4f8fb;
          clip-path: ellipse(55% 100% at 50% 100%);
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          padding: 6px 18px;
          border-radius: 30px;
          color: #b8d8ee;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 22px;
          position: relative;
        }
        .about-hero h1 {
          font-family: 'Libre Baskerville', serif;
          font-size: clamp(32px, 5vw, 52px);
          color: white;
          line-height: 1.2;
          margin-bottom: 18px;
          position: relative;
        }
        .about-hero h1 span {
          color: #f0c060;
        }
        .about-hero p {
          color: rgba(255,255,255,0.78);
          font-size: 16px;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.8;
          position: relative;
        }

        /* ── SECTION WRAPPER ── */
        .section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 70px 24px;
        }
        .section-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #5d8aa8;
          margin-bottom: 10px;
        }
        .section-title {
          font-family: 'Libre Baskerville', serif;
          font-size: clamp(26px, 4vw, 36px);
          color: #1c3547;
          margin-bottom: 10px;
          line-height: 1.25;
        }
        .section-rule {
          width: 52px;
          height: 3px;
          background: linear-gradient(to right, #5d8aa8, #f0c060);
          border-radius: 2px;
          margin-bottom: 40px;
        }

        /* ── MISSION & VISION ── */
        .mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }
        .mv-card {
          background: white;
          border-radius: 18px;
          padding: 36px 32px;
          box-shadow: 0 4px 24px rgba(93,138,168,0.10);
          border-top: 4px solid #5d8aa8;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .mv-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(93,138,168,0.18);
        }
        .mv-card:nth-child(2) {
          border-top-color: #f0c060;
        }
        .mv-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, #ddeaf3, #b8d3e8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 20px;
        }
        .mv-card:nth-child(2) .mv-icon {
          background: linear-gradient(135deg, #fef3d7, #fde8a0);
        }
        .mv-card h3 {
          font-family: 'Libre Baskerville', serif;
          font-size: 22px;
          color: #1c3547;
          margin-bottom: 14px;
        }
        .mv-card p {
          font-size: 14.5px;
          color: #4a6a82;
          line-height: 1.85;
        }

        /* ── VALUES ROW ── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .value-card {
          background: white;
          border-radius: 14px;
          padding: 26px 22px;
          box-shadow: 0 2px 12px rgba(93,138,168,0.08);
          display: flex;
          align-items: flex-start;
          gap: 16px;
          border-left: 4px solid #5d8aa8;
          transition: transform 0.2s;
        }
        .value-card:hover { transform: translateY(-3px); }
        .value-card:nth-child(2) { border-left-color: #3a9e72; }
        .value-card:nth-child(3) { border-left-color: #f0a500; }
        .value-dot {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #ddeaf3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .value-card h4 {
          font-size: 15px;
          font-weight: 700;
          color: #1c3547;
          margin-bottom: 6px;
        }
        .value-card p {
          font-size: 13px;
          color: #5a7a90;
          line-height: 1.7;
        }

        /* ── DIVIDER ── */
        .divider-band {
          background: linear-gradient(135deg, #1c3547, #2d5a7a);
          padding: 56px 24px;
          text-align: center;
        }
        .divider-band h2 {
          font-family: 'Libre Baskerville', serif;
          font-size: clamp(22px, 3.5vw, 32px);
          color: white;
          margin-bottom: 12px;
        }
        .divider-band p {
          color: rgba(255,255,255,0.65);
          font-size: 15px;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.75;
        }

        /* ── GOVT PARTNERS ── */
        .partners-bg {
          background: white;
        }
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .partner-card {
          background: #f4f8fb;
          border-radius: 16px;
          padding: 28px 22px;
          text-align: center;
          border: 1px solid #d8eaf3;
          transition: all 0.25s;
        }
        .partner-card:hover {
          background: white;
          box-shadow: 0 8px 28px rgba(93,138,168,0.16);
          transform: translateY(-4px);
          border-color: #5d8aa8;
        }
        .partner-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ddeaf3, #b8d3e8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 14px;
          border: 2px solid rgba(93,138,168,0.2);
        }
        .partner-short {
          font-size: 13px;
          font-weight: 800;
          color: #5d8aa8;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .partner-full {
          font-size: 12.5px;
          color: #4a6a82;
          line-height: 1.55;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .mv-grid { grid-template-columns: 1fr; }
          .values-grid { grid-template-columns: 1fr; }
          .partners-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .partners-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="about-page">

        {/* ── HERO ── */}
        <div className="about-hero">
         
          <h1>Empowering Every Worker<br /><span>With Healthcare They Deserve</span></h1>
          <p>A Government of India initiative ensuring every migrant worker in Kerala has access to quality healthcare, welfare schemes, and digital health records.</p>
        </div>

        {/* ── MISSION & VISION ── */}
        <div className="section">
          <div className="section-label">Who We cAre</div>
          <div className="section-title">Our Mission & Vision</div>
          <div className="section-rule" />

          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon"><GiProgression /></div>
              <h3>Our Mission</h3>
              <p>To ensure every migrant worker in Kerala has seamless access to government healthcare, welfare schemes, and digital health records — regardless of their home state. We believe healthcare is a fundamental right, not a privilege.</p>
            </div>
            <div className="mv-card">
              <div className="mv-icon"><FaLocationArrow /></div>
              <h3>Our Vision</h3>
              <p>A future where no migrant worker is denied medical care due to lack of documentation, language barriers, or unfamiliarity with the system. We envision a fully inclusive, digitally-powered public health network across India.</p>
            </div>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-dot"><FaHandshakeSimple /></div>
              <div>
                <h4>Accessibility</h4>
                <p>Free and equal healthcare for all registered migrant workers across Kerala's 14 districts.</p>
              </div>
            </div>
            <div className="value-card">
              <div className="value-dot"><MdLockOutline /></div>
              <div>
                <h4>Trust & Privacy</h4>
                <p>Your health data is secured under ABDM guidelines. Only you and your doctor can access it.</p>
              </div>
            </div>
            <div className="value-card">
              <div className="value-dot"><GiElectric /></div>
              <div>
                <h4>Speed & Efficiency</h4>
                <p>Register once, access care anywhere. Instant Health ID generation and scheme enrollment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── DIVIDER BAND ── */}
        <div className="divider-band">
          <h2>Built on Government Trust</h2>
          <p>This portal is backed by central and state government bodies committed to the welfare of India's 500 million+ unorganised workers.</p>
        </div>

        {/* ── GOVERNMENT PARTNERS ── */}
        <div className="partners-bg">
          <div className="section">
            <div className="section-label">Our Partners</div>
            <div className="section-title">Government Bodies & Schemes</div>
            <div className="section-rule" />

            <div className="partners-grid">
              {partners.map((p, i) => (
                <div className="partner-card" key={i}>
                  <div className="partner-icon-wrap">{p.icon}</div>
                  <div className="partner-short">{p.short}</div>
                  <div className="partner-full">{p.full}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default AboutUs;