import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'FeedbackHub MERN API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FeedbackHub MERN Backend API',
    endpoints: {
      auth: '/api/auth',
      feedback: '/api/feedback',
      admin: '/api/admin',
      courses: '/api/courses',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server after connecting to MongoDB
const startServer = async () => {
  await connectDB();

  // Auto-seed admin if database is completely fresh
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('⚡ First launch detected: seeding default administrator & demo records...');
      const { default: child_process } = await import('child_process');
      child_process.fork('./seed/seedData.js');
    }
  } catch (err) {
    console.warn('Seed verification notice:', err.message);
  }

  app.listen(PORT, () => {
    console.log('==================================================================');
    console.log(`🚀 FeedbackHub Backend running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints ready at http://localhost:${PORT}/api/`);
    console.log('==================================================================');
  });
};

startServer();
