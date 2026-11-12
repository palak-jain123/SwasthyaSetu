const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const MigrantProfile = require("../models/migrantProfile");
const Doctor = require("../models/doctorModel");

const { validLicenses } = require("../data/validDoctorLicense");

// ================= MIGRANT REGISTER =================
const QRCode = require("qrcode");

  const register = async (req, res) => {
  console.log("REGISTER API HIT ");   

  try {
    let {
      username,
      password,
      role,
      name,
      gender,
      dob,
      age,
      aadhaar,
      bloodGroup,
      disorder,
      domicile,
      currentAddress,
      otpVerified
    } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        message: "Username, password and role are required"
      });
    }

    if (aadhaar) {
      aadhaar = String(aadhaar).replace(/\D/g, "");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists "
      });
    }

    if (role === "migrant") {
      if (!aadhaar || aadhaar.length !== 12) {
        return res.status(400).json({
          message: "Valid Aadhaar required "
        });
      }

      if (!otpVerified) {
        return res.status(400).json({
          message: "OTP verification required "
        });
      }

      const existingAadhaar = await MigrantProfile.findOne({ aadhaar });
      if (existingAadhaar) {
        return res.status(400).json({
          message: "Aadhaar already registered "
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();

    let qrCode = null;

    
    if (role === "migrant") {

      const qrData = `http://localhost:3000/patient/${newUser._id}`;
      qrCode = await QRCode.toDataURL(qrData);

      const profile = new MigrantProfile({
        userId: newUser._id,
        name,
        gender,
        dob,
        age,
        aadhaar,
        bloodGroup,
        disorder,
        domicile,
        currentAddress,
        qrCode
      });

      await profile.save();
    }

    res.status(201).json({
      message: "User registered successfully ✅",
      userId: newUser._id,
      name,
      qrCode
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);

  
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate data (Aadhaar/Username) ❌"
      });
    }

    res.status(500).json({
      message: "Server error ❌",
      error: err.message
    });
  }
};

// ================= DOCTOR REGISTER =================
const registerDoctor = async (req, res) => {
  try {
    let {
      username,
      password,
      name,
      licenseId,
      mobile,
      specialization,
    
    } = req.body;

   if (!username || !password || !licenseId || !req.body.hospitalId) {
  return res.status(400).json({
    message: "Required fields missing "
  });
}

    
    const cleanLicense = licenseId.trim().toUpperCase();

    if (!validLicenses.includes(cleanLicense)) {
      return res.status(400).json({
        message: "Invalid License ID "
      });
    }

    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already used "
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: "doctor"
    });

    try {
      

await Doctor.create({
  userId: newUser._id,
  name,
  licenseId: cleanLicense,
  mobile,
  specialization,
  hospitalId: req.body.hospitalId,
  status: "pending"
});
    } catch (err) {
      await User.findByIdAndDelete(newUser._id);
      throw err;
    }

   res.status(201).json({
  message: "Wait for admin approval ⏳",
  doctor: {
    userId: newUser._id,
    name,
    licenseId: cleanLicense,
    mobile,
    specialization,
    hospitalId: req.body.hospitalId,
    status: "pending"
  }
});

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("USERNAME:", username);

    // 🔹 find user
    const user = await User.findOne({ username });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found " });
    }

    // 🔹 check password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials " });
    }

    // 🔹 doctor status check
    let doctorData = null;
    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (!doctor) {
        return res.status(400).json({ message: "Doctor profile missing " });
      }

      if (doctor.status === "pending") {
        return res.status(403).json({ message: "Wait for admin approval ⏳" });
      }

      if (doctor.status === "rejected") {
        return res.status(403).json({ message: "Rejected by admin " });
      }

      doctorData = {
        name: doctor.name,
        licenseId: doctor.licenseId,
        mobile: doctor.mobile,
        specialization: doctor.specialization,
        status: doctor.status
      };
    }

    // 🔹 generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔹 send response
    res.json({
      token,
      role: user.role,
      userId: user._id,
      doctor: doctorData
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error " });
  }
};

module.exports = {
  register,
  registerDoctor,
  login
};