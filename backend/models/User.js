const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['recruiter', 'candidate'],
      default: 'candidate'
    },
    // Recruiter-specific profile info
    companyInfo: {
      companyName: { type: String, default: '' },
      website: { type: String, default: '' },
      location: { type: String, default: '' },
      industry: { type: String, default: '' },
      description: { type: String, default: '' },
      logoUrl: { type: String, default: '' }
    },
    // Candidate-specific profile info
    candidateProfile: {
      headline: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      bio: { type: String, default: '' },
      skills: [{ type: String }],
      education: [
        {
          degree: String,
          institution: String,
          year: String
        }
      ],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String
        }
      ],
      // Default CV uploaded by the candidate
      defaultCv: {
        filename: String,
        originalName: String,
        path: String,
        url: String,
        uploadedAt: Date
      }
    }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
