import { useState,useEffect } from "react";
import jsPDF from "jspdf";
import axios from "axios";

/* ─── COLORS ─── */
const C = {
  navy:      "#0a1f3c",
  navyMid:   "#112d54",
  blue:      "#1a5fa8",
  blueLight: "#2980d9",
  teal:      "#0e7c86",
  gold:      "#c9851a",
  goldLight: "#e6a020",
  green:     "#1a7a4a",
  red:       "#b52b27",
  offWhite:  "#f2f6fb",
  border:    "#ccdaec",
  muted:     "#5a6e87",
};

/* ─── DATA ─── */
const HOSPITALS = [
  { name:"Govt. Medical College Hospital", city:"Thiruvananthapuram", dist:"Thiruvananthapuram", beds:1800, emergency:true },
  { name:"SAT Hospital",                   city:"Thiruvananthapuram", dist:"Thiruvananthapuram", beds:900,  emergency:true },
  { name:"Govt. Medical College Hospital", city:"Kozhikode",          dist:"Kozhikode",          beds:1500, emergency:true },
  { name:"Govt. Medical College Hospital", city:"Thrissur",           dist:"Thrissur",           beds:1200, emergency:true },
  { name:"Govt. Medical College Hospital", city:"Ernakulam",          dist:"Ernakulam",          beds:1100, emergency:true },
  { name:"Govt. Medical College Hospital", city:"Kottayam",           dist:"Kottayam",           beds:1000, emergency:true },
  { name:"Govt. Medical College Hospital", city:"Alappuzha",          dist:"Alappuzha",          beds:950,  emergency:true },
  { name:"Govt. Medical College Hospital", city:"Kollam",             dist:"Kollam",             beds:900,  emergency:true },
  { name:"District Hospital",              city:"Palakkad",           dist:"Palakkad",           beds:600,  emergency:true },
  { name:"District Hospital",              city:"Malappuram",         dist:"Malappuram",         beds:500,  emergency:true },
  { name:"District Hospital",              city:"Wayanad",            dist:"Wayanad",            beds:450,  emergency:false },
  { name:"District Hospital",              city:"Kasaragod",          dist:"Kasaragod",          beds:400,  emergency:false },
  { name:"District Hospital",              city:"Kannur",             dist:"Kannur",             beds:550,  emergency:true },
  { name:"District Hospital",              city:"Pathanamthitta",     dist:"Pathanamthitta",     beds:420,  emergency:false },
  { name:"Taluk General Hospital",         city:"Thrissur",           dist:"Thrissur",           beds:300,  emergency:false },
];

const SPECS = ["General Medicine","Orthopedics","Cardiology","Dermatology","ENT",
               "Ophthalmology","Gynaecology","Paediatrics","Psychiatry","Dentistry"];

const RECORDS = [
  { date:"12 Jan 2025", hosp:"Govt. Medical College, Kozhikode", doc:"Dr. Rajan Pillai",  diag:"Acute Respiratory Infection", rx:"Amoxicillin 500mg · Paracetamol 650mg",   status:"Completed" },
  { date:"03 Mar 2025", hosp:"District Hospital, Palakkad",       doc:"Dr. Suma Krishnan", diag:"Occupational Back Pain",       rx:"Ibuprofen 400mg · Physiotherapy referred", status:"Follow-up"  },
  { date:"28 Feb 2025", hosp:"Govt. Medical College, Thrissur",   doc:"Dr. Anil Kumar",    diag:"Hypertension – Stage 1",       rx:"Amlodipine 5mg · Lifestyle counselling",   status:"Ongoing"    },
];

const VACCINES = [
  { vac:"COVID-19 (Covaxin)",    dose:"Dose 1",  date:"15 Apr 2021", hosp:"PHC Kozhikode",                   done:true  },
  { vac:"COVID-19 (Covaxin)",    dose:"Dose 2",  date:"15 May 2021", hosp:"PHC Kozhikode",                   done:true  },
  { vac:"COVID-19 (Precaution)", dose:"Booster", date:"20 Jan 2022", hosp:"CHC Palakkad",                    done:true  },
  { vac:"Hepatitis B",           dose:"Dose 1",  date:"10 Jun 2023", hosp:"Govt. Medical College, Thrissur", done:true  },
  { vac:"Hepatitis B",           dose:"Dose 2",  date:"10 Jul 2023", hosp:"Govt. Medical College, Thrissur", done:true  },
  { vac:"Hepatitis B",           dose:"Dose 3",  date:"10 Jan 2024", hosp:"Govt. Medical College, Thrissur", done:true  },
  { vac:"Influenza",             dose:"Annual",  date:"Due: Oct 2025", hosp:"—",                             done:false },
  { vac:"Tetanus (Td)",          dose:"Booster", date:"Due: Dec 2025", hosp:"—",                             done:false },
];

