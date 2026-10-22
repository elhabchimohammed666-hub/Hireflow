const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: [true, 'Note text cannot be empty']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // The specific CV submitted for THIS job application (preserved independently)
    cvFile: {
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
      path: { type: String, required: true },
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
      isDefaultCvUsed: { type: Boolean, default: false }
    },
    cvText: {
      type: String,
      default: ''
    },
    coverNote: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'],
      default: 'Applied'
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    // Private recruiter notes - confidential, never exposed to candidate
    recruitmentNotes: [noteSchema],
    // AI Analysis results for this specific application
    aiAnalysis: {
      matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null
      },
      summary: {
        type: String,
        default: ''
      },
      matchingSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      matchingQualifications: [{ type: String }],
      unverifiedRequirements: [{ type: String }],
      evidenceExplanation: {
        type: String,
        default: ''
      },
      analyzedAt: {
        type: Date,
        default: null
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'not_analyzed'],
        default: 'not_analyzed'
      },
      modelUsed: {
        type: String,
        default: ''
      }
    }
  },
  { timestamps: true }
);

// Prevent duplicate application by the same candidate to the same job
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
