import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    // The SDK doesn't have a direct listModels, we usually use the REST API or vertex AI SDK for that
    // but we can try to initialize some common ones and see which one doesn't 404
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-002', 'gemini-2.0-flash', 'gemini-2.0-flash-exp'];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent('test');
        console.log(`✅ ${m} is available`);
      } catch (e: any) {
        console.log(`❌ ${m}: ${e.message}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
