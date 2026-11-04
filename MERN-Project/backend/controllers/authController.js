import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'feedbackhub_mern_secret_key_2026_super_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
export const registerStudent = async (req, res) => {
  try {
    const { name, rollNo, email, password, course } = req.body;

    if (!name || !rollNo || !email || !password || !course) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, rollNo, email, password, course'
      });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email already exists'
      });
    }

    const rollNoExists = await User.findOne({ rollNo: rollNo.toUpperCase().trim() });
    if (rollNoExists) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this Roll Number already exists'
      });
    }

    const user = await User.create({
      name,
      rollNo: rollNo.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      course,
      role: 'student'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FeedbackHub.',
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        course: user.course,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during student registration'
    });
  }
};

// @desc    Student login
// @route   POST /api/auth/login
export const loginStudent = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Can be rollNo or email

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Roll No / Email and password'
      });
    }

    const query = identifier.includes('@')
      ? { email: identifier.toLowerCase().trim() }
      : { rollNo: identifier.toUpperCase().trim() };

    const user = await User.findOne(query);

    if (!user || user.role !== 'student') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your Roll No/Email.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your password.'
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        course: user.course,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide admin username and password'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: username.toLowerCase().trim() },
        { rollNo: username.toUpperCase().trim() },
        { name: { $regex: new RegExp(`^${username.trim()}$`, 'i') } }
      ],
      role: 'admin'
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Administrator account not found'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator password'
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Admin access granted.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
