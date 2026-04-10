import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Masterpiece Maker — Coaching API
 * 
 * Phases:
 *   "diagnose"  — 초기 프롬프트 진단 + 부족한 요소 파악 + 첫 질문
 *   "coaching"  — 유저 답변을 반영해 다음 질문 생성 (score 점진 상승)
 *   "finalize"  — 모든 정보 수집 완료 후 MJ 6-step / NB 7-step 최종 조립
 */

const COACHING_SYSTEM_PROMPT = `You are "Masterpiece Maker", a world-class prompt coaching AI specialized in visual prompt engineering.

[YOUR MISSION]
Guide the user through a conversational interview to build a PERFECT 100-score prompt. You must ask questions one at a time to fill in missing elements.

[ANALYSIS AXES - CHECK ALL]
1. Subject specificity (피사체 구체성)
2. Medium/Style (매체/스타일)
3. Environment/Background (환경/배경)
4. Lighting/Color (조명/색감)
5. Composition/Camera (구도/카메라)
6. Details/Texture (디테일/질감)
7. Parameters (파라미터)

[CONVERSATION RULES]
- When the user provides their initial prompt, diagnose which axes are WEAK or MISSING.
- Score the current prompt state honestly (0-100).
- Ask ONE focused question at a time about the weakest missing element.
- ALWAYS provide exactly 2 concrete visual alternatives as choices (choiceA and choiceB).
- Each choice must be visually descriptive and specific, not generic.
- Format choices as: "A: (dramatic/specific option)" vs "B: (different specific option)"
- Track which axes have been addressed. When all major axes are covered (score >= 90), set "phase" to "finalize".
- In finalize phase, assemble the FINAL prompts using both formulas.

[PLATFORM FORMULAS]
Midjourney 6-Step: [1.Subject], [2.Medium], [3.Environment], [4.Lighting/Color], [5.Composition] --[6.Parameters]
Nanobanana 7-Step: [1.Subject] + [2.Action] + [3.Background] + [4.Style] + [5.Composition] + [6.Lighting] + [7.Details]

[JSON RESPONSE FORMAT]
Always return ONLY valid JSON:
{
  "phase": "diagnose" | "coaching" | "finalize",
  "score": <number 0-100>,
  "message": "<Korean text: your coaching feedback and question>",
  "question": "<Korean text: the specific question you're asking>",
  "choiceA": "<Korean label + English prompt fragment>",
  "choiceB": "<Korean label + English prompt fragment>",
  "missingAxes": ["axis1", "axis2"],
  "collectedInfo": {
    "subject": "...",
    "medium": "...",
    "environment": "...",
    "lighting": "...",
    "composition": "...",
    "details": "...",
    "parameters": "..."
  },
  "finalMidjourney": "<only in finalize phase: complete MJ 6-step prompt>",
  "finalNanobanana": "<only in finalize phase: complete NB 7-step prompt>",
  "designIntent": "<only in finalize phase: Korean design intent summary>"
}`;

export async function POST(req: Request) {
  try {
    const { prompt, history, collectedInfo } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: '프롬프트가 없습니다' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel(
      { model: 'gemini-3.1-flash-lite-preview' },
      { apiVersion: 'v1beta' }
    );

    const contents: Content[] = [];

    // Build conversation history
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      });
    }

    // Build the current user message with context
    let userMessage = prompt;
    if (collectedInfo && Object.keys(collectedInfo).length > 0) {
      userMessage = `${prompt}\n\n[COLLECTED INFO SO FAR]: ${JSON.stringify(collectedInfo)}`;
    }

    const combinedPrompt = `${COACHING_SYSTEM_PROMPT}\n\n[USER INPUT]:\n${userMessage}`;

    contents.push({ role: 'user', parts: [{ text: combinedPrompt }] });

    const chat = model.startChat({ history: contents.slice(0, -1) });
    const result = await chat.sendMessage(combinedPrompt);
    const responseText = result.response.text();

    let jsonContent = responseText;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1] || jsonMatch[0];
    }

    // Validate & parse JSON
    try {
      JSON.parse(jsonContent);
    } catch {
      // If parsing fails, wrap in a fallback
      jsonContent = JSON.stringify({
        phase: "coaching",
        score: 30,
        message: responseText,
        question: "프롬프트에 대해 더 자세히 설명해 주세요.",
        choiceA: "A: 구체적인 피사체 설명 추가",
        choiceB: "B: 전체적인 분위기/무드 설명 추가",
        missingAxes: ["subject", "medium", "environment", "lighting", "composition", "details"],
        collectedInfo: {},
      });
    }

    return new NextResponse(jsonContent, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Masterpiece Maker Error:', error);
    const msg = error?.message || 'Unknown error';
    return NextResponse.json(
      { error: `코칭 엔진 오류: ${msg}` },
      { status: 500 }
    );
  }
}
