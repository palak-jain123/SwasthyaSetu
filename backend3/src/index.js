const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dbConnect = require("./config/dbConnect");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const otpRoutes = require("./routes/otpRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const profileRoute = require("./routes/profileRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const patientRoutes1 = require("./routes/patientRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
dbConnect();

// ✅ MIDDLEWARE FIRST
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api", enquiryRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", profileRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api", doctorRoutes);
app.use("/api", patientRoutes);
app.use("/api", patientRoutes1);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/prescription", prescriptionRoutes);
// ✅ TEST
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = 7001;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
