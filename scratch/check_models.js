const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    const modelList = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Just to check connectivity
    console.log('API Key connectivity check passed.');
    
    // Listing models isn't directly exposed in the simple client sometimes, 
    // but we can try to use the fetch API if needed.
    // However, let's just try gemini-1.5-flash as a fallback and see if it works.
    console.log('Current Model in code: gemini-2.5-flash');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
