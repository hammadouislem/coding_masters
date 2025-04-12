require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./middlewares/errorHandler');

const adminRouter = require('./routes/adminRoutes');
const studentRouter = require('./routes/studentRoutes');
const centerRouter = require('./routes/CenterRoutes');
const authRouter = require('./routes/authRoutes');

const connectDB = require('./config/db');

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mashrou3i API Documentation',
      version: '1.0.0',
      description: 'API documentation for managing projects, deadlines, and statuses in the admin panel for the Coding Masters 2025.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ───── Middleware ─────
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helmet for security
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://your-production-frontend.com' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
}));

// Logging
app.use(morgan('combined'));

// ───── Routes ─────
app.use('/admin', adminRouter);
app.use('/student', studentRouter);
app.use('/center', centerRouter);
app.use('/auth', authRouter);

// ───── 404 Handler ─────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ───── Error Handler ─────
app.use(errorHandler);

// ───── Start Server ─────
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });

  process.on('SIGINT', () => {
    console.log('🛑 Graceful shutdown - SIGINT received');
    server.close(() => {
      console.log('💤 Server closed');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    console.log('🔌 Graceful shutdown - SIGTERM received');
    server.close(() => {
      console.log('💤 Server closed');
      process.exit(0);
    });
  });
};

// ───── Connect DB & Launch ─────
connectDB().then(() => startServer()).catch((err) => {
  console.error('❌ Failed to connect to database', err);
  process.exit(1);
});
