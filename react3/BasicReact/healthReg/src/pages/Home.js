import { useState } from "react";
import { BsBank } from "react-icons/bs";
import { RiHealthBookLine } from "react-icons/ri";
import { BsBuildings } from "react-icons/bs";
import { RiFundsLine } from "react-icons/ri";
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
  fontFamily: "'Poppins', Arial, sans-serif", // ✅ FIX
},

};

//.............................HOME.......................
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700&family=Inconsolata:wght@400;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --brand:        #5d8aa8;
      --brand-dark:   #3d6a88;
      --brand-deeper: #1c3547;
      --brand-light:  #8bb0c8;
      --brand-pale:   #ddeaf3;
      --accent:       #f0a500;
      --accent-light: #fde8b0;
      --success:      #3a9e72;
      --success-light:#6dd5b5;
      --danger:       #d95c5c;
      --white:        #ffffff;
      --cream:        #f4f8fb;
      --text:         #12283a;
      --text-mid:     #345068;
      --text-soft:    #6a8fa8;
      --border:       rgba(93,138,168,0.18);
    }

    html { scroll-behavior: smooth; }
    body { font-family: 'Nunito', sans-serif; background: var(--cream); color: var(--text); overflow-x: hidden; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--brand-pale); }
    ::-webkit-scrollbar-thumb { background: var(--brand); border-radius: 2px; }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes bounceIn { 0%{opacity:0;transform:scale(0.7)} 60%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
    @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.2)} 28%{transform:scale(1)} 42%{transform:scale(1.15)} 70%{transform:scale(1)} }
    @keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
    @keyframes blinkCursor { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2);opacity:0} }

    .animate-fadeUp   { animation: fadeUp 0.7s ease both; }
    .animate-fadeIn   { animation: fadeIn 0.6s ease both; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }

    .lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .lift:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(93,138,168,0.22) !important; }

    .eyebrow {
      font-family: 'Inconsolata', monospace;
      font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
      color: var(--brand); margin-bottom: 10px; display: block;
    }
    .section-title {
      font-family: 'Libre Baskerville', serif;
      font-size: clamp(28px,3.5vw,46px);
      font-weight: 700; line-height: 1.15;
      color: var(--text); margin-bottom: 16px;
    }
    .section-desc {
      font-size: 15px; font-weight: 400; line-height: 1.8;
      color: var(--text-mid); max-width: 560px;
    }

    /* Health Stats Panel */
    .stat-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(93,138,168,0.5);
      transform: translateY(-3px);
    }
    .health-ring {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid currentColor;
      animation: ripple 2s infinite;
    }
  `}</style>
);

// ── HERO SECTION
const Hero = () => (
  <section style={{
    background: `linear-gradient(135deg, #1c3547 0%, #2d5a7a 40%, #3d7a9a 100%)`,
    minHeight: '92vh', display: 'flex', alignItems: 'center',
    position: 'relative', overflow: 'hidden', padding: '100px 5% 80px',
  }}>
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
      backgroundSize: '48px 48px',
    }} />
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse 55% 65% at 85% 35%, rgba(93,138,168,0.28) 0%,transparent 70%), radial-gradient(ellipse 40% 50% at 15% 75%, rgba(61,122,154,0.18) 0%,transparent 65%)'
    }} />
    <svg style={{ position: 'absolute', right: '4%', top: '12%', opacity: .08, animation: 'float 6s ease-in-out infinite' }} width="420" height="420" viewBox="0 0 420 420">
      <circle cx="210" cy="210" r="200" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="210" cy="210" r="150" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="210" cy="210" r="100" stroke="white" strokeWidth="1" fill="none" />
      <circle cx="210" cy="210" r="50" stroke="white" strokeWidth="1" fill="none" />
      <line x1="10" y1="210" x2="410" y2="210" stroke="white" strokeWidth=".8" />
      <line x1="210" y1="10" x2="210" y2="410" stroke="white" strokeWidth=".8" />
    </svg>
    <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px' }}>
      <h1 className="animate-fadeUp delay-1" style={{
        fontFamily: "'Libre Baskerville',serif",
        fontSize: 'clamp(38px,5.5vw,72px)', fontWeight: 700,
        lineHeight: 1.08, color: '#fff', marginBottom: '8px',
      }}>
        Health Access for<br />
        <span style={{ color: '#a8d0e8' }}>Every Migrant Worker</span>
      </h1>
      <p className="animate-fadeUp delay-2" style={{
        fontSize: '17px', fontWeight: 300, color: 'rgba(255,255,255,.72)',
        lineHeight: 1.8, margin: '22px 0 36px', maxWidth: '540px',
      }}>
       The system provides secure health data records for workers, enables appointment booking with doctors, and offers access to government schemes uniquely linked to each worker.
      </p>
      <div className="animate-fadeUp delay-3" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '56px' }}>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            background: '#5d8aa8', color: '#fff', padding: '14px 32px', border: 'none',
            borderRadius: '4px', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '15px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 6px 20px rgba(93,138,168,0.5)', transition: 'all .2s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#f0a500'; e.currentTarget.style.color = '#1c3547'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseOut={e => { e.currentTarget.style.background = '#5d8aa8'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}>
          Register Now →
        </button>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            background: 'transparent', color: '#fff', padding: '14px 32px',
            border: '1px solid rgba(255,255,255,.35)', borderRadius: '4px',
            fontFamily: "'Nunito',sans-serif", fontWeight: 500, fontSize: '15px', cursor: 'pointer', transition: 'all .2s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#8bb0c8'; e.currentTarget.style.color = '#a8d0e8' }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.35)'; e.currentTarget.style.color = '#fff' }}>
          View Health Schemes
        </button>
      </div>
      <div className="animate-fadeUp delay-4" style={{
        display: 'flex', gap: '0', borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: '28px', flexWrap: 'wrap',
      }}>
        {[
          { num: '1.2M+', label: 'Migrant Workers Covered' },
          { num: '14', label: 'Districts Connected' },
          { num: '24/7', label: 'Disease Surveillance' },
          { num: 'Free', label: 'Health Registration' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: '1', minWidth: '120px', paddingRight: '28px',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none', marginBottom: '12px',
          }}>
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '34px', fontWeight: 700, color: '#8bb0c8', lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)', marginTop: '6px', letterSpacing: '.06em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── QUICK SERVICES
const QuickServices = () => {
  const services = [
    { icon: '🏥', title: 'Health Registration', desc: 'Register for Ayushman Bharat & state schemes without local domicile ID', color: '#ddeaf3', accent: '#5d8aa8' },
    { icon: '💉', title: 'Vaccination Tracker', desc: 'Track and schedule vaccinations across Kerala districts with SMS reminders', color: '#e8f4f0', accent: '#3a9e72' },
    { icon: '🌾', title: 'Occupational Health', desc: 'Health advisories for construction, farm, and factory migrant workers by sector', color: '#ece8f7', accent: '#7c4dcc' },
    { icon: '📋', title: 'Document Wallet', desc: 'Secure digital storage for health records, prescriptions, and scheme cards', color: '#ddeaf3', accent: '#5d8aa8' },
  ];
  return (
    <section style={{ padding: '90px 5%', background: '#fff' }}>
      <div style={{ marginBottom: '52px' }}>
        <span className="eyebrow">Quick Access</span>
        <h2 className="section-title">Services for<br />Migrant Workers</h2>
        <p className="section-desc">Everything you need to stay healthy in Kerala - at no cost.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' }}>
        {services.map((s, i) => (
          <div
            key={i}
            className="lift"
            onClick={() => window.location.href = '/login'}
            style={{
              background: s.color, borderRadius: '8px', padding: '32px 28px',
              cursor: 'pointer', border: '1px solid transparent', transition: 'border-color .2s', position: 'relative', overflow: 'hidden',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = s.accent }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'transparent' }}>
            <div style={{ fontSize: '32px', marginBottom: '14px' }}>{s.icon}</div>
            <h3 style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '18px', fontWeight: 700, color: s.accent, marginBottom: '8px' }}>{s.title}</h3>
            <p style={{ fontSize: '13px', color: '#4a6070', lineHeight: 1.7, fontWeight: 400 }}>{s.desc}</p>
            <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: s.accent, fontFamily: "'Inconsolata',monospace", letterSpacing: '.04em' }}>
              ACCESS →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── COMMUNITY HEALTH VOICES