const TREATMENTS = [
  { icon:"🩺", name:"Occupational Health Check",  tag:"Free",      color:C.green,   desc:"Annual checkup: BP, sugar, BMI, chest X-ray for all registered migrant workers." },
  { icon:"🏥", name:"Ayushman Bharat Treatment",  tag:"₹5L Cover", color:C.blue,    desc:"Cashless hospitalization up to ₹5 lakh/year at 25,000+ empanelled hospitals." },
  { icon:"🦴", name:"Physiotherapy & Rehab",      tag:"BOCW",      color:C.gold,    desc:"Work-related injury rehabilitation — free at all govt. hospitals with BOCW card." },
  { icon:"🧠", name:"Mental Health Counselling",  tag:"Private",   color:"#6b3fa0", desc:"Confidential sessions at District Mental Health Centres. Helpline: 080-46110007." },
  { icon:"💊", name:"Skin & Dermatology Clinic",  tag:"Walk-In",   color:C.teal,    desc:"Occupational skin conditions — allergies, rashes, fungal infections. No prior booking." },
  { icon:"🚑", name:"Emergency Surgery",          tag:"24×7",      color:C.red,     desc:"Free emergency surgical services under PM-JAY and BSKY schemes across Kerala." },
];

function Badge({ label, color, bg, border }) {
  return (
    <span style={{ display:"inline-block", padding:"3px 11px", borderRadius:20, fontSize:11,
      fontWeight:700, letterSpacing:0.4, color, background:bg, border:`1px solid ${border}`,
      fontFamily:"'DM Sans',sans-serif" }}>{label}</span>
  );
}

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
const [userName, setUserName] = useState(localStorage.getItem("name"));
  const [page, setPage]         = useState("Home");
  const [hospDD, setHospDD]     = useState(false);
  const [svcDD, setSvcDD]       = useState(false);
  const [hospQ, setHospQ]       = useState("");
  const [selHosp, setSelHosp]   = useState("");
  const [selSpec, setSelSpec]   = useState("");
  const [aDate, setADate]       = useState("");
  const [aTime, setATime]       = useState("");
  const [booked, setBooked]     = useState(false);
  const [showVacc, setShowVacc] = useState(false);
  const [userDD, setUserDD] = useState(false);
  const [reason, setReason] = useState("");
const [name, setName] = useState("");  
const [selectedRecord, setSelectedRecord] = useState(null);

  const go = (p) => {
    setPage(p);
    setHospDD(false);
    setSvcDD(false);
    window.scrollTo(0, 0);
  };


const book = () => {

  if (!name.trim()) {
    alert("Please enter patient name");
    return;
  }

  if (!/^[A-Za-z ]+$/.test(name)) {
    alert("Name should contain only letters");
    return;
  }

  if (!selHosp) {
    alert("Please select hospital");
    return;
  }

  if (!selSpec.trim()) {
    alert("Please enter speciality");
    return;
  }

  if (!aDate || !aTime) {
    alert("Please select date & time");
    return;
  }

  // ✅ FIXED: moved inside function
  const selectedDateTime = new Date(`${aDate} ${aTime}`);
  if (selectedDateTime < new Date()) {
    alert("Cannot book past time");
    return;
  }

  if (!reason.trim()) {
    alert("Please enter symptoms");
    return;
  }

  if (/^[0-9 ]+$/.test(reason)) {
    alert("Symptoms cannot be only numbers");
    return;
  }

  // ✅ success
  setBooked(true);

  setTimeout(() => {
    setBooked(false);
    go("My Records");
  }, 2400);
};
const downloadPDF = (r) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Health Record", 20, 20);

  doc.setFontSize(12);
  doc.text(`Diagnosis: ${r.diag}`, 20, 40);
  doc.text(`Hospital: ${r.hosp}`, 20, 50);
  doc.text(`Doctor: ${r.doc}`, 20, 60);
  doc.text(`Date: ${r.date}`, 20, 70);

  doc.text("Prescription:", 20, 90);
  doc.text(r.rx, 20, 100);

  doc.save("health_record.pdf");
};

  const filteredH = HOSPITALS.filter(h =>
    `${h.name} ${h.city} ${h.dist}`.toLowerCase().includes(hospQ.toLowerCase())
  );

  const fi = {
    border:`2px solid ${C.border}`, borderRadius:8, padding:"11px 14px",
    fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%",
    background:"white", transition:"border 0.2s",
  };

  const SH = ({ children }) => (
    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:C.navy, marginBottom:6 }}>{children}</div>
  );
  const Sub = ({ children }) => (
    <div style={{ color:C.muted, fontSize:15, marginBottom:28 }}>{children}</div>
  );



  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");

    if (!userId) return;

