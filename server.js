require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const errorHandler = require("./middlewares/errorHandler");
const { connectRedis } = require('./config/redis');

const app = express();
app.use(cookieParser());

// CORS setup
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
});
app.use(limiter);

app.use(morgan('combined'));

app.use(helmet());
app.use(errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Define routes
const userRouter = require("./routes/userRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const publicRouter = require("./routes/publicRouter.js");
const agencyRouter = require("./routes/agencyRouter.js");
const authRouter = require("./routes/authRouter.js");

app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/", publicRouter);
app.use("/agency", agencyRouter);
app.use("/auth", authRouter);

// Undefined route handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Ensure Redis is connected before starting the server
const startServer = async () => {
    try {
        await connectRedis();
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to Redis', err);
        process.exit(1);
    }
};
// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('Received SIGINT. Gracefully shutting down...');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
});



startServer();
