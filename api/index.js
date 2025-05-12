import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import adminRouter from './routes/admin.route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import passport from 'passport';
import session from 'express-session';
import './utils/passport.js'; // import passport config

dotenv.config();

const app = express();

// ========== MIDDLEWARES ==========
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // ✅ exact frontend origin only
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// ========== DATABASE ==========
mongoose.connect(process.env.MONGO).then(() => {
  console.log("✅ Connected to MongoDB.");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ========== ROUTES ==========
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter); // includes /google, /google/callback
app.use('/api/admin', adminRouter);

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.send('🚀 Server is running');
});

// ========== CLOUDINARY SIGNATURE ==========
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;

app.post('/generate-signature', (req, res) => {
  const { public_id, timestamp } = req.body;

  if (!public_id || !timestamp) {
    return res.status(400).json({ error: 'public_id and timestamp are required.' });
  }

  try {
    const signatureString = `public_id=${public_id}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');
    res.json({ signature, api_key: CLOUDINARY_API_KEY });
  } catch (err) {
    console.error('Signature generation error:', err);
    res.status(500).json({ error: 'Failed to generate signature.' });
  }
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ========== SERVER ==========
app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