const CommunityHealthPanel = () => {
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      name: 'Raju Mandal',
      state: 'West Bengal',
      work: 'Construction Worker, Ernakulam',
      avatar: '👷',
      quote: 'मुझे नहीं पता था कि बिना Kerala ID के भी मुझे free treatment मिल सकती है। Shahyak ने सब बता दिया और 3 दिन में card मिल गया।',
      scheme: 'Ayushman Bharat PM-JAY',
      saved: '₹42,000 saved',
      color: '#5d8aa8',
    },
    {
      name: 'Priya Devi',
      state: 'Bihar',
      work: 'Domestic Worker, Thiruvananthapuram',
      avatar: '👩',
      quote: 'मेरे बच्चे की delivery hospital में free हुई। ESI card बनवाने में Shahyak ने बहुत help की। अब हम सुरक्षित हैं।',
      scheme: 'ESI Maternity Benefit',
      saved: '₹28,000 saved',
      color: '#3a9e72',
    },
    {
      name: 'Suresh Kumar',
      state: 'Odisha',
      work: 'Farm Worker, Palakkad',
      avatar: '🧑‍🌾',
      quote: 'Hepatitis A alert मिली तो मैं तुरंत PHC गया। Free vaccination मिली। बीमार पड़ने से बच गया — ये app जरूरी है।',
      scheme: 'Karunya Arogya Suraksha',
      saved: 'Disease prevented',
      color: '#f0a500',
    },
  ];

  const healthTips = [
    { icon: '🚰', tip: 'Always drink filtered or boiled water on construction sites', category: 'Water Safety' },
    { icon: '🧤', tip: 'Wear protective gloves when handling chemicals or pesticides', category: 'Protection' },
    { icon: '☀️', tip: 'Take shade breaks every 2 hours in peak summer heat', category: 'Heat Safety' },
    { icon: '💊', tip: 'Carry your ESI card to any government hospital for free medicine', category: 'Scheme Access' },
    { icon: '📞', tip: 'Call 108 for free ambulance — available 24/7 across Kerala', category: 'Emergency' },
    { icon: '🩺', tip: 'Annual health check-up is free at all PHCs for registered workers', category: 'Prevention' },
  ];

  return (
    <section style={{ padding: '90px 5%', background: 'var(--cream)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        {/* Left — Testimonials */}
        <div>
          <span className="eyebrow">Real Stories</span>
          <h2 className="section-title">Workers Who Found<br />Their Health Rights</h2>
          <p className="section-desc" style={{ marginBottom: '32px' }}>
            Every day, migrant workers across Kerala discover they are entitled to free healthcare. Here are their stories.
          </p>
          <div style={{ position: 'relative' }}>
            {stories.map((s, i) => (
              <div
                key={i}
                onClick={() => setActiveStory(i)}
                style={{
                  background: i === activeStory ? '#fff' : 'transparent',
                  border: `2px solid ${i === activeStory ? s.color : 'rgba(93,138,168,0.15)'}`,
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: i === activeStory ? `0 8px 28px rgba(93,138,168,0.15)` : 'none',
                }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    background: `${s.color}22`, border: `2px solid ${s.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
                  }}>{s.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                      <div>
                        <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{s.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-soft)', marginTop: '2px' }}>{s.work}</div>
                      </div>
                      <span style={{
                        fontSize: '11px', padding: '3px 10px', borderRadius: '2px',
                        background: `${s.color}20`, color: s.color,
                        fontFamily: "'Inconsolata',monospace", fontWeight: 600, whiteSpace: 'nowrap'
                      }}>{s.saved}</span>
                    </div>
                    {i === activeStory && (
                      <div style={{ marginTop: '12px', animation: 'slideUp 0.3s ease' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-mid)', lineHeight: 1.75, fontStyle: 'italic', borderLeft: `3px solid ${s.color}`, paddingLeft: '12px' }}>
                          "{s.quote}"
                        </p>
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', padding: '3px 10px', background: `${s.color}15`, color: s.color, borderRadius: '2px', fontFamily: "'Inconsolata',monospace" }}>{s.scheme}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-soft)' }}>📍 From {s.state}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Health Tips */}
        <div>
          <div style={{
            background: 'linear-gradient(160deg,#1c3547,#2d5a7a)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(28,53,71,0.28)',
            position: 'sticky',
            top: '24px'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: "'Inconsolata',monospace", fontSize: '10px', letterSpacing: '.12em', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Daily Health Tips</div>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '20px', color: '#fff', fontWeight: 700 }}>Stay Safe at Work</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Curated for Kerala's migrant workforce</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {healthTips.map((tip, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  transition: 'background 0.2s',
                  cursor: 'default',
                }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{tip.icon}</span>
                  <div>
                    <div style={{ fontSize: '10px', fontFamily: "'Inconsolata',monospace", letterSpacing: '.08em', color: '#8bb0c8', textTransform: 'uppercase', marginBottom: '4px' }}>{tip.category}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>{tip.tip}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', padding: '14px 16px', background: 'rgba(240,165,0,0.15)', border: '1px solid rgba(240,165,0,0.35)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🆘</span>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: "'Inconsolata',monospace", letterSpacing: '.06em' }}>EMERGENCY</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fde8b0', fontFamily: "'Libre Baskerville',serif" }}>Call 108 — Free Ambulance</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Available 24/7 across all Kerala districts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── HOW IT WORKS
const HowItWorks = () => {
  const steps = [
    { num: '01', icon: '📱', title: 'Register Online', desc: 'Fill in basic details — no local ID required. Aadhaar, voter card, or home state ID accepted.' },
    { num: '02', icon: '🏥', title: 'Receive Your Card', desc: 'Download your e-health card instantly. Physical card delivered to your work address within 7 days.' },
    { num: '03', icon: '📬', title: 'Health Assessment', desc: 'Complete a quick digital health form. Get matched with relevant government schemes automatically.' },
    { num: '04', icon: '🛡️', title: 'Stay Protected', desc: 'Access cashless treatment at 2,400+ empanelled hospitals. Receive disease alerts on your phone.' },
  ];
  const stepColors = ['#5d8aa8', '#3d6a88', '#f0a500', '#3a9e72'];
  return (
    <section style={{ padding: '90px 5%', background: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="eyebrow" style={{ display: 'block', textAlign: 'center' }}>Simple Process</span>
        <h2 className="section-title" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto 16px' }}>Get Covered in<br />4 Easy Steps</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '40px', left: '12.5%', right: '12.5%', height: '2px', background: 'linear-gradient(90deg,#5d8aa8,#3d6a88,#f0a500,#3a9e72)', zIndex: 0 }} />
        {steps.map((s, i) => (
          <div key={i} className="lift" style={{ padding: '60px 24px 28px', textAlign: 'center', position: 'relative', zIndex: 1, cursor: 'default', borderRadius: '8px', margin: '0 4px', background: 'var(--cream)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
              background: '#fff', border: '3px solid', borderColor: stepColors[i],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', boxShadow: `0 4px 16px ${stepColors[i]}40`,
            }}>{s.icon}</div>
            <div style={{ fontFamily: "'Inconsolata',monospace", fontSize: '11px', letterSpacing: '.1em', color: stepColors[i], marginBottom: '8px' }}>STEP {s.num}</div>
            <h3 style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>{s.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-mid)', lineHeight: 1.7 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── SCHEMES
const Schemes = () => {
 const schemes = [
     { name: 'Ayushman Bharat PM-JAY', cover: '₹5 Lakh/year', icon: <BsBank />, tags: ['Hospitalisation', 'Surgery', 'ICU'], color: '#5d8aa8' },
     { name: 'Karunya Arogya Suraksha', cover: '₹5 Lakh/year', icon: <RiHealthBookLine />, tags: ['Kerala State', 'Free Treatment', '500+ hospitals'], color: '#3a9e72' },
     { name: 'ESI Scheme', cover: 'Medical + Cash', icon: <BsBuildings />, tags: ['Factory Workers', 'Construction', 'Maternity'], color: '#f0a500' },
     { name: 'Migrant Worker Welfare Fund', cover: 'Emergency aid', icon: <RiFundsLine />, tags: ['Accident', 'Death Benefit', 'Repatriation'], color: '#8bb0c8' },
   ];
  return (
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
  );
};

// ── CTA BANNER
const CTABanner = () => (
  <section style={{
    background: 'linear-gradient(135deg, #76a9c9 0%, #76a9c9 40%, #76a9c9 100%)',
    padding: '80px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
    <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
    <div style={{ position: 'relative', zIndex: 2 }}>
      <span style={{
        fontFamily: "'Inconsolata',monospace", fontSize: '11px', letterSpacing: '.14em',
        textTransform: 'uppercase', color: 'rgba(28,53,71,0.7)', display: 'block', textAlign: 'center', marginBottom: '10px'
      }}>Start Today</span>
      <h2 style={{
        fontFamily: "'Libre Baskerville',serif", fontSize: 'clamp(28px,4vw,48px)',
        fontWeight: 700, color: '#1c3547', marginBottom: '16px'
      }}>Register. Get Covered. Stay Safe.</h2>
      <p style={{ fontSize: '16px', color: 'rgba(28,53,71,0.75)', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.8 }}>
        Join over 1.2 million migrant workers who have secured free healthcare in Kerala. Takes less than 5 minutes.
      </p>
      <button
        onClick={() => window.location.href = '/login'}
        style={{
          background: '#1c3547', color: '#fff', padding: '14px 36px', border: 'none',
          borderRadius: '4px', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '15px',
          cursor: 'pointer', boxShadow: '0 8px 24px rgba(28,53,71,0.3)', transition: 'all .2s'
        }}
        onMouseOver={e => { e.currentTarget.style.background = '#0d1f2d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={e => { e.currentTarget.style.background = '#1c3547'; e.currentTarget.style.transform = 'translateY(0)'; }}>
        Register Free Now →
      </button>
    </div>
  </section>
);

// ── MAIN EXPORT
export default function HomePage() {
  return (
    <>
      <GlobalStyles />
      <main>
        <Header/>
        <Hero />
        <QuickServices />
        <CommunityHealthPanel />
        <HowItWorks />
        <Schemes />
        <CTABanner />
      </main>
    </>
  );
}