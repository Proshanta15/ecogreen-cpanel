import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorMiddleware } from './middlewares/error-middleware.js';
import adminRoute from './router/admin-router.js';
import authRoute from './router/auth-router.js';
import contactRoute from './router/contact-router.js';
import serviceRoute from './router/service-router.js';
import aboutRoute from './router/about-router.js';
import homeRoute from './router/home-router.js';
import footerShowcaseRoute from './router/footerShowcase-router.js';
import connectDB from './utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration for production
const corsOptions = {
    origin: [
        'https://sub.ecogreentex.eu.com',
        'https://ecogreentex.eu.com',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
};
app.use(cors(corsOptions));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/admin", adminRoute);
app.use("/api", serviceRoute);
app.use("/api", aboutRoute);
app.use("/api", homeRoute);
app.use("/api", footerShowcaseRoute);

// Test endpoint to check if API is working
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '✅ API is working!', 
        timestamp: new Date().toISOString(),
        status: 'OK',
        environment: process.env.NODE_ENV
    });
});

// Serve React Frontend from 'frontend/dist' folder
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Handle all React Router routes - THIS WORKS FOR YOU ✅
app.get('/{*splat}', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`✅ Serving React app from: ${distPath}`);
        console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
});