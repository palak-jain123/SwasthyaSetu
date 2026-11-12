import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ChooseRole from "./pages/ChooseRole";
import Home from "./pages/Home";
import Login from "./pages/login";
import WorkerReg from "./pages/WorkerReg";
import DoctorReg from "./pages/DoctorReg";
import GovernmentReg from "./pages/GovReg";
import WorkerHome from "./pages/WorkerHome";
import AdminDashboard from "./pages/ADashboard";
import GDashboard from "./pages/GDashboard";
import DocDash from "./pages/DocDash";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PatientView from "./pages/PatientView";
import Scheme from "./pages/Scheme";
import WorkerQR from "./pages/WorkerQR";
import DoctorDashboardScanner from "./Components/DoctorDashboardScanner";

function App() {

  
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
        <Route path="/choose-role" element={<ChooseRole />} />
       <Route path="/worker-register" element={<WorkerReg />} />
         <Route path="/doctor-register" element={<DoctorReg />} />
        <Route path="/scanner" element={<WorkerQR />} />
        <Route path="/worker-qr" element={<WorkerQR />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
         <Route path="/worker-home" element={<WorkerHome />} />
         <Route path="/government-dashboard" element={<GDashboard/>} />
          <Route path="/govt-register" element={<GovernmentReg />} />
          <Route path="/doctor-dashboard" element={<DocDash />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/scheme" element={<Scheme />} />
          <Route path="/patient/:id" element={<PatientView />} />
    
        {/* ─── FALLBACK (IMPORTANT) ─── */}
      
    <Route path="/doctor-dashboard/scanner" element={<DoctorDashboardScanner />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
