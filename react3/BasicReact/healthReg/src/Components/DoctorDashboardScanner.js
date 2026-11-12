import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

const DoctorDashboardScanner = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    let scanned = false; // ✅ prevent multiple scans

    // ✅ Extract ID from QR
    const getIdFromDecodedText = (decodedText) => {
      if (!decodedText) return "";
      const trimmed = decodedText.trim();
      return trimmed.includes("/")
        ? trimmed.substring(trimmed.lastIndexOf("/") + 1).trim()
        : trimmed;
    };

    // ✅ On successful scan
    const onScanSuccess = async (decodedText) => {
      if (scanned) return;
      scanned = true;

      const workerId = getIdFromDecodedText(decodedText);
      if (!workerId) return;

      try {
        // ✅ STOP scanner first (VERY IMPORTANT)
        await scanner.stop();
        await scanner.clear();

        console.log("Scanned Worker ID:", workerId);

        // ✅ Fetch prescriptions
        const res = await axios.get(
          `http://localhost:7001/api/prescription/${workerId}`
        );

        console.log("Prescriptions:", res.data);

        // ✅ Send data to parent
        if (onScan) onScan(workerId, res.data);
      } catch (err) {
        console.error("Scan handling error:", err);
        alert("Failed to fetch prescriptions");
      }
    };

    // ✅ Start scanner
    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        const selectedCamera =
          (devices || []).find((device) =>
            /back|rear|environment/i.test(device.label)
          ) || devices?.[0];

        if (selectedCamera?.id) {
          await scanner.start(
            selectedCamera.id,
            { fps: 10, qrbox: { width: 300, height: 300 } },
            onScanSuccess,
            (errorMessage) =>
              console.warn("QR Decode Error:", errorMessage)
          );
          return;
        }
      } catch (err) {
        console.warn("Camera detection failed, fallback mode:", err);
      }

      // ✅ Fallback camera
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 300, height: 300 } },
          onScanSuccess,
          (errorMessage) =>
            console.warn("QR Decode Error:", errorMessage)
        );
      } catch (err) {
        console.error("Scanner start error:", err);
      }
    };

    startScanner();

    // ✅ Scan from image
    const scanFromImage = async () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const decodedText = await scanner.scanFile(file, true);
          const id = getIdFromDecodedText(decodedText);

          console.log("Scanned from image:", id);

          if (id && onScan) onScan(id);
        } catch (err) {
          console.error("Image scan error:", err);
          alert("Failed to read QR from image");
        }
      };

      fileInput.click();
    };

    // expose button function
    window.scanFromImage = scanFromImage;

    // ✅ CLEANUP (FIXED)
    return () => {
      (async () => {
        try {
          await scanner.stop();
          await scanner.clear();
        } catch (err) {
          console.log("Cleanup error:", err);
        }
      })();
    };
  }, [onScan]);

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Scan Worker QR</h3>

      <div
        id="reader"
        style={{ width: "400px", margin: "0 auto" }}
      />

      <button
        onClick={() => window.scanFromImage()}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "#5d8aa8",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Scan QR from Image
      </button>

      <p
        style={{
          fontSize: "12px",
          marginTop: "5px",
          color: "#555",
        }}
      >
        Tip: You can scan from camera or upload QR image
      </p>
    </div>
  );
};

export default DoctorDashboardScanner;