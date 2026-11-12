import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRef } from "react";
export default function DoctorDashboard() {
  const scannerRef = useRef(null);
const isScanningRef = useRef(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [rxPatientId, setRxPatientId] = useState("");
  const [rxPatientFound, setRxPatientFound] = useState(null);
  const [rxPatientError, setRxPatientError] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

  const [hrPatientId, setHrPatientId] = useState("");
  const [hrPatientFound, setHrPatientFound] = useState(null);
  const [hrPatientError, setHrPatientError] = useState(false);
  const [healthRecord, setHealthRecord] = useState({
    bp: "", pulse: "", weight: "", height: "",
    diagnosis: "", clinicalNotes: "", nextVisitDate: "",
  });
  const [recordSaved, setRecordSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const BTN = "#1a5fa8";

  const [patients, setPatients] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const safeStopScanner = async () => {
  try {
    if (scannerRef.current) {
      const state = scannerRef.current.getState(); // ✅ check real state

      if (state === 2) { // 2 = SCANNING
        await scannerRef.current.stop();
      }

      // clear UI always (important)
      await scannerRef.current.clear();
    }
  } catch (err) {
    // ❌ completely ignore (no console error)
  }
};
//scanner---------------//
useEffect(() => {
  if (activeTab !== "scan") return;

  const scanner = new Html5Qrcode("reader");
  scannerRef.current = scanner;

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },

    (decodedText) => {
      let patientId = decodedText.includes("/patient/")
        ? decodedText.split("/patient/")[1]
        : decodedText.trim();

      const found = patients.find(
        (p) =>
          String(p._id).trim().toLowerCase() ===
          String(patientId).trim().toLowerCase()
      );

      if (!found) {
        alert("Patient details not fetched"); // ✅ your requirement
      }

      setSelectedPatient(found || null);
      setNotFound(!found);
      setSearchPerformed(true);
      setSearchId(patientId);
      setActiveTab("search");

      safeStopScanner(); // ✅ safe stop
    },

    () => {} // ignore scan errors
  );

  return () => {
    safeStopScanner(); // ✅ cleanup without crash
  };
}, [activeTab, patients]);
  // ── fetch patients ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:7001/api/patients");
      setPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ── fetch appointments — only after doctorProfile._id is available ──────────
  useEffect(() => {
    if (!doctorProfile?._id) return;
    fetchAppointments();
  }, [doctorProfile]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7001/api/appointments/doctor/${doctorProfile._id}`
      );
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  // ── fetch doctor profile ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(`http://localhost:7001/api/doctor/${userId}`);
        setDoctorProfile(res.data.doctor);
      } catch (err) {
        if (err.response?.status === 404) {
          setDoctorProfile(null);
        } else {
          console.error("Error fetching doctor:", err);
        }
      }
    };
    fetchDoctor();
  }, []);

  // ── filter appointments that belong to this doctor ──────────────────────────
  const myAppointments = appointments.filter((a) => {
    if (!doctorProfile?._id) return false;
    const apptDoctorId = a.doctorId?._id
      ? String(a.doctorId._id)
      : String(a.doctorId ?? "");
    return apptDoctorId === String(doctorProfile._id);
  });

  // ── helpers: extract YYYY-MM-DD from ISO string without timezone shift ──────
  const toLocalDateStr = (d) => {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm   = String(dt.getMonth() + 1).padStart(2, "0");
    const dd   = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayLocalStr = toLocalDateStr(new Date());

  // ── only CONFIRMED appointments for today's schedule ───────────────────────
  // Slice the ISO string directly (avoids UTC->local timezone shift for stored dates)
  const todayConfirmed = myAppointments.filter((a) => {
    if (!a.date) return false;
    const raw = String(a.date);
    const isoDatePart = raw.includes("T") ? raw.split("T")[0] : raw.slice(0, 10);
    console.log("appt date:", raw, "->", isoDatePart, "today:", todayLocalStr);
    return a.status === "CONFIRMED" && isoDatePart === todayLocalStr;
  });

  // ── PENDING appointments (all dates) for approval requests panel ───────────
  const pendingAppointments = myAppointments.filter((a) => a.status === "PENDING");

  // ── last 5 unique patients from CONFIRMED appointments ─────────────────────
  const recentPatients = myAppointments
    .filter((a) => a.status === "CONFIRMED")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((a) => patients.find((p) => String(p._id) === String(a.userId?._id ?? a.userId)))
    .filter(Boolean)
    .filter((p, i, arr) => arr.findIndex((x) => x._id === p._id) === i)
    .slice(0, 5);

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    setSearchPerformed(true);
    // Only allow searching patients who have a CONFIRMED appointment with this doctor
    const confirmedPatientIds = myAppointments
      .filter((a) => a.status === "CONFIRMED")
      .map((a) => String(a.userId?._id ?? a.userId));
    const found = patients.find(
      (p) => p._id && p._id.toLowerCase() === searchId.toLowerCase()
        && confirmedPatientIds.includes(String(p._id))
    );
    if (found) { setSelectedPatient(found); setNotFound(false); }
    else { setNotFound(true); setSelectedPatient(null); }
  };

  const handleRxLookup = () => {
    const found = patients.find(
      (p) => p._id.toLowerCase() === rxPatientId.toLowerCase()
    );
    if (found) { setRxPatientFound(found); setRxPatientError(false); }
    else { setRxPatientFound(null); setRxPatientError(true); }
  };

  const handleHrLookup = () => {
    const found = patients.find(
      (p) => p._id.toLowerCase() === hrPatientId.toLowerCase()
    );
    if (found) { setHrPatientFound(found); setHrPatientError(false); }
    else { setHrPatientFound(null); setHrPatientError(true); }
  };

  const handleUploadPrescription = async () => {
    if (!prescriptionText.trim() || !rxPatientFound) {
      alert("Enter prescription");
      return;
    }
    try {
      await axios.post("http://localhost:7001/api/prescription", {
        patientId: rxPatientFound._id,
        prescription: prescriptionText,
        doctorId: localStorage.getItem("userId"),
      });
      setPrescriptionUploaded(true);
      setTimeout(() => setPrescriptionUploaded(false), 3000);
      setPrescriptionText("");
    } catch (err) {
      console.log(err);
      alert("Error uploading prescription");
    }
  };

  const handleSaveRecord = async () => {
    if (!hrPatientFound) { alert("Search patient first"); return; }
    try {
      await axios.post("http://localhost:7001/api/health-record", {
        patientId: hrPatientFound._id,
        ...healthRecord,
        doctorId: localStorage.getItem("userId"),
      });
      setRecordSaved(true);
      setTimeout(() => setRecordSaved(false), 3000);
      setHealthRecord({ bp: "", pulse: "", weight: "", height: "", diagnosis: "", clinicalNotes: "", nextVisitDate: "" });
    } catch (err) {
      console.log(err);
      alert("Error saving record");
    }
  };

  // ── update status then re-fetch so UI reflects backend truth ───────────────
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:7001/api/appointments/status/${id}`, { status });
      const res = await axios.get(
        `http://localhost:7001/api/appointments/doctor/${doctorProfile._id}`
      );
      setAppointments(res.data.data || []);
      console.log("APPOINTMENTS DATA:", JSON.stringify(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  // ── helpers ─────────────────────────────────────────────────────────────────
  const statusColor = (s) => {
    if (!s) return "#d97706";
    s = s.toLowerCase();
    return s === "critical" ? "#dc2626" : s === "stable" ? "#16a34a" : s === "active" ? BTN : "#d97706";
  };

  const apptColor = (s) =>
    s === "REJECTED" ? "#dc2626" : s === "CONFIRMED" ? "#16a34a" : "#d97706";

  const navItems = [
    { id: "profile",       icon: "👤", label: "My Profile" },
    { id: "dashboard",     icon: "⊞", label: "Dashboard" },
    { id: "scan",     label: "Scan Dashboard" },
    { id: "search",        icon: "⌕", label: "Search Patient" },
    { id: "prescription",  icon: "✎", label: "Upload Prescription" },
    { id: "healthRecords", icon: "♥", label: "Updated Health Record" },
    { id: "appointments",  icon: "◈", label: "Track Appointments" },
  ];

  // ── styles ──────────────────────────────────────────────────────────────────
  const theme = {
    pageBg: "#f0f4f8",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    headingColor: "#1e293b",
    subText: "#64748b",
    mutedText: "#94a3b8",
    inputBg: "#f8fafc",
    inputBorder: "#cbd5e1",
    inputText: "#1e293b",
    accent: BTN,
    accentLight: "#e8f0fb",
    divider: "#f1f5f9",
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px", borderRadius: 9,
    background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
    color: theme.inputText, fontSize: 14, fontFamily: "inherit",
    boxSizing: "border-box", outline: "none",
  };

  const labelStyle = {
    display: "block", fontSize: 11, color: theme.mutedText,
    marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600,
  };

  const cardStyle = {
    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
    borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  };

  const btnPrimary = {
    background: BTN, border: "none", color: "#fff",
    cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
  };

  const SectionHead = ({ title, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "22px 0 14px" }}>
      <div style={{ width: 3, height: 16, borderRadius: 4, background: color }} />
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1 }}>{title}</p>
    </div>
  );

  const Star = () => <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>;

  const PatientBadge = ({ patient, bg, borderC, textColor }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
      borderRadius: 10, background: bg, border: `1px solid ${borderC}`, marginBottom: 20,
    }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: borderC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
        {patient.gender === "Female" ? "👩" : "👨"}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: textColor }}>{patient.name}</p>
        <p style={{ margin: 0, fontSize: 12, color: textColor, opacity: 0.8 }}>
          {patient._id} · {patient.condition} · Age {patient.age} · {patient.blood}
        </p>
      </div>
      <span style={{ marginLeft: "auto", fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.6)", color: textColor, border: `1px solid ${borderC}`, fontWeight: 600 }}>
        Verified ✓
      </span>
    </div>
  );

  // ── render ──────────────────────────────────────────────────────────────────
  
  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      background: theme.pageBg, color: theme.headingColor,
    }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarOpen ? 252 : 68, transition: "width 0.3s ease",
        background: "#ffffff", borderRight: `1px solid ${theme.cardBorder}`,
        display: "flex", flexDirection: "column", position: "relative",
        boxShadow: "2px 0 10px rgba(0,0,0,0.05)", flexShrink: 0,
      }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${theme.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `linear-gradient(135deg, ${BTN}, #154e8a)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0, boxShadow: `0 3px 10px ${BTN}55`,
            }}>⚕</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>MediPortal</div>
                <div style={{ fontSize: 11, color: theme.mutedText }}>Hospital System</div>
              </div>
            )}
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
      
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 10, padding: sidebarOpen ? "10px 16px" : "10px 0",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              background: activeTab === item.id ? theme.accentLight : "transparent",
              border: "none",
              borderLeft: activeTab === item.id ? `3px solid ${BTN}` : "3px solid transparent",
              color: activeTab === item.id ? BTN : theme.subText,
              cursor: "pointer", transition: "all 0.15s", fontSize: 13, fontFamily: "inherit",
            }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontWeight: activeTab === item.id ? 600 : 400 }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={() => { localStorage.removeItem("userId"); window.location.href = "/login"; }}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: sidebarOpen ? "10px 16px" : "10px 0",
            justifyContent: sidebarOpen ? "flex-start" : "center",
            background: "transparent", border: "none", color: "#ef4444",
            cursor: "pointer", fontSize: 13,
          }}
        >
          <span style={{ fontSize: 17 }}>⏻</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Topbar */}
        <div style={{
          padding: "13px 26px", background: "#ffffff",
          borderBottom: `1px solid ${theme.cardBorder}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
            Welcome, {doctorProfile?.name || "Doctor"}
          </h2>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1e293b" }}>
            {navItems.find((n) => n.id === activeTab)?.label}
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: theme.mutedText }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })} · MediPortal v2.4
          </p>
        </div>
{activeTab === "scan" && (
  <div style={{ maxWidth: 500 }}>
    <div style={cardStyle}>
      <h2 style={{ marginBottom: 10 }}>Scan Patient QR</h2>
      <p style={{ fontSize: 13, color: theme.subText, marginBottom: 16 }}>
        Use camera to scan patient QR and fetch details instantly
      </p>

      <div
        id="reader"
        style={{
          width: "100%",
          borderRadius: 10,
          overflow: "hidden",
        }}
      />

      <p style={{ marginTop: 12, fontSize: 12, color: theme.mutedText }}>
        📷 Point camera at patient QR code
      </p>
    </div>
  </div>
)}
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 26 }}>

          {/* ═══ PROFILE ═══ */}
          {activeTab === "profile" && (
            <div style={{ maxWidth: 600 }}>
              <div style={cardStyle}>
                <h2 style={{ marginBottom: 10 }}>My Profile</h2>
                {!doctorProfile ? (
                  <h3>Loading...</h3>
                ) : (
                  <div>
                    <p><strong>Name:</strong> {doctorProfile.name}</p>
                    <p><strong>Mobile:</strong> {doctorProfile.mobile}</p>
                    <p><strong>License ID:</strong> {doctorProfile.licenseId}</p>
                    <p><strong>Specialization:</strong> {doctorProfile.specialization}</p>
                    <p><strong>Status:</strong> {doctorProfile.status}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ DASHBOARD ═══ */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  {
                    label: "Total Patients",
                    value: recentPatients.length > 0 ? myAppointments
                      .map((a) => String(a.userId?._id ?? a.userId))
                      .filter((id, i, arr) => arr.indexOf(id) === i).length : 0,
                    icon: "👥", color: BTN, bg: "#e8f0fb",
                    sub: "unique patients",
                  },
                  {
                    label: "Today's Confirmed",
                    value: todayConfirmed.length,
                    icon: "📅", color: "#16a34a", bg: "#f0fdf4",
                    sub: "confirmed for today",
                  },
                  {
                    label: "Pending Requests",
                    value: pendingAppointments.length,
                    icon: "⏳", color: "#d97706", bg: "#fffbeb",
                    sub: "awaiting your response",
                  },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                    borderRadius: 14, padding: "20px 20px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)", borderTop: `3px solid ${s.color}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ margin: "0 0 6px", fontSize: 11, color: theme.mutedText, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</p>
                        <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</p>
                        <p style={{ margin: 0, fontSize: 11, color: theme.subText }}>{s.sub}</p>
                      </div>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

                {/* Recent Patients — last 5 from CONFIRMED appointments */}
                <div style={cardStyle}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#1e293b", fontWeight: 700 }}>
                    Recent Patients <span style={{ fontSize: 11, color: theme.mutedText, fontWeight: 400 }}>(last 5)</span>
                  </h3>
                  {recentPatients.length === 0 && (
                    <p style={{ color: theme.mutedText, fontSize: 13 }}>No confirmed appointments yet.</p>
                  )}
                  {recentPatients.map((p, i) => (
                    <div key={i}
                      onClick={() => { setSearchId(p._id); setSelectedPatient(p); setSearchPerformed(true); setNotFound(false); setActiveTab("search"); }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 12px", borderRadius: 10, marginBottom: 8,
                        background: "#f8fafc", cursor: "pointer", border: `1px solid ${theme.cardBorder}`,
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: `${statusColor(p.status)}18`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 15, border: `1px solid ${statusColor(p.status)}30`,
                        }}>{p.gender === "Female" ? "👩" : "👨"}</div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{p.name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: theme.mutedText }}>{p._id} · {p.condition}</p>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, padding: "3px 10px", borderRadius: 20,
                        background: `${statusColor(p.status)}15`, color: statusColor(p.status),
                        border: `1px solid ${statusColor(p.status)}40`, fontWeight: 600,
                      }}>{p.status}</span>
                    </div>
                  ))}
                </div>

                {/* Today's Schedule — CONFIRMED only for today, enriched with patient data */}
                <div style={cardStyle}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#1e293b", fontWeight: 700 }}>
                    Today's Schedule
                    <span style={{ fontSize: 11, color: theme.mutedText, fontWeight: 400, marginLeft: 6 }}>
                      ({new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })})
                    </span>
                  </h3>
                  {todayConfirmed.length === 0 && (
                    <p style={{ color: theme.mutedText, fontSize: 13 }}>No confirmed appointments for today.</p>
                  )}
                  {todayConfirmed.map((a, i) => {
                    // match patient record from patients array using userId
                    const patientUserId = a.userId?._id ? String(a.userId._id) : String(a.userId ?? "");
                    const matchedPatient = patients.find((p) => String(p._id) === patientUserId);
                    const displayName = matchedPatient?.name || a.userId?.name || a.patientName || `Patient (...${patientUserId.slice(-4)})`;
                    const displayAge  = matchedPatient?.age ? `${matchedPatient.age} yrs` : null;
                    const displayBlood = matchedPatient?.blood || null;
                    const displayCond = matchedPatient?.condition || null;
                    const displayGender = matchedPatient?.gender || null;
                    return (
                      <div key={i} style={{
                        padding: "12px 14px", borderRadius: 10, marginBottom: 10,
                        background: "#f8fafc",
                        border: "1px solid #bbf7d0",
                        borderLeft: "3px solid #16a34a",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: "#dcfce7",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 16, border: "1px solid #bbf7d0", flexShrink: 0,
                            }}>
                              {displayGender === "Female" ? "👩" : "👨"}
                            </div>
                            <div>
                              <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1e293b", fontWeight: 700 }}>
                                {displayName}
                              </p>
                              <p style={{ margin: 0, fontSize: 11, color: theme.mutedText }}>
                                🕐 {a.time} · 📋 {a.reason}
                              </p>
                              {(displayAge || displayBlood || displayCond) && (
                                <p style={{ margin: "3px 0 0", fontSize: 11, color: theme.subText }}>
                                  {[displayAge, displayBlood, displayCond].filter(Boolean).join(" · ")}
                                </p>
                              )}
                            </div>
                          </div>
                          <span style={{
                            fontSize: 10, padding: "3px 10px", borderRadius: 20,
                            background: "#f0fdf4", color: "#16a34a",
                            border: "1px solid #bbf7d0", fontWeight: 600, whiteSpace: "nowrap",
                          }}>
                            ✅ Confirmed
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* ── Appointment Requests (PENDING) ── */}
              <div style={{ ...cardStyle, borderTop: `3px solid #d97706` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: "0 0 2px", fontSize: 14, color: "#1e293b", fontWeight: 700 }}>
                      Appointment Requests
                    </h3>
                    <p style={{ margin: 0, fontSize: 12, color: theme.subText }}>
                      Approve or reject pending appointment requests from patients
                    </p>
                  </div>
                  {pendingAppointments.length > 0 && (
                    <span style={{
                      fontSize: 12, padding: "4px 12px", borderRadius: 20,
                      background: "#fffbeb", color: "#d97706",
                      border: "1px solid #fde68a", fontWeight: 700,
                    }}>
                      {pendingAppointments.length} pending
                    </span>
                  )}
                </div>

                {pendingAppointments.length === 0 && (
                  <div style={{
                    textAlign: "center", padding: "28px 0",
                    color: theme.mutedText, fontSize: 13,
                    background: "#f8fafc", borderRadius: 10,
                    border: `1px dashed ${theme.cardBorder}`,
                  }}>
                    🎉 No pending appointment requests
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {pendingAppointments.map((a) => (
                    <div key={a._id} style={{
                      padding: 16, borderRadius: 10,
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderLeft: "3px solid #d97706",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1e293b", fontWeight: 700 }}>
                            {a.userId?.name || a.patientName || `Patient (...${String(a.userId ?? "").slice(-4)})`}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: theme.subText }}>
                            {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {a.time}
                          </p>
                          <p style={{ margin: "3px 0 0", fontSize: 11, color: theme.mutedText }}>
                            📋 {a.reason}
                          </p>
                        </div>
                        <span style={{
                          fontSize: 10, padding: "3px 9px", borderRadius: 20,
                          background: "#fffbeb", color: "#d97706",
                          border: "1px solid #fde68a", fontWeight: 600, whiteSpace: "nowrap",
                        }}>⏳ Pending</span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => updateStatus(a._id, "CONFIRMED")}
                          style={{
                            flex: 1, padding: "7px", borderRadius: 7, border: "none",
                            background: "#16a34a", color: "white", fontWeight: 700,
                            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                          }}>✓ Approve</button>
                        <button
                          onClick={() => updateStatus(a._id, "REJECTED")}
                          style={{
                            flex: 1, padding: "7px", borderRadius: 7,
                            border: "1px solid #fecaca", background: "#fef2f2",
                            color: "#dc2626", fontWeight: 700,
                            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                          }}>✕ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ SEARCH PATIENT ═══ */}
          {activeTab === "search" && (
            <div>
              <div style={{ ...cardStyle, marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 18, color: "#1e293b" }}>Search Patient</h2>
                <p style={{ margin: "0 0 16px", color: theme.subText, fontSize: 13 }}>Enter Health ID to view complete patient profile and clinical history</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value={searchId}
                    onChange={(e) => { setSearchId(e.target.value); setSearchPerformed(false); setSelectedPatient(null); setNotFound(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="e.g. HID-2024-001"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button onClick={handleSearch} style={{ ...btnPrimary, padding: "10px 22px", borderRadius: 9, fontSize: 14 }}>Search</button>
                </div>
                {notFound && (
                  <div style={{ marginTop: 12, padding: "11px 14px", borderRadius: 9, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>
                    ✕ No patient found with ID "{searchId}".
                  </div>
                )}
                {!searchPerformed && (
                  <div style={{ marginTop: 14 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 11, color: theme.mutedText, textTransform: "uppercase", letterSpacing: 0.8 }}>Quick select</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {/* Only show patients who have a CONFIRMED appointment with this doctor */}
                      {myAppointments
                        .filter((a) => a.status === "CONFIRMED")
                        .map((a) => patients.find((p) => String(p._id) === String(a.userId?._id ?? a.userId)))
                        .filter(Boolean)
                        .filter((p, i, arr) => arr.findIndex((x) => x._id === p._id) === i)
                        .map((p, i) => (
                        <button key={i} onClick={() => { setSearchId(p._id); setSelectedPatient(p); setNotFound(false); setSearchPerformed(true); }} style={{
                          padding: "7px 14px", borderRadius: 8,
                          background: "#e8f0fb", border: `1px solid ${BTN}55`,
                          color: BTN, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 500,
                        }}>{p._id} — {p.name}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div style={{ display: "grid", gridTemplateColumns: "285px 1fr", gap: 20 }}>
                  <div style={{ ...cardStyle, height: "fit-content" }}>
                    <div style={{ textAlign: "center", marginBottom: 18 }}>
                      <div style={{
                        width: 68, height: 68, borderRadius: "50%", margin: "0 auto 10px",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 28, border: "3px solid #e9d5ff",
                      }}>{selectedPatient.gender === "Female" ? "👩" : "👨"}</div>
                      <h3 style={{ margin: "0 0 2px", color: "#1e293b", fontSize: 16 }}>{selectedPatient.name}</h3>
                      <p style={{ margin: 0, color: theme.mutedText, fontSize: 12 }}>{selectedPatient._id}</p>
                      <span style={{
                        display: "inline-block", marginTop: 7, fontSize: 11, padding: "3px 13px",
                        borderRadius: 20, background: `${statusColor(selectedPatient.status)}12`,
                        color: statusColor(selectedPatient.status),
                        border: `1px solid ${statusColor(selectedPatient.status)}35`, fontWeight: 600,
                      }}>{selectedPatient.status}</span>
                    </div>
                    {[
                      ["Age", selectedPatient.age + " years"],
                      ["Gender", selectedPatient.gender],
                      ["Blood Group", selectedPatient.blood],
                      ["Phone", selectedPatient.phone],
                      ["Condition", selectedPatient.condition],
                      ["Last Visit", selectedPatient.lastVisit],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${theme.divider}` }}>
                        <span style={{ fontSize: 12, color: theme.mutedText }}>{k}</span>
                        <span style={{ fontSize: 12, color: "#1e293b", fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                      <button onClick={() => { setRxPatientId(selectedPatient._id); setRxPatientFound(selectedPatient); setRxPatientError(false); setActiveTab("prescription"); }} style={{
                        flex: 1, padding: "8px", borderRadius: 8,
                        background: "#e8f0fb", border: `1px solid ${BTN}55`,
                        color: BTN, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600,
                      }}>✎ Prescribe</button>
                      <button onClick={() => { setHrPatientId(selectedPatient._id); setHrPatientFound(selectedPatient); setHrPatientError(false); setActiveTab("healthRecords"); }} style={{
                        flex: 1, padding: "8px", borderRadius: 8,
                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                        color: "#16a34a", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600,
                      }}>♥ Health Record</button>
                    </div>
                  </div>

                  <div style={cardStyle}>
                    <h3 style={{ margin: "0 0 18px", color: "#1e293b", fontSize: 15, fontWeight: 700 }}>Clinical History</h3>
                    {(!selectedPatient.history || selectedPatient.history.length === 0) && (
                      <p style={{ color: theme.mutedText, fontSize: 13 }}>No history recorded yet.</p>
                    )}
                    {(selectedPatient.history || []).map((h, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 16, paddingBottom: 18, marginBottom: 18,
                        borderBottom: i < selectedPatient.history.length - 1 ? `1px solid ${theme.divider}` : "none",
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: BTN, flexShrink: 0 }} />
                          {i < selectedPatient.history.length - 1 && <div style={{ width: 1, flex: 1, background: `${BTN}55`, marginTop: 6 }} />}
                        </div>
                        <div>
                          <p style={{ margin: "0 0 5px", fontSize: 12, color: BTN, fontWeight: 700 }}>{h.date}</p>
                          <p style={{ margin: 0, fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{h.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ UPLOAD PRESCRIPTION ═══ */}
          {activeTab === "prescription" && (
            <div style={{ maxWidth: 620 }}>
              <div style={cardStyle}>
                <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#1e293b" }}>Upload Prescription</h2>
                <p style={{ margin: "0 0 20px", color: theme.subText, fontSize: 13 }}>
                  Enter the Patient ID to link this prescription to the correct patient record. Fields marked <span style={{ color: "#dc2626" }}>*</span> are required.
                </p>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Patient ID <Star /></label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      value={rxPatientId}
                      onChange={(e) => { setRxPatientId(e.target.value); setRxPatientFound(null); setRxPatientError(false); }}
                      placeholder="e.g. HID-2024-001"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button onClick={handleRxLookup} style={{ ...btnPrimary, padding: "10px 18px", borderRadius: 9, fontSize: 13 }}>Find Patient</button>
                  </div>
                  {rxPatientError && (
                    <p style={{ margin: "7px 0 0", fontSize: 12, color: "#dc2626" }}>✕ No patient found with this ID. Please verify and try again.</p>
                  )}
                </div>

                {rxPatientFound && (
                  <PatientBadge patient={rxPatientFound} bg="#f0fdf4" borderC="#bbf7d0" textColor="#15803d" />
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Prescription Notes <Star /></label>
                  <textarea
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    placeholder={"Rx\n1. Amlodipine 5mg — 1 tablet once daily\n2. Metformin 500mg — twice daily after meals\n\nInstructions: Monitor BP daily. Follow up in 2 weeks."}
                    rows={8}
                    style={{ ...inputStyle, fontFamily: "monospace", resize: "vertical" }}
                  />
                </div>

                <div style={{
                  padding: 18, borderRadius: 10, border: "2px dashed #cbd5e1",
                  background: "#f8fafc", textAlign: "center", marginBottom: 16, color: theme.mutedText,
                }}>
                  <p style={{ margin: "0 0 5px", fontSize: 22 }}>📎</p>
                  <p style={{ margin: "0 0 3px", fontSize: 13, color: theme.subText }}>Drop scanned prescription here</p>
                  <p style={{ margin: 0, fontSize: 11 }}>PDF, JPG, PNG supported</p>
                </div>

                {prescriptionUploaded && (
                  <div style={{ padding: "11px 14px", borderRadius: 9, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", marginBottom: 14, fontSize: 13 }}>
                    ✓ Prescription uploaded and linked to <strong>{rxPatientFound?.name}</strong>'s record successfully!
                  </div>
                )}

                <button
                  onClick={handleUploadPrescription}
                  disabled={!rxPatientFound || !prescriptionText.trim()}
                  style={{
                    width: "100%", padding: 13, borderRadius: 10, border: "none",
                    background: rxPatientFound && prescriptionText.trim() ? BTN : "#e2e8f0",
                    color: rxPatientFound && prescriptionText.trim() ? "#fff" : "#94a3b8",
                    fontSize: 14, fontWeight: 700,
                    cursor: rxPatientFound && prescriptionText.trim() ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                  }}>
                  Upload & Save Prescription
                </button>
              </div>
            </div>
          )}

          {/* ═══ UPDATED HEALTH RECORD ═══ */}
          {activeTab === "healthRecords" && (
            <div style={{ maxWidth: 700 }}>
              <div style={cardStyle}>
                <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#1e293b" }}>Updated Health Record</h2>
                <p style={{ margin: "0 0 20px", color: theme.subText, fontSize: 13 }}>
                  Enter the Patient ID to update their health record. All fields marked <span style={{ color: "#dc2626" }}>*</span> are mandatory.
                </p>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Patient ID <Star /></label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      value={hrPatientId}
                      onChange={(e) => { setHrPatientId(e.target.value); setHrPatientFound(null); setHrPatientError(false); }}
                      placeholder="e.g. HID-2024-001"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button onClick={handleHrLookup} style={{ ...btnPrimary, padding: "10px 18px", borderRadius: 9, fontSize: 13 }}>Find Patient</button>
                  </div>
                  {hrPatientError && (
                    <p style={{ margin: "7px 0 0", fontSize: 12, color: "#dc2626" }}>✕ No patient found with this ID. Please verify and try again.</p>
                  )}
                </div>

                {hrPatientFound && (
                  <PatientBadge patient={hrPatientFound} bg="#e8f0fb" borderC={`${BTN}55`} textColor={BTN} />
                )}

                <SectionHead title="Vitals" color={BTN} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 4 }}>
                  <div>
                    <label style={labelStyle}>Blood Pressure (mmHg) <Star /></label>
                    <input value={healthRecord.bp} onChange={(e) => setHealthRecord((r) => ({ ...r, bp: e.target.value }))} placeholder="e.g. 120/80" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Pulse Rate (bpm) <Star /></label>
                    <input value={healthRecord.pulse} onChange={(e) => setHealthRecord((r) => ({ ...r, pulse: e.target.value }))} placeholder="e.g. 72" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Weight (kg) <Star /></label>
                    <input value={healthRecord.weight} onChange={(e) => setHealthRecord((r) => ({ ...r, weight: e.target.value }))} placeholder="e.g. 72" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Height (cm) <Star /></label>
                    <input value={healthRecord.height} onChange={(e) => setHealthRecord((r) => ({ ...r, height: e.target.value }))} placeholder="e.g. 165" style={inputStyle} />
                  </div>
                </div>

                <SectionHead title="Clinical Information" color="#7c3aed" />
                <div style={{ marginBottom: 13 }}>
                  <label style={labelStyle}>Diagnosis <Star /></label>
                  <input value={healthRecord.diagnosis} onChange={(e) => setHealthRecord((r) => ({ ...r, diagnosis: e.target.value }))} placeholder="e.g. Hypertension Stage II, Type 2 Diabetes" style={inputStyle} />
                </div>
                <div style={{ marginBottom: 13 }}>
                  <label style={labelStyle}>Clinical Notes <Star /></label>
                  <textarea value={healthRecord.clinicalNotes} onChange={(e) => setHealthRecord((r) => ({ ...r, clinicalNotes: e.target.value }))} placeholder="Detailed observations, examination findings, plan of care..." rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>Next Visit Date <Star /></label>
                  <input type="date" value={healthRecord.nextVisitDate} onChange={(e) => setHealthRecord((r) => ({ ...r, nextVisitDate: e.target.value }))} style={inputStyle} />
                </div>

                {recordSaved && (
                  <div style={{ padding: "11px 14px", borderRadius: 9, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", marginBottom: 14, fontSize: 13 }}>
                    ✓ Health record saved and synced to <strong>{hrPatientFound?.name}</strong>'s profile successfully!
                  </div>
                )}

                <button
                  onClick={handleSaveRecord}
                  disabled={!hrPatientFound}
                  style={{
                    width: "100%", padding: 13, borderRadius: 10, border: "none",
                    background: hrPatientFound ? BTN : "#e2e8f0",
                    color: hrPatientFound ? "#fff" : "#94a3b8",
                    fontSize: 14, fontWeight: 700,
                    cursor: hrPatientFound ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    boxShadow: hrPatientFound ? `0 3px 12px ${BTN}55` : "none",
                  }}>
                  Save Updated Health Record
                </button>
              </div>
            </div>
          )}

          {/* ═══ TRACK APPOINTMENTS ═══ */}
          {activeTab === "appointments" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#1e293b" }}>My Appointments</h2>
                <p style={{ margin: 0, fontSize: 13, color: theme.subText }}>
                  All appointments associated with your account
                </p>
              </div>

              {myAppointments.length === 0 && (
                <div style={{ ...cardStyle, textAlign: "center", padding: 40, color: theme.mutedText }}>
                  No appointments found for your account.
                </div>
              )}

              {myAppointments
                .filter((a) => a.status === "CONFIRMED" || a.status === "REJECTED")
                .map((a) => (
                  <div key={a._id} style={{
                    ...cardStyle,
                    marginBottom: 14,
                    borderLeft: `4px solid ${a.status === "CONFIRMED" ? "#16a34a" : "#dc2626"}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
                          {a.userId?.name || a.patientName || `Patient (${String(a.userId ?? "").slice(-6)})`}
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: theme.mutedText }}>
                          {a.hospitalId?.name || "Hospital"} · {a.specialization}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 700,
                        background: a.status === "CONFIRMED" ? "#f0fdf4" : "#fef2f2",
                        color: a.status === "CONFIRMED" ? "#16a34a" : "#dc2626",
                        border: `1px solid ${a.status === "CONFIRMED" ? "#bbf7d0" : "#fecaca"}`,
                      }}>
                        {a.status === "CONFIRMED" && "✅ Confirmed"}
                        {a.status === "REJECTED"  && "❌ Rejected"}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      {[
                        ["📅 Date", new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
                        ["🕐 Time", a.time],
                        ["📋 Reason", a.reason],
                      ].map(([label, value]) => (
                        <div key={label} style={{ background: theme.inputBg, borderRadius: 8, padding: "8px 12px" }}>
                          <p style={{ margin: "0 0 2px", fontSize: 10, color: theme.mutedText, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</p>
                          <p style={{ margin: 0, fontSize: 13, color: "#1e293b", fontWeight: 600 }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
