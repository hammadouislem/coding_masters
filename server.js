require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const adminRouter = require('./routes/adminRoutes');
const studentRouter = require('./routes/studentRoutes');
const centerRouter = require('./routes/CenterRoutes');

// Database connection import
const connectDB = require('./config/db');

const app = express();

// ───── MIDDLEWARE SETUP ─────
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
}));

app.use(morgan('combined'));
app.use(helmet());

// ───── ROUTES ─────
app.use('/admin', adminRouter);
app.use('/student', studentRouter);
app.use('/center', centerRouter);

// ───── 404 Handler ─────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ───── Error Handler (last) ─────
app.use(errorHandler);

// ───── DB CONNECTION & SERVER BOOTSTRAP ─────
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  process.on('SIGINT', () => {
    console.log('🛑 Graceful shutdown');
    server.close(() => {
      console.log('✅ Closed remaining connections');
      process.exit(0);
    });
  });
};

// Start DB connection and server
connectDB().then(startServer);