const res = await axios.get(
  `http://localhost:7001/api/profile/${userId}`
);

      console.log("PROFILE DATA:", res.data);

   const profileData = res.data.data || res.data;

setProfile(profileData);
localStorage.setItem("name", profileData.name);
    } catch (err) {
      console.log("Error fetching profile:", err);
    }
  };

  fetchProfile();
}, []);
useEffect(() => {
  if (profile?.name) {
    setName(profile.name);
  }
}, [profile]);

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh",
                  background:C.offWhite, fontFamily:"'DM Sans',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nlink{display:flex;align-items:center;gap:6px;padding:0 15px;height:52px;cursor:pointer;
          font-size:14px;font-weight:600;color:${C.navyMid};border-bottom:3px solid transparent;
          transition:all 0.2s;white-space:nowrap;position:relative;font-family:'DM Sans',sans-serif;}
        .nlink:hover{color:${C.blue};border-bottom-color:${C.blue};}
        .nlink.on{color:${C.blue};border-bottom-color:${C.blue};background:rgba(26,95,168,0.05);}
        .dd{position:absolute;top:calc(100% + 2px);left:0;background:white;border:1px solid ${C.border};
          border-radius:12px;box-shadow:0 12px 40px rgba(10,31,60,0.14);min-width:280px;
          z-index:9999;padding:6px 0;animation:ddIn 0.18s ease;}
        @keyframes ddIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .ddi{display:flex;align-items:center;gap:11px;padding:11px 18px;cursor:pointer;
          font-size:14px;color:${C.navy};transition:background 0.14s;font-family:'DM Sans',sans-serif;}
        .ddi:hover{background:${C.offWhite};color:${C.blue};}
        .card{background:white;border-radius:14px;box-shadow:0 2px 14px rgba(10,31,60,0.07);}
        .lift{transition:transform 0.22s,box-shadow 0.22s;cursor:pointer;}
        .lift:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(26,95,168,0.16)!important;}
        .btn-navy{background:linear-gradient(135deg,${C.navy},${C.navyMid});color:white;border:none;
          padding:11px 26px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;transition:all 0.22s;}
        .btn-navy:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(10,31,60,0.35);}
        .btn-blue{background:linear-gradient(135deg,${C.blue},${C.blueLight});color:white;border:none;
          padding:11px 26px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;transition:all 0.22s;}
        .btn-blue:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,95,168,0.4);}
        .btn-gold{background:linear-gradient(135deg,${C.gold},${C.goldLight});color:white;border:none;
          padding:11px 26px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;transition:all 0.22s;}
        .btn-gold:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,133,26,0.4);}
        .btn-out{background:transparent;color:${C.blue};border:2px solid ${C.blue};
          padding:10px 22px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;
          font-family:'DM Sans',sans-serif;transition:all 0.2s;}
        .btn-out:hover{background:${C.blue};color:white;}
        .fi:focus{border-color:${C.blue}!important;}
        .trow{border-bottom:1px solid ${C.border};}
        .trow:hover{background:${C.offWhite};}
        .trow:last-child{border-bottom:none;}
        .hrow{display:flex;align-items:center;gap:16px;padding:16px 20px;
          border-bottom:1px solid ${C.border};transition:background 0.14s;cursor:pointer;}
        .hrow:hover{background:${C.offWhite};}
        .hrow:last-child{border-bottom:none;}
        .toast{position:fixed;top:28px;right:28px;background:${C.green};color:white;
          padding:16px 26px;border-radius:12px;font-weight:700;font-size:15px;
          box-shadow:0 8px 30px rgba(0,0,0,0.2);z-index:99999;animation:toastIn 0.35s ease;
          font-family:'DM Sans',sans-serif;}
        @keyframes toastIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.5}}
        .fade{animation:fadeIn 0.3s ease;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:900px){
          .grid-4{grid-template-columns:1fr 1fr!important;}
          .grid-3{grid-template-columns:1fr 1fr!important;}
          .grid-2{grid-template-columns:1fr!important;}
          .nav-row{overflow-x:auto;}
          .hero-grid{grid-template-columns:1fr!important;}
        }
        @media(max-width:600px){
          .grid-4{grid-template-columns:1fr!important;}
          .grid-3{grid-template-columns:1fr!important;}
        }
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:#b0c8e0;border-radius:3px;}
      `}</style>

      {/* Toast */}
      {booked && <div className="toast">✅ Appointment confirmed! Redirecting to records…</div>}

      {/* ══════════ HEADER ══════════ */}
      <header style={{ background:"white", boxShadow:"0 2px 16px rgba(10,31,60,0.10)",
                       position:"sticky", top:0, zIndex:1000 }}>

        {/* Brand row */}
        <div style={{ maxWidth:1300, margin:"0 auto", padding:"14px 28px",
                      display:"flex", alignItems:"center", gap:20 }}>

          {/* Logo */}
          

          <div style={{ flex:1, display:"flex", justifyContent:"evenly" }} />

          {/* Search bar */}
          <div style={{ display:"flex", alignItems:"center", background:C.offWhite,
            border:`1.5px solid ${C.border}`, borderRadius:10, overflow:"hidden", width:520, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 14px",
                          flex:1, borderRight:`1px solid ${C.border}` }}>
              <span style={{ fontSize:16 }}>🔍</span>
              <select style={{ background:"transparent", border:"none", outline:"none",
                fontSize:14, color:C.navy, flex:1, cursor:"pointer", padding:"13px 0",
                fontFamily:"'DM Sans',sans-serif" }}
                value={selSpec} onChange={e => setSelSpec(e.target.value)}>
                <option value="">Search Doctor or Speciality</option>
                {SPECS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 14px", flex:1 }}>
              <span style={{ fontSize:16 }}>📍</span>
              <select style={{ background:"transparent", border:"none", outline:"none",
                fontSize:14, color:C.navy, flex:1, cursor:"pointer", padding:"13px 0",
                fontFamily:"'DM Sans',sans-serif" }}
                value={selHosp} onChange={e => setSelHosp(e.target.value)}>
                <option value="">Select Location</option>
                {HOSPITALS.map(h => <option key={`${h.name}-${h.city}`}>{h.name}, {h.city}</option>)}
              </select>
            </div>
          </div>

          <button className="btn-navy"
            style={{ padding:"14px 30px", fontSize:15, whiteSpace:"nowrap", flexShrink:0 }}
            onClick={() => go("Appointments")}>
            Book an Appointment
          </button>

          

{/* 👇 PASTE HERE */}
<div 
  style={{ position:"relative", marginLeft:10 }}
  onMouseEnter={() => setUserDD(true)}
  onMouseLeave={() => setUserDD(false)}
>
  <div style={{
    width:44,
    height:44,
    borderRadius:"50%",
    background:`linear-gradient(135deg,${C.blue},${C.navy})`,
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:20,
    color:"white",
    cursor:"pointer"
  }}>
    👤
  </div>

  {userDD && (
    <div className="dd" style={{ right:0, left:"auto", minWidth:220 }}>
      <div className="ddi" onClick={() => go("Profile")}>
        
        <span>My Profile</span>
      </div>

      <div className="ddi" onClick={() => alert("Scanner opened")}>
      
        <span>Scanner</span>
      </div>

      <div className="ddi" onClick={() => {
        localStorage.clear();
        alert("Logged out successfully!");
        window.location.href = "/login";
      }}>
       
        <span>Logout</span>
      </div>
    </div>
  )}
</div>



        </div>

        {/* ── Nav bar ── */}
        <div style={{ borderTop:`1px solid ${C.border}`, background:"white" }}>
          <div style={{ maxWidth:1300, margin:"0 auto", padding:"0 28px",
                        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div className="nav-row" style={{ display:"flex" }}>

               {/* Hospitals — no dropdown, direct click */}
              <div className={`nlink ${page==="Hospitals"?"on":""}`} onClick={() => go("Hospitals")}>
                Hospitals
              </div>

              {/* ── Services dropdown — onClick FIXED ── */}
              <div style={{ position:"relative" }}
                onMouseEnter={() => setSvcDD(true)}
                onMouseLeave={() => setSvcDD(false)}>
                <div
                  className={`nlink ${page==="Services"?"on":""}`}
                  onClick={() => go("Services")}   // ← FIXED
                >
                   Services <span style={{ fontSize:10 }}>▾</span>
                </div>
                {svcDD && (
                  <div className="dd">
                    <div style={{ padding:"10px 18px 6px", borderBottom:`1px solid ${C.border}`, marginBottom:4 }}>
                      
                    </div>
                    {[
                      { label:"View Health Record",       p:"My Records"        },
                      {  label:"Book Appointment",         p:"Appointments"      },
                      {  label:"Emergency Services",       p:"Services"          },
                    ].map(s => (
                      <div key={s.label} className="ddi"
                        onClick={() => { if(s.vacc){ setShowVacc(true); go("Services"); } else go(s.p); }}>

                        <span style={{ fontWeight:500 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`nlink ${page==="Appointments"?"on":""}`} onClick={() => go("Appointments")}> Appointments</div>
             
             
            </div>

            {/* Emergency badge */}
            <div style={{ display:"flex", alignItems:"center", gap:7, background:"#fff0f0",
              border:"1px solid #f5a0a0", borderRadius:20, padding:"6px 16px", flexShrink:0 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:C.red,
                display:"inline-block", animation:"pulse 1.4s infinite" }} />
              <span style={{ color:C.red, fontSize:13, fontWeight:700 }}>🚨 108 Ambulance</span>
            </div>
          </div>
        </div>
      </header>
<div style={{ fontSize: 16, fontWeight: 600 }}>
Welcome, {profile?.name || userName || "User"} </div>
      {/* ══════════ MAIN ══════════ */}
      <main style={{ flex:1, maxWidth:1300, margin:"0 auto", width:"100%", padding:"32px 28px" }}>

        {/* ─── HOME ─── */}
        {page === "Home" && (
          <div className="fade">
            <div style={{ background:`linear-gradient(140deg,${C.navy} 0%,${C.navyMid} 45%,${C.teal} 100%)`,
              borderRadius:18, padding:"60px 52px", marginBottom:28, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, opacity:0.04,
                backgroundImage:"radial-gradient(white 1px,transparent 1px)",
                backgroundSize:"30px 30px", pointerEvents:"none" }} />
              <div style={{ position:"absolute", right:-80, top:-80, width:400, height:400,
                borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
              <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:52, alignItems:"center", position:"relative", zIndex:1 }}>
                <div>
                  <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:44, color:"white", lineHeight:1.2, marginBottom:18, fontWeight:800 }}>
                    Your Health.<br /><span style={{ color:"#f0c060" }}>Your Rights.</span><br />Wherever You Work.
                  </h1>
                  <p style={{ color:"rgba(255,255,255,0.8)", fontSize:16, lineHeight:1.8, marginBottom:30, maxWidth:460 }}>
                    Access free government healthcare, book hospital appointments, and manage your health records — all in one place.
                  </p>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                    <button className="btn-gold" style={{ padding:"14px 32px", fontSize:15 }} onClick={() => go("Appointments")}>Book Appointment</button>
                    <button style={{ background:"transparent", color:"white", border:"2px solid rgba(255,255,255,0.6)",
                      padding:"12px 28px", borderRadius:8, fontSize:15, fontWeight:600, cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                      onClick={() => go("Services")}>View Services →</button>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  {[["🏥","₹5 Lakh","Ayushman Cover",C.teal],["👷","14 Cr+","e-Shram Workers",C.blue],
                    ["🏨","15","Govt. Hospitals",C.gold],["📞","104","Free Helpline 24×7","#6b3fa0"]
                  ].map(([ic,val,lbl,col]) => (
                    <div key={lbl} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
                      borderRadius:14, padding:"20px 18px", backdropFilter:"blur(6px)" }}>
                      <div style={{ fontSize:28, marginBottom:6 }}>{ic}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:col, fontWeight:700 }}>{val}</div>
                      <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginTop:3 }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* Health Alerts */}
            <div className="card" style={{ padding:"26px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:C.navy, marginBottom:16 }}>Health Alerts</div>
              {[
                { icon:"💉", msg:"Influenza vaccine due October 2025 — Schedule at nearest PHC",        col:C.gold,    bg:"#fdf4e3", bdr:"#f0c060" },
                { icon:"🩺", msg:"Annual occupational health checkup overdue — Last done: Jan 2025",     col:C.blue,    bg:"#e8f2fb", bdr:"#a0c4ee" },
                { icon:"💊", msg:"Amlodipine refill due — Visit Govt. Medical College or Jan Aushadhi",  col:"#6b3fa0", bg:"#f3edfb", bdr:"#c0a0e0" },
              ].map((a,i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"center",
                  padding:"13px 16px", background:a.bg, borderRadius:10, marginBottom:10, border:`1px solid ${a.bdr}` }}>
                  <span style={{ fontSize:22 }}>{a.icon}</span>
                  <span style={{ flex:1, fontSize:14, color:C.navy }}>{a.msg}</span>
                  <button style={{ background:a.col, color:"white", border:"none", borderRadius:7,
                    padding:"7px 16px", fontSize:12, cursor:"pointer", fontWeight:700,
                    whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif" }}>Act Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── HOSPITALS ─── */}
        {page === "Hospitals" && (
          <div className="fade">
            <SH>Kerala Government Hospitals</SH>
      
            <div style={{ display:"flex", gap:12, marginBottom:22 }}>
              <div style={{ position:"relative", flex:1 }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
                <input style={{ ...fi, paddingLeft:42 }} placeholder="Search hospital or district…"
                  value={hospQ} onChange={e => setHospQ(e.target.value)} className="fi" />
              </div>
              <button className="btn-blue" onClick={() => go("Appointments")}>+ Book Appointment</button>
            </div>
            <div className="card" style={{ marginBottom:22 }}>
              {filteredH.map((h,i) => (
                <div key={i} className="hrow">
                  <div style={{ width:50, height:50, borderRadius:11, background:C.offWhite,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:24, flexShrink:0, border:`1px solid ${C.border}` }}>🏥</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:C.navy }}>{h.name}, {h.city}</div>
                    <div style={{ color:C.muted, fontSize:12, marginTop:3 }}>
                      📍 {h.dist} District &nbsp;·&nbsp; {h.beds} beds &nbsp;·&nbsp; Ayushman Bharat Empanelled
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    {h.emergency
                      ? <Badge label="✓ 24×7 Emergency" color={C.green} bg="#e6f6ee" border="#8ecfaa" />
                      : <Badge label="OPD Only"          color={C.muted} bg={C.offWhite} border={C.border} />}
                    <button className="btn-blue" style={{ padding:"7px 18px", fontSize:13 }}
                      onClick={() => { setSelHosp(`${h.name}, ${h.city}`); go("Appointments"); }}>Book</button>
                  </div>
                </div>
              ))}
              {filteredH.length === 0 && (
                <div style={{ padding:"40px", textAlign:"center", color:C.muted }}>No hospitals found for "{hospQ}"</div>
              )}
            </div>
            <div className="card" style={{ padding:"26px" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:C.navy, marginBottom:18 }}>Emergency Helplines</div>
              <div className="grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                {[["108","Ambulance",C.red],["104","Health Helpline",C.green],["1056","Health Minister",C.blue],["14434","e-Shram Help",C.gold]].map(([n,l,c]) => (
                  <div key={n} style={{ textAlign:"center", padding:"22px", background:C.offWhite, borderRadius:11, border:`1px solid ${C.border}`, borderTop:`4px solid ${c}` }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:c, fontWeight:700 }}>{n}</div>
                    <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SERVICES ─── */}
        {page === "Services" && (
          <div className="fade">
            <SH>Health Services</SH>
            <Sub>Free &amp; subsidised services for all registered migrant workers in Kerala</Sub>
            <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:28 }}>
              {[
                { icon:"📋", title:"View Health Record",       col:C.blue,    action:() => go("My Records"),
                  desc:"All past consultations, diagnoses and prescriptions from Kerala govt. hospitals." },
                
                { icon:"📅", title:"Book Appointment",         col:C.gold,    action:() => go("Appointments"),
                  desc:"Schedule OPD, specialist or emergency visits at any Kerala govt. hospital." },
                { icon:"🚑", title:"Emergency Services",       col:C.red,     action:null,
                  desc:"Call 108 for a free ambulance. Available 24×7 across all Kerala districts." },
                
              ].map(s => (
                <div key={s.title} className="card lift" style={{ padding:"26px", borderTop:`4px solid ${s.col}` }}
                  onClick={() => s.action && s.action()}>
                  <div style={{ fontSize:42, marginBottom:14 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, color:C.navy, marginBottom:10 }}>{s.title}</div>
                  <div style={{ color:C.muted, fontSize:14, lineHeight:1.75, marginBottom:16 }}>{s.desc}</div>
                  <span style={{ color:s.col, fontWeight:700, fontSize:13 }}>{s.action ? "Open →" : "Always Available"}</span>
                </div>
              ))}
            </div>
            {showVacc && (
              <div className="card fade" style={{ padding:"28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:C.navy }}>💉 Vaccination History</div>
                  <div style={{ display:"flex", gap:10 }}>
                    <button className="btn-blue" style={{ padding:"8px 18px", fontSize:13 }}>Download Certificate</button>
                    <button style={{ padding:"8px 18px", background:"transparent", border:`1px solid ${C.border}`,
                      borderRadius:8, cursor:"pointer", fontSize:13, color:C.muted, fontFamily:"'DM Sans',sans-serif" }}
                      onClick={() => setShowVacc(false)}>✕ Close</button>
                  </div>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>
                    <thead>
                      <tr style={{ background:C.offWhite }}>
                        {["Vaccine","Dose","Date","Hospital","Status"].map(h => (
                          <th key={h} style={{ padding:"12px 16px", textAlign:"left", color:C.muted, fontWeight:700,
                            fontSize:12, letterSpacing:0.5, borderBottom:`2px solid ${C.border}`, textTransform:"uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {VACCINES.map((v,i) => (
                        <tr key={i} className="trow">
                          <td style={{ padding:"13px 16px", color:C.navy, fontWeight:600 }}>{v.vac}</td>
                          <td style={{ padding:"13px 16px", color:C.muted }}>{v.dose}</td>
                          <td style={{ padding:"13px 16px", color:C.muted }}>{v.date}</td>
                          <td style={{ padding:"13px 16px", color:C.muted }}>{v.hosp}</td>
                          <td style={{ padding:"13px 16px" }}>
                            {v.done
                              ? <Badge label="✓ Completed" color={C.green} bg="#e6f6ee" border="#8ecfaa" />
                              : <Badge label="⚠ Due"       color={C.gold}  bg="#fdf4e3" border="#f0c060" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── APPOINTMENTS ─── */}
       {page === "Appointments" && (
  <div className="fade">
    <SH>Book an Appointment</SH>

    <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:24 }}>
      
      {/* LEFT SIDE */}
      <div className="card" style={{ padding:"34px" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:C.navy, marginBottom:24 }}>
          New Appointment
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

          {/* ✅ Name Field (FIXED POSITION) */}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:C.navy, display:"block", marginBottom:7 }}>
              Patient Name *
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              style={fi}
              className="fi"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Hospital */}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:C.navy, display:"block", marginBottom:7 }}>
              Select Hospital *
            </label>
            <select style={fi} className="fi" value={selHosp} onChange={e=>setSelHosp(e.target.value)}>
              <option value="">Choose a Kerala Govt. Hospital</option>
              {HOSPITALS.map(h => (
                <option key={`f-${h.name}-${h.city}`}>
                  {h.name}, {h.city}
                </option>
              ))}
            </select>
          </div>

          {/* Speciality */}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:C.navy, display:"block", marginBottom:7 }}>
              Speciality *
            </label>
            <input
              type="text"
              placeholder="Enter Speciality"
              style={fi}
              className="fi"
              value={selSpec}
              onChange={e => setSelSpec(e.target.value)}
            />
          </div>

          {/* Date & Time */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:C.navy, display:"block", marginBottom:7 }}>
                Date *
              </label>
              <input
                type="date"
                style={fi}
                className="fi"
                value={aDate}
                onChange={e=>setADate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label style={{ fontSize:13, fontWeight:700, color:C.navy, display:"block", marginBottom:7 }}>
                Time *
              </label>
              <select style={fi} className="fi" value={aTime} onChange={e=>setATime(e.target.value)}>
                <option value="">Select Time</option>
                {[
                  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM",
                  "02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM"
                ].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:C.navy, display:"block", marginBottom:7 }}>
              Symptoms / Reason
            </label>
            <textarea
  style={{ ...fi, resize:"vertical" }}
  className="fi"
  rows={3}
  placeholder="Describe your symptoms or reason for visit…"
  value={reason}                 // ✅ using reason
  onChange={e => setReason(e.target.value)} // ✅ using setReason
/>
          </div>

          {/* Button */}
          <button
            className="btn-navy"
            style={{ padding:"15px", fontSize:15, width:"100%" }}
            onClick={book}
          >
            ✓ Confirm Appointment
          </button>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
        <div className="card" style={{ padding:"26px" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:C.navy, marginBottom:14 }}>
            Quick Book by Speciality
          </div>

          {SPECS.slice(0,6).map(s => (
            <div key={s} style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              padding:"10px 0",
              borderBottom:`1px solid ${C.border}`
            }}>
              <span style={{ fontSize:14, color:C.navy }}>{s}</span>
              <button
                className="btn-blue"
                style={{ padding:"6px 14px", fontSize:12 }}
                onClick={() => setSelSpec(s)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
)}


        {/* ─── TREATMENT ─── */}
       

        {/* ─── MY RECORDS ─── */}
        {page === "My Records" && (
          <div className="fade">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
              
             
            </div>
            <div style={{ 
  background:`linear-gradient(135deg,${C.navy},${C.navyMid})`, 
  borderRadius:16,
  padding:"26px 32px", 
  marginBottom:26, 
  display:"flex",
  justifyContent:"center",   // ✅ horizontal center
  alignItems:"center"        // ✅ vertical center
}}>
              <div>
              
                <div style={{ fontFamily:"'Playfair Display',serif", color:"white", fontSize:26, marginBottom:6, fontWeight:700,textAlign:"center" }}>Health Records</div>
              
              </div>
             
            </div>
            {RECORDS.map((r,i) => (
              <div key={i} className="card" style={{ padding:"26px", marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:C.navy, marginBottom:4 }}>{r.diag}</div>
                    <div style={{ color:C.muted, fontSize:13 }}>{r.hosp} &nbsp;·&nbsp; {r.doc} &nbsp;·&nbsp; {r.date}</div>
                  </div>
                 
                </div>
                <div style={{ background:C.offWhite, borderRadius:9, padding:"13px 16px", marginBottom:16, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:0.5, marginBottom:5, textTransform:"uppercase" }}>Prescription</div>
                  <div style={{ fontSize:14, color:C.navy }}>{r.rx}</div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                 <button 
  className="btn-blue" 
  style={{ padding:"8px 18px", fontSize:13 }}
  onClick={() => setSelectedRecord(r)}
>
  View Full Record
</button>

<button 
  className="btn-out"  
  style={{ padding:"8px 18px", fontSize:13 }}
  onClick={() => downloadPDF(r)}
>
  Download PDF
</button>
                  
                </div>
              </div>
            ))}
          </div>
        )}

   {/* ─── PROFILE ─── */}
{page === "Profile" && (
  <div className="fade">
    <div className="card" style={{ padding:"30px", maxWidth:600 }}>
      
      <h2 style={{ marginBottom:20 }}>👤 My Profile</h2>

      {profile ? (
        <>
          <p><b>Name:</b> {profile.name}</p>
          <p><b>Aadhaar:</b> {profile.aadhaar}</p>
          <p><b>Phone:</b> {profile.phone}</p>
          <p><b>State:</b> {profile.state}</p>
          <p><b>District:</b> {profile.district}</p>
          <p><b>Occupation:</b> {profile.occupation}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}

    </div>
  </div>
)}     

{selectedRecord && (
  <div style={{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.5)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    zIndex:9999
  }}>
    <div style={{
      background:"white",
      padding:"30px",
      borderRadius:"12px",
      width:"500px"
    }}>
      <h2 style={{ marginBottom:10 }}>{selectedRecord.diag}</h2>
      <p><b>Hospital:</b> {selectedRecord.hosp}</p>
      <p><b>Doctor:</b> {selectedRecord.doc}</p>
      <p><b>Date:</b> {selectedRecord.date}</p>

      <div style={{ marginTop:15 }}>
        <b>Prescription:</b>
        <p>{selectedRecord.rx}</p>
      </div>

      <button 
        className="btn-navy" 
        style={{ marginTop:20 }}
        onClick={() => setSelectedRecord(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
      </main>
    </div>
  );
}