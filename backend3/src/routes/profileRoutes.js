const express = require("express");
const router = express.Router();
const MigrantProfile = require("../models/migrantProfile");

// ✅ GET PROFILE BY USER ID
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔍 find user
    const profile = await MigrantProfile.findOne({ userId });

    // ❌ if not found
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    // ✅ send data
    res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (err) {
    console.log("Profile Fetch Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error ❌",
    });
  }
});

module.exports = router;