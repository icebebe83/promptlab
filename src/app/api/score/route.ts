import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const getSystemPrompt = (platform: string, mode: string) => {
  return `You are a prompt coach specializing in ${platform} for ${mode}. 
Return response in JSON format.
{
  "score": number,
  "badges": { "specificity": "text", "medium": "text", "environment": "text", "lighting": "text", "composition": "text", "parameters": "text" },
  "reasoning": "Korean text",
  "revisedPrompt": "English text",
  "suggestions": ["suggestion1"]
}`;
};

export async function POST(req: Request) {
  try {
    const { prompt, platform, mode, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: '프롬프트가 없습니다' }, { status: 400 });
    }

    console.log('Gemini 2.5 Flash Engine 가동 - 모델: gemini-2.5-flash, API: v1 (Score)');

    const systemPrompt = getSystemPrompt(platform || 'midjourney', mode || 'generation');

    const model = genAI.getGenerativeModel(
      { model: 'gemini-2.5-flash' },
      { apiVersion: 'v1' }
    );

    const contents: Content[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] });
      });
    }

    // 시스템 지침을 프롬프트와 결합
    const combinedPrompt = `${systemPrompt}\n\n[USER PROMPT]:\n${prompt}`;
    
    contents.push({ role: 'user', parts: [{ text: combinedPrompt }] });

    const chat = model.startChat({ history: contents.slice(0, -1) });
    const result = await chat.sendMessage(combinedPrompt);
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
      { error: '채점 엔진 오류 (Gemini-2.5-Flash)' },
      { status: 500 }
    );
  }
}
