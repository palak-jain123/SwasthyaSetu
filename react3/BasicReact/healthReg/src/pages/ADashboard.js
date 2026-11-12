import { useState, useCallback, useEffect } from "react";
import axios from "axios";
// ─── DATA ───
const initialWorkers = [
  { id: "MW-001", name: "Rajan Kumar", origin: "Bihar, India", age: 32, status: "Active", doctor: "Dr. Mehta", blood: "B+", phone: "+91 9812345678", address: "Site B Camp, Gurugram" },
  { id: "MW-002", name: "Asha Singh", origin: "UP, India", age: 27, status: "In Treatment", doctor: "Dr. Patel", blood: "A+", phone: "+91 9823456789", address: "Labour Colony, Sec 18" },
  { id: "MW-003", name: "Mohan Hasan", origin: "Bangladesh", age: 35, status: "Active", doctor: "Dr. Roy", blood: "O+", phone: "+880 17123456", address: "Transit Camp, IMT Manesar" },
  { id: "MW-004", name: "Priya Devi", origin: "Odisha, India", age: 24, status: "Critical", doctor: "Dr. Mehta", blood: "AB-", phone: "+91 9834567890", address: "Site A, Faridabad" },
  { id: "MW-005", name: "Suresh Kamble", origin: "Maharashtra", age: 41, status: "Active", doctor: "Dr. Roy", blood: "B-", phone: "+91 9845678901", address: "Worker Quarters, DLF" },
];

const initialDoctors = [
  { id: "D-01", name: "Dr. Ananya Mehta", license: "MCI-2018-04521", spec: "General Medicine", hospital: "Fortis Gurugram", expiry: "2026-12-31", email: "ananya.mehta@fortis.in", valid: true },
  { id: "D-02", name: "Dr. Ramesh Patel", license: "MCI-2015-03127", spec: "Surgery", hospital: "Medanta", expiry: "2025-06-30", email: "r.patel@medanta.org", valid: false },
  { id: "D-03", name: "Dr. Souvik Roy", license: "MCI-2020-06789", spec: "Orthopedics", hospital: "Apollo Delhi", expiry: "2027-03-15", email: "s.roy@apollo.in", valid: true },
  { id: "D-04", name: "Dr. Preeti Sharma", license: "MCI-2019-05432", spec: "Pediatrics", hospital: "Max Hospital", expiry: "2026-09-20", email: "p.sharma@max.in", valid: true },
];

const initialPatients = [
  { name: "Priya Devi", date: "2025-03-10", diagnosis: "Acute Respiratory Infection", doctor: "Dr. Mehta", ward: "ICU", status: "Critical" },
  { name: "Asha Singh", date: "2025-03-18", diagnosis: "Fracture - Left Arm", doctor: "Dr. Patel", ward: "Surgical", status: "Active" },
  { name: "Mohan Hasan", date: "2025-03-22", diagnosis: "Hypertension", doctor: "Dr. Roy", ward: "General", status: "Recovering" },
  { name: "Rajan Kumar", date: "2025-03-24", diagnosis: "Fever & Dehydration", doctor: "Dr. Mehta", ward: "General", status: "Active" },
];

const initialPendingConsents = [
  { name: "Priya Devi", type: "Surgery Consent", doctor: "Dr. Mehta", urgent: true },
  { name: "Mohan Hasan", type: "Data Sharing Consent", doctor: "Dr. Roy", urgent: false },
  { name: "Rajan Kumar", type: "Treatment Consent", doctor: "Dr. Patel", urgent: false },
];

const initialApprovedConsents = [
  { name: "Asha Singh", type: "Treatment Consent", doctor: "Dr. Patel" },
  { name: "Suresh Kamble", type: "Lab Tests Consent", doctor: "Dr. Roy" },
];

// ─── HELPERS ───
const isExpired = (dateStr) => new Date(dateStr) < new Date();

const getInitials = (name) => {
  const parts = name.replace("Dr. ", "").split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
};

