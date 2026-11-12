import React from "react";
import logo from "./logo.png";

// ─── Reusable label style ─────────────────────────────────────────────────────
const sectionLabel = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.55)",
  marginBottom: "14px",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
  paddingBottom: "8px",
};

const styles = {
  logo: {
    display: "flex",
   marginLeft: "70px",
    height: "75%",
  },
  logoImg: {
    height: "130px",
    width: "auto",
    objectFit: "contain",
  },
};

// ─── Footer Component ─────────────────────────────────────────────────────────
const Footer = () => {
  const linkStyle = {
    color:          "rgba(255,255,255,0.78)",
    textDecoration: "none",
    fontSize:       "14px",
    display:        "flex",
    alignItems:     "center",
    gap:            "6px",
    marginBottom:   "8px",
    transition:     "color 0.2s",
  };

  return (
    <>
      <style>{`
        .foot-link:hover { color: white !important; }
        .foot-link:hover .foot-arrow { color: white !important; }
        @media (max-width: 768px) {
          .footer-grid { padding: 0 24px 28px !important; gap: 24px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { padding: 0 16px 22px !important; flex-direction: column !important; }
        }
      `}</style>

      <footer style={{ background: "#5d8aa8", borderTop: "3px solid white", color: "white", fontFamily: "'Segoe UI', sans-serif", paddingTop: "10px" }}>

        {/* Shimmer divider */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.55), rgba(255,255,255,0.15))", marginBottom: "36px" }} />

        {/* Main 3-column grid */}
        <div className="footer-grid" style={{ display: "flex", justifyContent: "space-between", gap: "32px", padding: "0 48px 36px", flexWrap: "wrap" }}>

          {/* Col 1 — Brand */}
          <div style={{ flex: "1", minWidth: "200px" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "0.5px", marginBottom: "10px" }}>
               Health Scheme
            </div>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "13.5px", lineHeight: "1.65", margin: 0 }}>
              Empowering communities through accessible healthcare schemes.
            </p>
             {/* LOGO */}
                    <div style={styles.logo}>
                      <img src={logo} alt="Health Logo" style={styles.logoImg} />
                    </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div style={{ flex: "1", minWidth: "160px" }}>
            <div style={sectionLabel}>Quick Links</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { href: "/",        label: "Home"       },
                { href: "/about",   label: "About Us"   },
                { href: "/scheme",  label: "Scheme"     },
                { href: "/contact", label: "Contact Us" },
                { href: "/login",   label: "Login"      },
              ].map((item) => (
                <a key={item.href} href={item.href} className="foot-link" style={linkStyle}>
                  <span className="foot-arrow" style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)" }}>›</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3 — Contact Info */}
          <div style={{ flex: "1", minWidth: "200px" }}>
            <div style={sectionLabel}>Contact Info</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { icon: "✉",  text: "support@healthscheme.gov.in"          },
                { icon: "📞", text: "+91-1800-XXX-XXXX"                    },
                { icon: "📍", text: "Ministry of Health, New Delhi, India"  },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ fontSize: "15px", marginTop: "1px" }}>{icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.78)", fontSize: "13.5px", lineHeight: "1.5" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;