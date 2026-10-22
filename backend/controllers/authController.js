const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hireflow_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc Register a new user (Recruiter or Candidate)
// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, companyInfo, candidateProfile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'recruiter' ? 'recruiter' : 'candidate',
      companyInfo: companyInfo || {},
      candidateProfile: candidateProfile || {}
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyInfo: user.companyInfo,
        candidateProfile: user.candidateProfile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyInfo: user.companyInfo,
        candidateProfile: user.candidateProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyInfo: user.companyInfo,
        candidateProfile: user.candidateProfile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user profile (companyInfo for recruiters, candidateProfile for candidates)
// @route PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name;

    if (user.role === 'recruiter' && req.body.companyInfo) {
      user.companyInfo = { ...user.companyInfo.toObject(), ...req.body.companyInfo };
    }

    if (user.role === 'candidate' && req.body.candidateProfile) {
      user.candidateProfile = { ...user.candidateProfile.toObject(), ...req.body.candidateProfile };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyInfo: user.companyInfo,
        candidateProfile: user.candidateProfile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Upload or replace default CV for candidate profile
// @route POST /api/auth/default-cv
exports.uploadDefaultCv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a CV document (.pdf or .txt)' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const fileUrl = `/uploads/cvs/${req.file.filename}`;

    user.candidateProfile.defaultCv = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: fileUrl,
      uploadedAt: new Date()
    };

    await user.save();

    res.json({
      success: true,
      message: 'Default CV uploaded successfully. Note: Previously submitted applications remain independently preserved.',
      defaultCv: user.candidateProfile.defaultCv
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