const AVATAR_COLORS = [
  { bg: "#e8f4fd", color: "#1a6fa8" },
  { bg: "#edf7ee", color: "#1a7a3a" },
  { bg: "#fdf3e8", color: "#a85e1a" },
  { bg: "#f3eeff", color: "#6b35c9" },
  { bg: "#fde8ee", color: "#c91a4a" },
  { bg: "#e8fdf8", color: "#1a8a6a" },
];
const avatarStyle = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const STATUS_CONFIG = {
  Active:          { cls: "pill-green",   label: "Active" },
  "In Treatment":  { cls: "pill-amber",   label: "In Treatment" },
  Critical:        { cls: "pill-red",     label: "Critical" },
  Discharged:      { cls: "pill-neutral", label: "Discharged" },
  Recovering:      { cls: "pill-blue",    label: "Recovering" },
};

// ─── SUBCOMPONENTS ───
function Avatar({ name, size = 30 }) {
  const style = avatarStyle(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: style.bg, color: style.color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: size * 0.36, flexShrink: 0,
      fontFamily: "var(--font-body)",
    }}>
      {getInitials(name)}
    </div>
  );
}

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || { cls: "pill-neutral", label: status };
  return <span className={`pill ${cfg.cls}`}>{cfg.label}</span>;
}

