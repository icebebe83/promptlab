import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { layers, brandConstants, mode = 'photography' } = await req.json();

    if (!layers || typeof layers !== 'object') {
      return NextResponse.json({ error: '레이어 데이터가 올바르지 않습니다' }, { status: 400 });
    }

    const isGraphic = mode === 'graphic';
    console.log(`Gemini 3.1 Flash Lite - ${mode.toUpperCase()} 모드 가동`);

    const model = genAI.getGenerativeModel(
      { model: 'gemini-3.1-flash-lite-preview' },
      { apiVersion: 'v1beta' }
    );

    const imageParts: any[] = [];
    const layerInstructions: string[] = [];

    const toPart = (img: string) => {
      const mimeTypeMatch = img.match(/^data:(image\/(png|jpeg|webp|jpg|gif));base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
      const base64Data = img.replace(/^data:image\/(png|jpeg|webp|jpg|gif);base64,/, '');
      return { inlineData: { data: base64Data, mimeType } };
    };

    // 레이어별 이미지 및 가중치 정보 추출
    ['subject', 'composition', 'style', 'material'].forEach(key => {
      const layer = layers[key];
      if (layer && layer.data) {
        imageParts.push(toPart(layer.data));
        const idx = imageParts.length;
        layerInstructions.push(
          `Image ${idx} represents the [${key.toUpperCase()}] layer. 
           Weightings: Structure(${layer.weights.structure}%), Color(${layer.weights.color}%), Style(${layer.weights.style}%).`
        );
      }
    });

    if (imageParts.length === 0) {
      return NextResponse.json({ error: '분석할 이미지가 없습니다' }, { status: 400 });
    }

    // {{Subject}} 최우선 순위 설정
    const coreSubject = brandConstants || "the main subject of interest";

    let analysisPrompt = `You are "Prompt LAB Professional", a high-end commercial prompt engineering AI.
Mode: [${mode.toUpperCase()}]

[CORE INSTRUCTION]
Prioritize the user's provided Brand Constants: "${coreSubject}" as the absolute primary Subject (Step 1) in both formulas.

[PLATFORM FORMULAS]
1. Midjourney (MJ) - 6-Step Standard:
   Structure: [1.Subject], [2.Medium], [3.Environment], [4.Lighting/Color], [5.Composition] --[6.Parameters]
   Rules for [${mode.toUpperCase()}]:
   - ${isGraphic ? 'Prohibit "photorealistic", "photography", or camera lens specs. Use "vector", "Bauhaus", "Swiss Style", "Grid-based" instead.' : 'Focus on high-end camera specs, focal length, and studio lighting.'}
   - ${isGraphic ? 'ALWAYS append: --no photorealistic --v 6.1 --ar 3:4' : 'Append relevant MJ parameters like --ar 16:9 --v 6.1.'}
   - Use comma-separated keywords.

2. Nanobanana (NB) - 7-Step Structured Spec:
   Structure: [1.Subject] + [2.Action] + [3.Background] + [4.Style] + [5.Composition] + [6.Lighting] + [7.Details]
   Rules for [${mode.toUpperCase()}]:
   - ${isGraphic ? 'Use "High-end branding", "Technical design specifications", "Vector precision" vocabulary.' : 'Use narrative technical hyper-realism.'}
   - ${isGraphic ? 'STRICTLY FORBID "photorealistic" or "camera" terms. Focus on "layering", "grid symmetry", "matte finish".' : 'Focus on light geometry and lens optics.'}
   - Continuous narrative description following the 7 steps.

[LAYER SYNTHESIS]
Analyze the provided ${imageParts.length} images and weights:
${layerInstructions.join('\n')}
Strongly modulate the intensity of descriptors based on the percentage weights.

[JSON SCHEMA]
Return ONLY a valid JSON object:
{
  "midjourney": {
    "english": "Strict 6-step prompt",
    "korean": "KR interpretation",
    "reasoning": "Synthesis logic",
    "score": 98,
    "blocks": [{"text": "phrase", "category": "subject|medium|env|lighting|composition|param"}]
  },
  "nanobanana": {
    "english": "Strict 7-step narrative spec",
    "korean": "KR interpretation",
    "reasoning": "Synthesis logic",
    "score": 98,
    "blocks": [{"text": "phrase", "category": "subject|action|bg|style|composition|lighting|details"}]
  }
}
`;



    const result = await model.generateContent([
      ...imageParts,
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
    console.error('Professional Engine Error:', error);
    return NextResponse.json(
      { error: `Professional 엔진 오류: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
