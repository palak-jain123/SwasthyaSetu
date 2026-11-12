const express = require("express");
const router = express.Router();

let otpStore = {};
let verifiedAadhaar = new Set(); // ✅ store verified Aadhaar

// ================= SEND OTP =================
router.post("/send", (req, res) => {
  const { aadhaar } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ message: "Invalid Aadhaar ❌" });
  }

const cleanAadhaar = String(aadhaar).replace(/\D/g, "");
  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[cleanAadhaar] = otp;

  console.log("Generated OTP:", otp);

  res.json({
    success: true,
    message: "OTP sent ✅",
    otp // only for testing
  });
});


// ================= VERIFY OTP =================
router.post("/verify", (req, res) => {
  const { aadhaar, otp } = req.body;

  const cleanAadhaar = String(aadhaar).replace(/\s+/g, "").trim();

  if (otpStore[cleanAadhaar] == otp) {

    verifiedAadhaar.add(cleanAadhaar); // ✅ VERY IMPORTANT

    return res.json({
      success: true,
      message: "OTP Verified ✅"
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid OTP ❌"
  });
});


// ✅ EXPORT BOTH
module.exports = router;
module.exports.verifiedAadhaar = verifiedAadhaar;