function Toast({ message, visible }) {
  if (!visible) return null;
  const isError = message.toLowerCase().startsWith("please");
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: "var(--surface)", border: "1px solid var(--border)",
      borderLeft: `3px solid ${isError ? "var(--danger)" : "var(--accent)"}`,
      borderRadius: 8, padding: "12px 16px",
      fontSize: 13, fontFamily: "var(--font-body)",
      boxShadow: "0 4px 20px rgba(0,0,0,.12)",
      maxWidth: 300, animation: "slideIn .2s ease", color: "var(--text)",
    }}>
      {message}
    </div>
  );
}

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>&#215;</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── PAGES ───
function DashboardPage({ workers, doctors, patients, setPage }) {
  

  return (
    <div>
      <div className="stats-grid">
        {[
          { label: "Migrant Workers",    value: workers.length, change: "+12 this month", dir: "up" },
          { label: "Registered Doctors", value: doctors.length, change: "+2 new",         dir: "up" },
         
          { label: "Pending Doctors",   value: 3,              change: "Needs attention", dir: "warn" },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.dir}`}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="panel-row" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Workers</span>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => setPage("workers")}>
              View all
            </button>
          </div>
          <table className="data-table">
            <thead><tr><th>Worker</th><th>Origin</th><th>Status</th><th>Assigned Doctor</th></tr></thead>
            <tbody>
              {workers.slice(0, 4).map((w, i) => (
                <tr key={i}>
                  <td><div className="avatar-cell"><Avatar name={w.name} size={30} />{w.name}</div></td>
                  <td>{w.origin}</td>
                  <td><StatusPill status={w.status} /></td>
                  <td>{w.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
}

function WorkersPage({ workers, setWorkers, showToast }) {
  const [modal, setModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [search, setSearch] = useState("");
  const emptyForm = { id: "", name: "", origin: "", age: "", status: "Active", doctor: "", blood: "", phone: "", address: "" };
  const [form, setForm] = useState(emptyForm);

  const openAdd  = () => { setForm(emptyForm); setEditIdx(null); setModal(true); };
  const openEdit = (i) => { setForm({ ...workers[i] }); setEditIdx(i); setModal(true); };
  const close    = () => setModal(false);
  const f        = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const save = () => {
    if (!form.name) { showToast("Please enter a worker name"); return; }
    const w = { ...form, id: form.id || "MW-" + String(workers.length + 1).padStart(3, "0") };
    if (editIdx !== null) {
      const next = [...workers]; next[editIdx] = w; setWorkers(next);
      showToast("Worker updated successfully");
    } else {
      setWorkers([...workers, w]);
      showToast("Worker added successfully");
    }
    close();
  };

  const del = (i) => { setWorkers(workers.filter((_, idx) => idx !== i)); showToast("Worker removed"); };

  const filtered = workers.filter((w) =>
    !search || w.name.toLowerCase().includes(search) || w.origin.toLowerCase().includes(search) || w.doctor.toLowerCase().includes(search)
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Migrant Workers</div>
          <div className="section-sub">Manage registered migrant workers and their health records</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <input className="form-input" placeholder="Search workers..." style={{ width: 200 }} value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} />
          <button className="btn btn-primary" onClick={openAdd}>Add Worker</button>
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr><th>Worker</th><th>ID</th><th>Origin</th><th>Age</th><th>Status</th><th>Assigned Doctor</th><th>Blood Group</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((w, i) => (
              <tr key={i}>
                <td>
                  <div className="avatar-cell">
                    <Avatar name={w.name} size={30} />
                    <div>
                      <div>{w.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{w.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{w.id}</td>
                <td>{w.origin}</td>
                <td>{w.age}</td>
                <td><StatusPill status={w.status} /></td>
                <td>{w.doctor}</td>
                <td><span className="pill pill-blue">{w.blood}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => openEdit(i)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => del(i)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={close} title={editIdx !== null ? "Edit Worker" : "Add Migrant Worker"}
        footer={<><button className="btn btn-ghost" onClick={close}>Cancel</button><button className="btn btn-primary" onClick={save}>Save Worker</button></>}>
        <div className="form-grid">
          {[["Full Name","name","text","e.g. Rajan Kumar"],["Worker ID","id","text","MW-0001"],["Origin State/Country","origin","text","e.g. Bihar, India"],["Age","age","number","28"],["Phone Number","phone","text","+91 9876543210"]].map(([label, key, type, ph]) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <input className="form-input" type={type} placeholder={ph} value={form[key] || ""} onChange={f(key)} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select className="form-select" value={form.blood} onChange={f("blood")}>
              <option value="">Select...</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Assigned Doctor</label>
            <select className="form-select" value={form.doctor} onChange={f("doctor")}>
              <option value="">Select doctor...</option>
              {["Dr. Mehta","Dr. Patel","Dr. Roy","Dr. Sharma"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={f("status")}>
              {["Active","In Treatment","Critical","Discharged"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label className="form-label">Address</label>
            <input className="form-input" placeholder="Current residential address" value={form.address || ""} onChange={f("address")} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DoctorsPage({ showToast }) {
  const [doctors, setDoctors] = useState([]);

  // 🔹 Fetch pending doctors from backend
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7001/api/admin/pending-doctors"
      );
      setDoctors(res.data);
    } catch (err) {
      console.log("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ✅ Approve Doctor
  const approveDoctor = async (id) => {
    try {
      await axios.put(`http://localhost:7001/api/admin/approve/${id}`);
      showToast("Doctor Approved ✅");
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ Reject Doctor
  const rejectDoctor = async (id) => {
    try {
      await axios.put(`http://localhost:7001/api/admin/reject/${id}`);
      showToast("Doctor Rejected ❌");
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Doctor Approval Requests</div>
          <div className="section-sub">
            Approve or reject newly registered doctors
          </div>
        </div>
      </div>

      <div className="panel">
        {doctors.length === 0 ? (
          <p style={{ padding: "20px" }}>No pending doctors</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>License</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.name}</td>
                  <td>{doc.licenseId}</td>
                  <td>{doc.specialization}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => approveDoctor(doc._id)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      style={{ marginLeft: "10px" }}
                      onClick={() => rejectDoctor(doc._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PatientsPage({ patients, setPatients, showToast }) {
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ name: "Rajan Kumar", date: "", diagnosis: "", doctor: "Dr. Mehta", ward: "General", status: "Active" });
  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const save = () => { setPatients([...patients, { ...form }]); setModal(false); showToast("Patient record added"); };
  const del  = (i) => { setPatients(patients.filter((_, idx) => idx !== i)); showToast("Patient record removed"); };

  const filtered = filter === "all" ? patients : patients.filter((p) => p.status.toLowerCase() === filter);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Patient Records</div>
          <div className="section-sub">View and manage medical records of all migrant workers</div>
        </div>
        <button className="btn btn-primary" style={{ marginLeft: "auto" }} onClick={() => setModal(true)}>Add Patient Record</button>
      </div>

      <div className="tabs">
        {[["all","All Patients"],["active","Active"],["critical","Critical"],["discharged","Discharged"]].map(([val, label]) => (
          <div key={val} className={`tab ${filter === val ? "active" : ""}`} onClick={() => setFilter(val)}>{label}</div>
        ))}
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr><th>Patient</th><th>Admission Date</th><th>Diagnosis</th><th>Attending Doctor</th><th>Ward</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i}>
                <td><div className="avatar-cell"><Avatar name={p.name} size={30} />{p.name}</div></td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{p.date}</td>
                <td>{p.diagnosis}</td>
                <td>{p.doctor}</td>
                <td><span className="pill pill-neutral">{p.ward}</span></td>
                <td><StatusPill status={p.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => showToast(`Viewing: ${p.name}`)}>View</button>
                    <button className="btn btn-sm btn-danger" onClick={() => del(i)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Patient Record"
        footer={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save Record</button></>}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Patient (Worker)</label>
            <select className="form-select" value={form.name} onChange={f("name")}>
              {["Rajan Kumar","Asha Singh","Mohan Hasan","Priya Devi"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Admission Date</label>
            <input className="form-input" type="date" value={form.date} onChange={f("date")} />
          </div>
          <div className="form-group full">
            <label className="form-label">Diagnosis</label>
            <input className="form-input" placeholder="Primary diagnosis" value={form.diagnosis} onChange={f("diagnosis")} />
          </div>
          <div className="form-group">
            <label className="form-label">Attending Doctor</label>
            <select className="form-select" value={form.doctor} onChange={f("doctor")}>
              {["Dr. Mehta","Dr. Patel","Dr. Roy"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Ward</label>
            <select className="form-select" value={form.ward} onChange={f("ward")}>
              {["General","ICU","Surgical","Pediatric","Emergency"].map((w) => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={f("status")}>
              {["Active","Critical","Recovering","Discharged"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ConsentPage({ showToast }) {
  const [pending, setPending]   = useState(initialPendingConsents);
  const [approved, setApproved] = useState(initialApprovedConsents);

  const approve = (i) => {
    const item = pending[i];
    showToast(`Consent approved for ${item.name}`);
    setPending(pending.filter((_, idx) => idx !== i));
    setApproved([{ ...item, justApproved: true }, ...approved]);
  };
  const deny = (i) => {
    showToast("Consent denied");
    setPending(pending.map((p, idx) => (idx === i ? { ...p, denied: true } : p)));
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Consent Management</div>
          <div className="section-sub">Track and manage patient and doctor treatment consents</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Pending Consents</span>
            <span className="count-badge" style={{ marginLeft: "auto" }}>{pending.filter((p) => !p.denied).length}</span>
          </div>
          {pending.map((c, i) => (
            <div key={i} className="consent-item" style={{ opacity: c.denied ? 0.35 : 1, transition: "opacity .3s" }}>
              <Avatar name={c.name} size={32} />
              <div className="consent-info">
                <div className="consent-name">{c.name}</div>
                <div className="consent-sub">
                  {c.type} &mdash; {c.doctor}
                  {c.urgent && <span style={{ color: "var(--danger)", marginLeft: 6 }}>Urgent</span>}
                </div>
              </div>
              {!c.denied ? (
                <div className="consent-actions">
                  <button className="btn btn-sm btn-primary" onClick={() => approve(i)}>Approve</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deny(i)}>Deny</button>
                </div>
              ) : (
                <span className="pill pill-red">Denied</span>
              )}
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-header"><span className="panel-title">Approved Consents</span></div>
          {approved.map((c, i) => (
            <div key={i} className="consent-item">
              <Avatar name={c.name} size={32} />
              <div className="consent-info">
                <div className="consent-name">{c.name}</div>
                <div className="consent-sub">
                  {c.type} &mdash; {c.doctor} &mdash;{" "}
                  <span style={{ color: "var(--success)" }}>{c.justApproved ? "Just approved" : "Approved"}</span>
                </div>
              </div>
              <span className="pill pill-green">Signed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ValidatePage({ doctors }) {
  const [licInput, setLicInput] = useState("");
  const [result, setResult]     = useState(null);

  const validate = () => {
    if (!licInput.trim()) return;
    const doc = doctors.find((d) => d.license.toLowerCase() === licInput.trim().toLowerCase());
    if (doc) {
      const expired = isExpired(doc.expiry);
      setResult({ found: true, valid: !expired, doc, expired });
    } else {
      setResult({ found: false });
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Doctor Validation</div>
          <div className="section-sub">Verify medical license numbers and check registration status</div>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>
        <div className="validation-card">
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: "var(--text)" }}>Check Doctor License</div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="form-input" style={{ flex: 1 }}
              placeholder="Enter license number (e.g. MCI-2019-04521)"
              value={licInput}
              onChange={(e) => setLicInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && validate()}
            />
            <button className="btn btn-primary" onClick={validate}>Validate</button>
          </div>
          {result && (
            <div className={`validation-result ${result.found && result.valid ? "valid" : "invalid"}`} style={{ display: "block", marginTop: 14 }}>
              {result.found ? (
                <>
                  <div className="val-status">{result.valid ? "License valid" : "License invalid / expired"}</div>
                  <div className="val-detail">
                    <strong>{result.doc.name}</strong> &mdash; {result.doc.spec}<br />
                    Hospital: {result.doc.hospital}<br />
                    License: {result.doc.license}<br />
                    Expiry: {result.doc.expiry}{result.expired ? " — Expired" : ""}
                  </div>
                </>
              ) : (
                <>
                  <div className="val-status">Not found</div>
                  <div className="val-detail">License "{licInput}" is not in the registry.</div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header"><span className="panel-title">All Doctor Validation Status</span></div>
          <table className="data-table">
            <thead><tr><th>Doctor</th><th>License</th><th>Expiry</th><th>Status</th></tr></thead>
            <tbody>
              {doctors.map((d, i) => {
                const expired = isExpired(d.expiry);
                return (
                  <tr key={i}>
                    <td>{d.name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--accent2)" }}>{d.license}</td>
                    <td style={{ color: expired ? "var(--danger)" : "var(--muted)", fontSize: 12 }}>{d.expiry}</td>
                    <td>
                      {d.valid && !expired
                        ? <span className="pill pill-green">Valid</span>
                        : <span className="pill pill-red">Expired / Invalid</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── APP ───
export default function App() {
  const [page, setPage]       = useState("dashboard");
  const [workers, setWorkers] = useState(initialWorkers);
  const [doctors]             = useState(initialDoctors);   // Fix: removed unused setDoctors
  const [patients]            = useState(initialPatients);  // Fix: removed unused setPatients
  const [toast, setToast]     = useState({ visible: false, message: "" });

  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard",       section: "Main" },
    { id: "workers",   label: "Migrant Workers", section: null   },
    { id: "doctors",   label: "Doctors",         section: null   },
  ];

  const pageTitles = {
    dashboard: "Dashboard", workers: "Migrant Workers", doctors: "Doctors",
    patients: "Patient Records",
  };

  const seenSections = new Set();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --bg:       #f5f5f0;
          --surface:  #ffffff;
          --surface2: #f0f0eb;
          --border:   #e0e0d8;
          --accent:   #2563eb;
          --accent2:  #0891b2;
          --success:  #16a34a;
          --amber:    #d97706;
          --danger:   #dc2626;
          --text:     #1a1a18;
          --muted:    #6b6b62;
          --font-body: 'IBM Plex Sans', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
          --radius: 6px;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {  margin: 0; padding: 0;  background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 14px; -webkit-font-smoothing: antialiased; }

        .app { display: flex; min-height: 100vh; }

        .sidebar { width: 232px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; flex-shrink: 0; }
        .sidebar-logo { padding: 20px 18px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
        .logo-mark { font-size: 15px; font-weight: 600; letter-spacing: -0.2px; color: var(--text); }
        .logo-icon { width: 30px; height: 30px; background: var(--accent); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #fff; flex-shrink: 0; }
        .sidebar-section { padding: 16px 18px 6px; font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; margin: 1px 8px; border-radius: var(--radius); cursor: pointer; font-size: 13.5px; font-weight: 400; color: var(--muted); transition: background .12s, color .12s; }
        .nav-item:hover { background: var(--surface2); color: var(--text); }
        .nav-item.active { background: #eff6ff; color: var(--accent); font-weight: 500; border-left: 2px solid var(--accent); padding-left: 10px; }
        .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.35; flex-shrink: 0; }
        .nav-item.active .nav-dot { opacity: 1; }
        .nav-badge { margin-left: auto; font-size: 11px; font-weight: 500; padding: 1px 7px; border-radius: 20px; background: var(--surface2); color: var(--muted); font-family: var(--font-mono); }
        .nav-badge.warn { background: #fef3c7; color: #92400e; }
        .sidebar-footer { margin-top: auto; padding: 14px 16px; border-top: 1px solid var(--border); }
        .user-card { display: flex; align-items: center; gap: 10px; }
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 12px; flex-shrink: 0; }
        .user-name { font-size: 13px; font-weight: 500; color: var(--text); }
        .user-role { font-size: 11px; color: var(--muted); margin-top: 1px; }
        .user-badge { margin-left: auto; font-size: 10px; font-weight: 600; background: #fee2e2; color: #991b1b; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.4px; text-transform: uppercase; }

        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .topbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 28px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 50; }
        .page-title { font-size: 15px; font-weight: 600; color: var(--text); }
        .content { padding: 10px ; flex: 1; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; }
        .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
        .stat-value { font-size: 28px; font-weight: 300; color: var(--text); font-family: var(--font-mono); letter-spacing: -1px; margin-bottom: 6px; }
        .stat-change { font-size: 12px; color: var(--success); }
        .stat-change.down { color: var(--danger); }
        .stat-change.warn { color: var(--amber); }

        .panel-row { display: grid; grid-template-columns: 1fr 300px; gap: 16px; margin-bottom: 20px; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
        .panel-header { padding: 13px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; background: #fafafa; }
        .panel-title { font-size: 13px; font-weight: 600; color: var(--text); }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background: #fafafa; padding: 9px 14px; text-align: left; font-size: 10.5px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); }
        .data-table td { padding: 11px 14px; font-size: 13px; border-bottom: 1px solid var(--border); color: var(--text); }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tbody tr:hover td { background: #fafaf8; }

        .pill { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.2px; }
        .pill-green   { background: #dcfce7; color: #15803d; }
        .pill-red     { background: #fee2e2; color: #b91c1c; }
        .pill-amber   { background: #fef3c7; color: #92400e; }
        .pill-blue    { background: #dbeafe; color: #1e40af; }
        .pill-neutral { background: var(--surface2); color: var(--muted); }

        .avatar-cell { display: flex; align-items: center; gap: 10px; }

        .activity-list { padding: 4px 0; }
        .activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--border); }
        .activity-item:last-child { border-bottom: none; }
        .activity-dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
        .activity-text { font-size: 13px; line-height: 1.5; color: var(--text); }
        .activity-time { font-size: 11px; color: var(--muted); margin-top: 2px; }

        .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 999; align-items: center; justify-content: center; }
        .modal-overlay.open { display: flex; animation: fadeIn .18s ease; }
        .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; width: 540px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 8px 40px rgba(0,0,0,.14); }
        .modal-header { padding: 18px 22px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; }
        .modal-title { font-size: 15px; font-weight: 600; flex: 1; }
        .modal-close { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 20px; line-height: 1; padding: 0 4px; transition: color .12s; }
        .modal-close:hover { color: var(--text); }
        .modal-body { padding: 20px 22px; }
        .modal-footer { padding: 14px 22px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; background: #fafafa; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-group.full { grid-column: 1/-1; }
        .form-label { font-size: 11px; font-weight: 600; letter-spacing: 0.4px; color: var(--muted); text-transform: uppercase; }
        .form-input, .form-select { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 11px; color: var(--text); font-family: var(--font-body); font-size: 13px; outline: none; width: 100%; transition: border-color .15s; }
        .form-input:focus, .form-select:focus { border-color: var(--accent); background: #fff; }

        .btn { padding: 7px 14px; border-radius: var(--radius); border: 1px solid var(--border); cursor: pointer; font-family: var(--font-body); font-size: 13px; font-weight: 500; transition: all .12s; background: var(--surface); color: var(--text); }
        .btn:hover { background: var(--surface2); }
        .btn-primary { background: var(--accent); color: #fff; border-color: transparent; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-ghost { background: transparent; color: var(--muted); border-color: var(--border); }
        .btn-ghost:hover { background: var(--surface2); color: var(--text); }
        .btn-danger { background: #fef2f2; color: var(--danger); border-color: #fecaca; }
        .btn-danger:hover { background: #fee2e2; }
        .btn-sm { padding: 4px 11px; font-size: 12px; border-radius: 5px; }

        .section-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
        .section-title { font-size: 17px; font-weight: 600; color: var(--text); }
        .section-sub { font-size: 12.5px; color: var(--muted); margin-top: 3px; }

        .tabs { display: flex; gap: 2px; background: var(--surface2); border-radius: var(--radius); padding: 3px; width: fit-content; margin-bottom: 16px; border: 1px solid var(--border); }
        .tab { padding: 5px 14px; border-radius: 4px; font-size: 12.5px; font-weight: 500; cursor: pointer; color: var(--muted); transition: all .12s; }
        .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 3px rgba(0,0,0,.08); }

        .validation-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; margin-bottom: 16px; }
        .validation-result { margin-top: 14px; border-radius: var(--radius); padding: 14px; }
        .validation-result.valid   { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .validation-result.invalid { background: #fef2f2; border: 1px solid #fecaca; }
        .val-status { font-weight: 600; font-size: 14px; color: var(--text); }
        .val-detail { font-size: 13px; color: var(--muted); margin-top: 6px; line-height: 1.6; }

        .consent-item { display: flex; align-items: center; gap: 12px; padding: 13px 16px; border-bottom: 1px solid var(--border); }
        .consent-item:last-child { border-bottom: none; }
        .consent-info { flex: 1; min-width: 0; }
        .consent-name { font-size: 13.5px; font-weight: 500; color: var(--text); }
        .consent-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .consent-actions { display: flex; gap: 6px; flex-shrink: 0; }

        .count-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; font-size: 11px; font-weight: 600; background: #fef3c7; color: #92400e; font-family: var(--font-mono); }

        @keyframes fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">MH</div>
            <span className="logo-mark">MigraHealth</span>
          </div>

          {navItems.map((item) => {
            const showSection = item.section && !seenSections.has(item.section);
            if (item.section) seenSections.add(item.section);
            return (
              <div key={item.id}>
                {showSection && <div className="sidebar-section">{item.section}</div>}
                <div className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
                  <span className="nav-dot" />
                  {item.label}
                  {item.badge !== undefined && (
                    <span className={`nav-badge ${item.badgeType || ""}`}>{item.badge}</span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="sidebar-footer">
            <button
              className="btn btn-danger"
              style={{ width: "100%" }}
              onClick={() => {
                alert("Logged out");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <span className="page-title">{pageTitles[page]}</span>
          </div>
          <div className="content">
            {page === "dashboard" && <DashboardPage workers={workers} doctors={doctors} patients={patients} setPage={setPage} />}
            {page === "workers"   && <WorkersPage   workers={workers}   setWorkers={setWorkers}   showToast={showToast} />}
            {page === "doctors"   && <DoctorsPage showToast={showToast} />}
            {page === "consent"   && <ConsentPage   showToast={showToast} />}
            {page === "validate"  && <ValidatePage  doctors={doctors} />}
          </div>
        </div>

        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </>
  );
}