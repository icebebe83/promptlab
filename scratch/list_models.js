const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    // There is no listModels in the standard JS SDK directly easily without an authenticated browser/server-side fetch
    // But we can try to hit the rest API via node's fetch (since it's node 24)
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      console.log('Available Models:');
      data.models.forEach(m => console.log(m.name));
    } else {
      console.log('Error listing models:', data);
    }
  } catch (error) {
    console.error('Fetch Error:', error.message);
  }
}

listModels();
