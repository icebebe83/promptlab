const fs = require('fs');

async function listModels() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  const apiKey = envText.match(/GEMINI_API_KEY=(.*)/)?.[1]?.trim();
  
  if (!apiKey) {
    console.error('API Key not found in .env.local');
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      console.log('Available Models:');
      data.models.forEach(m => {
        console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log('Error listing models:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Fetch Error:', error.message);
  }
}

listModels();
