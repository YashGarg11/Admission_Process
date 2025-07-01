const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const connectDB = require("./config/db");
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const statusRoutes = require('./routes/StatusRoutes');
const cookieParser = require('cookie-parser');
const paymentRoutes = require('./routes/paymentRoutes');
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://admission-process-sr5l.vercel.app',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("College Admission API Running");
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/payment", paymentRoutes);
// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
