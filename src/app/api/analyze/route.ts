import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: '이미지가 없습니다' }, { status: 400 });
    }

    const mimeTypeMatch = image.match(/^data:(image\/(png|jpeg|webp|jpg|gif));base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
    const base64Data = image.replace(/^data:image\/(png|jpeg|webp|jpg|gif);base64,/, '');

    console.log('Gemini 2.5 Flash Engine 가동 - 모델: gemini-2.5-flash, API: v1');

    const model = genAI.getGenerativeModel(
      { model: 'gemini-2.5-flash' },
      { apiVersion: 'v1' }
    );

    const analysisPrompt = `Analyze this image for platform-specific prompts. 
Return ONLY a valid JSON object.
{
  "midjourney": { "english": "MJ prompt", "korean": "KR text", "reasoning": "Reason", "score": 90, "breakdown": [] },
  "nanobanana": { "english": "NB prompt", "korean": "KR text", "reasoning": "Reason", "score": 90, "breakdown": [] }
}`;

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType } },
      { text: analysisPrompt },
    ]);

    const responseText = result.response.text();
    let jsonContent = responseText;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/{[\s\S]*}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1] || jsonMatch[0];
    }

    return new NextResponse(jsonContent, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Gemini-2.5-Flash Error:', error);
    return NextResponse.json(
      { error: '분석 엔진 오류 (Gemini-2.5-Flash)' },
      { status: 500 }
    );
  }
}
