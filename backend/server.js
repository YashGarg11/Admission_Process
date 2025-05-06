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

dotenv.config();
const app = express();

// Connect to DB
connectDB();

// Define allowed origins array with common frontend origins
const allowedOrigins = [
  'https://college-admission-system.vercel.app',
  'https://college-admission-system.netlify.app',
  'https://your-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Add the frontend URL from environment variable if available
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

console.log('Configured origins:', allowedOrigins);

// CORS Config
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    
    console.log('Request from origin:', origin);
    
    // For now, allow all origins to prevent deployment issues
    // You can change this to the commented code below when your app is stable
    return callback(null, true);
    
    /* Stricter production version:
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
    */
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("College Admission API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/admin", adminRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
