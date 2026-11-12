const mongoose = require("mongoose");
require("dotenv").config();
const Prescription = require("./src/models/Prescription"); // adjust path

async function insertDummy() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("✅ MongoDB connected");

    const dummy = await Prescription.create({
      migrantId: new mongoose.Types.ObjectId("64f1a1a1a1a1a1a1a1a1a1a3"), // ✅ use 'new'
      doctorName: "Dr. Sharma",
      diagnosis: "Fever",
      medicines: [
        { name: "Paracetamol", dose: "500mg", duration: "5 days" },
        { name: "Cough Syrup", dose: "10ml", duration: "3 days" }
      ],
      notes: "Rest and drink plenty of water",
      date: new Date()
    });

    console.log("✅ Dummy prescription inserted:", dummy);
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting dummy data:", err);
    process.exit(1);
  }
}

insertDummy();