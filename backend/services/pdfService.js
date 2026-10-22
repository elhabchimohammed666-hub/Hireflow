const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Extracts plain text from an uploaded CV document (PDF or text file)
 * @param {string} filePath - Absolute or relative path to the CV file
 * @returns {Promise<string>} Extracted text
 */
async function extractCvText(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found for extraction: ${filePath}`);
      return '';
    }

    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf-8');
    }

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text || '';
    }

    // Fallback for other formats or utf-8 strings
    const buffer = fs.readFileSync(filePath);
    return buffer.toString('utf-8');
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error.message);
    return '';
  }
}

module.exports = { extractCvText };
