const express = require("express");
const router = express.Router();

const {
  register,
  registerDoctor,
  login
} = require("../controllers/authController");

// ✅ Migrant Register
router.post("/register", register);

// ✅ Doctor Register
router.post("/doctor-register", registerDoctor);

// ✅ Login (🔥 THIS WAS MISSING)
router.post("/login", login);

module.exports = router;