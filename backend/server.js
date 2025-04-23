const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.get("/", (req, res) => {
  res.send("College Admission API Running");
});
app.use("/api/auth", authRoutes);
app.use("/api/admission", admissionRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

