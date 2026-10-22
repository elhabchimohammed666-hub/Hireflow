const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'],
      default: 'Full-time'
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    qualifications: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Closed'],
      default: 'Published'
    },
    viewsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
