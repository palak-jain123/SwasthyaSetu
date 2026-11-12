const express = require("express");
const router = express.Router();

const { validAadhaar, validDomicile } = require("../data/validdata");

router.post("/", (req, res) => {
  const { aadhaar, domicile } = req.body;

  const aadhaarStr = String(aadhaar);
  const domicileStr = String(domicile);

  if (!validAadhaar.includes(aadhaarStr)) {
    return res.status(400).json({ success: false, message: "Invalid Aadhaar ❌" });
  }

  if (!validDomicile.includes(domicileStr)) {
    return res.status(400).json({ success: false, message: "Invalid Domicile ❌" });
  }

  res.json({
    success: true,
    message: "Verified Successfully"
  });
});

module.exports = router;