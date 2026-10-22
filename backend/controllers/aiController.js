const { generateCvImprovementSuggestions } = require('../services/aiService');
const { extractCvText } = require('../services/pdfService');
const User = require('../models/User');

// @desc Generate AI improvement advice for candidate CV
// @route POST /api/ai/cv-advice
exports.getCvAdvice = async (req, res) => {
  try {
    let cvText = '';

    if (req.file) {
      cvText = await extractCvText(req.file.path);
    } else {
      const user = await User.findById(req.user.id);
      const defaultCv = user?.candidateProfile?.defaultCv;
      if (defaultCv?.path) {
        cvText = await extractCvText(defaultCv.path);
      }
    }

    if (!cvText) {
      cvText = req.body.cvText || '';
    }

    if (!cvText) {
      return res.status(400).json({
        success: false,
        message: 'No CV text available to analyze. Please upload a CV first or provide text.'
      });
    }

    const suggestions = await generateCvImprovementSuggestions(cvText);

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
