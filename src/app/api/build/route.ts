import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { customText, existingTags, missingCategories, labMode, optimizationMode, complexity } = await req.json();

    if (!missingCategories || missingCategories.length === 0) {
      return NextResponse.json({ suggestedTags: [] }, { status: 200 });
    }

    const isGraphic = labMode === 'graphic';
    const modeName = isGraphic ? 'Graphic Design' : 'Photography';
    const formulaName = optimizationMode === 'mj' ? 'Midjourney 6-step' : 'Nanobanana 7-step';
    const subject = customText || "Any creative subject that fits the tags";

    const model = genAI.getGenerativeModel(
      { model: 'gemini-3.1-flash-lite-preview' },
      { apiVersion: 'v1beta' }
    );

    const systemPrompt = `You are "Prompt LAB Professional", a high-end commercial prompt engineering AI.

The user is building a visual prompt but has only provided limited information.
Your task is to understand their core intent and generate the missing tags to form a highly professional ${modeName} masterpiece using the ${formulaName} formula.

User's Setup:
- Core Subject: "${subject}"
- Target Mode: ${modeName}
- Target Formula: ${formulaName}
- Complexity Mode: ${complexity === 1 ? 'LOW' : complexity === 2 ? 'STANDARD' : 'HI-RES'}
- Existing Tags user selected: ${JSON.stringify(existingTags, null, 2)}

Your task:
The following categories are currently EMPTY: ${JSON.stringify(missingCategories)}.
For EVERY missing category, you MUST generate exactly ONE highly professional, specific, and evocative tag that perfectly complements the user's intent. 

CRITICAL RULES FOR GRAPHIC DESIGN MODE:
if Target Mode is Graphic Design, you MUST STRICTLY FORBID the generation of tags implying humans, characters, anime, or photorealism UNLESS the user explicitly added a "Character Mascot" tag. 
If the user provides a subject like "KANANA" and a tag like "Brand Logo", DO NOT generate floating people. Generate tags that enforce a pure logo design: e.g. "Flat Vector Art", "Clean White Space", "Minimalist Lettermark", "Corporate Brand Identity".

For example:
- If the subject is "KANANA" and existing tag is "Brand Logo", you must deduce this is a logo design and suggest tags like "Vector Graphic Art" (art3d), "Minimalist Grid Layout" (design), "Flat Typography" (lighting) etc.
- If the core subject is "Model" and existing tag is "High Fashion", suggest "Cinematic Studio Background", "Rembrandt Lighting", "85mm Lens", etc.

Requirements for Tag Generation:
- 'content': A concise English phrase (max 4-5 words) suitable for prompting. No special characters.
- 'translationKo': A short, natural Korean translation of the content.
- 'id': A unique string like 'ai-gen-[random number]'.
- 'category': The EXACT category name from the missing categories list.

[JSON SCHEMA]
Return ONLY a valid JSON object matching this schema:
{
  "suggestedTags": [
    {
      "id": "ai-gen-[number]",
      "content": "English Phrase",
      "category": "categoryName",
      "translationKo": "한글 번역"
    }
  ]
}`;

    const result = await model.generateContent([
      { text: systemPrompt },
    ]);

    const responseText = result.response.text();
    let parsedJson;
    
    try {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/{[\s\S]*}/);
      const jsonContent = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
      parsedJson = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Failed to parse JSON from AI response", responseText);
      return NextResponse.json({ error: 'AI 응답 파싱 실패' }, { status: 500 });
    }

    // Filter to ensure only requested categories are returned
    const validTags = parsedJson.suggestedTags?.filter((tag: any) => 
      missingCategories.includes(tag.category)
    ) || [];

    return NextResponse.json({ suggestedTags: validTags }, { status: 200 });

  } catch (error: any) {
    console.error('Build Prompt API Error:', error);
    return NextResponse.json(
      { error: `Build Prompt API 오류: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
