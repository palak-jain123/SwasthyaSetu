import React, { useState } from "react";

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
  fontFamily: "'Poppins', Arial, sans-serif", // ✅ FIX
},

};
//...................CONTACT US................
const Contact = () => {
  const [activeTab, setActiveTab] = useState("Enquiry");
  const [submitted, setSubmitted] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({
    name: "", email: "", phone: "", hospital: "", message: "",
  });

  const [feedbackForm, setFeedbackForm] = useState({
    feedback: "", name: "", phone: "", email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1.5px solid #b0c8dc",
    fontSize: "14px",
    color: "#333",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px",
    display: "block",
  };

  const fieldWrap = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "22px",
  };

  return (
    <>
    <Header/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .contact-page {
          min-height: 100vh;
          background-image: url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80');
          background-size: cover;
          background-position: center;
          font-family: 'Nunito', sans-serif;
          padding: 40px 20px 60px;
          position: relative;
        }
        .contact-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(10, 40, 70, 0.55);
        }
        .contact-hero-text {
          position: relative;
          text-align: center;
          color: white;
          padding: 15px 10px;
          margin-bottom: 36px;
          font-size: 16px;
          line-height: 1.7;
          text-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }
        .contact-wrap {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
          align-items: start;
        }
        /* Left card */
        .contact-left {
          background: rgba(245, 248, 252, 0.92);
          backdrop-filter: blur(12px);
          border-radius: 18px;
          padding: 32px 28px;
        }
        .contact-left h2 {
          font-size: 22px;
          font-weight: 800;
          color: #1a2f45;
          margin-bottom: 28px;
        }
        .contact-info-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #dde8f0;
        }
        .contact-info-row:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
        }
        .info-icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #5d8aa8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          color: white;
        }
        .info-text h4 {
          font-size: 14px;
          font-weight: 700;
          color: #1a2f45;
          margin-bottom: 4px;
        }
        .info-text p {
          font-size: 13px;
          color: #5d8aa8;
          font-weight: 600;
        }
        .social-icons {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #b0c8dc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          color: #5d8aa8;
          text-decoration: none;
        }
        .social-btn:hover {
          background: #5d8aa8;
          color: white;
          border-color: #5d8aa8;
        }
        /* Right card */
        .contact-right {
          background: rgba(245, 248, 252, 0.92);
          backdrop-filter: blur(12px);
          border-radius: 18px;
          padding: 32px 36px;
        }
        /* Tabs */
        .tab-row {
          display: flex;
          gap: 10px;
          margin-bottom: 28px;
        }
        .tab-btn {
          padding: 9px 26px;
          border-radius: 30px;
          border: 2px solid #b0c8dc;
          background: white;
          font-size: 14px;
          font-weight: 700;
          color: #5d8aa8;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Nunito', sans-serif;
        }
        .tab-btn.active {
          background: #5d8aa8;
          border-color: #5d8aa8;
          color: white;
        }
        .tab-btn:hover:not(.active) {
          border-color: #5d8aa8;
          color: #3d6a88;
        }
        /* Grid rows */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        /* Submit button */
        .submit-btn {
          display: block;
          margin: 8px auto 0;
          padding: 13px 56px;
          background: #5d8aa8;
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(93,138,168,0.35);
        }
        .submit-btn:hover {
          background: #3d6a88;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(93,138,168,0.5);
        }
        /* Success toast */
        .success-msg {
          background: #e6f4ec;
          border: 1px solid #a3d4b5;
          color: #1a6b3c;
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 18px;
          text-align: center;
        }
        input::placeholder, textarea::placeholder, select option[value=""] {
          color: #aab8c5;
        }
        select {
          -webkit-appearance: none;
        }
        @media (max-width: 768px) {
          .contact-wrap { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .contact-right { padding: 24px 20px; }
        }
      `}</style>

      <div className="contact-page">
        {/* Hero text */}
        <div className="contact-hero-text">
          <p>We would love to hear from you! Please fill in the required details and our team will</p>
          
        </div>

        <div className="contact-wrap">

          {/* ── Left: Contact Details ── */}
          <div className="contact-left">
            <h2>Contact Details</h2>

            <div className="contact-info-row">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <h4>Phone Number</h4>
                <p>+91-1800-XXX-XXXX</p>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="info-icon">✉️</div>
              <div className="info-text">
                <h4>Email Address</h4>
                <p>support@healthportal.gov.in</p>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <h4>Address</h4>
                <p>Ministry of Health, Kerala, India</p>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="info-icon">🔗</div>
              <div className="info-text">
                <h4>Follow us</h4>
                <div className="social-icons">
                  <a href="#" className="social-btn">f</a>
                  <a href="#" className="social-btn">𝕏</a>
                  <a href="#" className="social-btn">in</a>
                  <a href="#" className="social-btn">▶</a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="contact-right">

            {/* Tabs */}
            <div className="tab-row">
              {["Enquiry", "Feedback"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => { setActiveTab(tab); setSubmitted(false); }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {submitted && (
              <div className="success-msg">
                ✓ Your {activeTab.toLowerCase()} has been submitted successfully! We will get back to you soon.
              </div>
            )}

            {/* ── ENQUIRY FORM ── */}
            {activeTab === "Enquiry" && (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Name *</label>
                    <input style={inputStyle} placeholder="Enter Your Name"
                      value={enquiryForm.name}
                      onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      required />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>E-mail *</label>
                    <input type="email" style={inputStyle} placeholder="Enter Your E-mail"
                      value={enquiryForm.email}
                      onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      required />
                  </div>
                </div>

                <div className="form-row">
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Mobile No. *</label>
                    <input type="tel" style={inputStyle} placeholder="Enter Your Phone Number"
                      value={enquiryForm.phone}
                      onChange={e => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      required />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Department *</label>
                    <select style={{ ...inputStyle, cursor: "pointer" }}
                      value={enquiryForm.hospital}
                      onChange={e => setEnquiryForm({ ...enquiryForm, hospital: e.target.value })}
                      required>
                      <option value="">Select Department</option>
                      <option>General Medicine</option>
                      <option>Cardiology</option>
                      <option>Orthopedics</option>
                      <option>Paediatrics</option>
                      <option>Gynaecology</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>

                <div style={fieldWrap}>
                  <label style={labelStyle}>Your Message *</label>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "90px", borderBottom: "1.5px solid #b0c8dc" }}
                    placeholder="Enter Your Message Here"
                    value={enquiryForm.message}
                    onChange={e => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    required />
                </div>

                <button type="submit" className="submit-btn">Submit</button>
              </form>
            )}

            {/* ── FEEDBACK FORM ── */}
            {activeTab === "Feedback" && (
              <form onSubmit={handleSubmit}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Feedback *</label>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "110px", borderBottom: "1.5px solid #b0c8dc" }}
                    placeholder="Enter Your Feedback Here"
                    value={feedbackForm.feedback}
                    onChange={e => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                    required />
                </div>

                <p style={{ fontSize: "14px", fontWeight: "700", color: "#1a2f45", marginBottom: "20px" }}>
                  I want the team to respond to my feedback
                </p>

                <div className="form-row">
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Name *</label>
                    <input style={inputStyle} placeholder="Enter Your Name"
                      value={feedbackForm.name}
                      onChange={e => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      required />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Mobile No. *</label>
                    <input type="tel" style={inputStyle} placeholder="Enter Your Phone Number"
                      value={feedbackForm.phone}
                      onChange={e => setFeedbackForm({ ...feedbackForm, phone: e.target.value })}
                      required />
                  </div>
                </div>

                <div style={fieldWrap}>
                  <label style={labelStyle}>E-mail *</label>
                  <input type="email" style={inputStyle} placeholder="Enter Your E-mail"
                    value={feedbackForm.email}
                    onChange={e => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                    required />
                </div>

                <button type="submit" className="submit-btn">Submit</button>
              </form>
            )}



          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;