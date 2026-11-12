const MigrantProfile = require("../models/migrantProfile");

exports.createProfile = async (req, res) => {
  try {
    const profile = new MigrantProfile(req.body);

    // ✅ Save first to get _id
    await profile.save();

    // ✅ Generate QR (store ID)
    profile.qrCode = profile._id.toString();

    await profile.save();

    res.json(profile);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating profile" });
  }
};