import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DoctorDashboardScanner from "./components/DoctorDashboardScanner";

function ScannerWrapper() {
  const navigate = useNavigate();

  const handleScan = (id) => {
    const finalId = id.includes("/") ? id.split("/").pop().trim() : id.trim();
    console.log("Scanned ID:", finalId);

    navigate("/dashboard", { state: { scannedId: finalId } });
  };

  return <DoctorDashboardScanner onScan={handleScan} />;
}

function Dashboard() {
  const location = useLocation();
  const scannedId = location.state?.scannedId;

  return <div>Scanned ID: {scannedId || "No ID scanned"}</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/scanner" element={<ScannerWrapper />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;