"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Sparkles,
  Zap,
  Camera,
  Sun,
  Layout,
  Settings,
  Terminal,
  SlidersHorizontal,
  Layers,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { useToast } from "./Toast";

/* ─────────────── 6단계 공식 데이터 ─────────────── */
const formulaSteps = [
  {
    step: 1,
    title: "주제 (Subject)",
    icon: Sparkles,
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-300",
    tagColor: "bg-blue-900/40 text-blue-300",
    description: "무엇을 만들지 정의합니다. 구체적 명사 중심으로 작성하세요.",
    tips: [
      "\"big house\" 대신 \"huge Victorian mansion\" 처럼 구체적으로",
      "수량을 명시: \"flowers\" → \"three red roses\"",
      "인물은 성별, 나이, 의상, 포즈까지 지정",
    ],
    examples: ["futuristic cafe interior", "a samurai warrior in golden armor", "three glass bottles on a marble table"],
    badExamples: ["a nice place", "a person standing", "something beautiful"],
  },
  {
    step: 2,
    title: "매체 (Medium)",
    icon: ImageIcon,
    color: "from-purple-500 to-purple-700",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-300",
    tagColor: "bg-purple-900/40 text-purple-300",
    description: "어떤 표현 방식으로 시각화할지 결정합니다.",
    tips: [
      "사진: photo, photograph, editorial photography",
      "일러스트: digital illustration, watercolor painting",
      "3D: 3D render, Cinema 4D, Unreal Engine",
    ],
    examples: ["editorial photograph", "oil painting on canvas", "3D render in Unreal Engine 5"],
    badExamples: ["picture", "image", "artwork"],
  },
  {
    step: 3,
    title: "환경 (Environment)",
    icon: Camera,
    color: "from-emerald-500 to-emerald-700",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-300",
    tagColor: "bg-emerald-900/40 text-emerald-300",
    description: "배경, 날씨, 시간대, 공간적 맥락을 설정합니다.",
    tips: [
      "시간대: at dawn, during golden hour, midnight",
      "날씨: foggy, rainy, overcast sky",
      "장소: in a dense bamboo forest, on a rooftop in Tokyo",
    ],
    examples: ["in a misty forest at dawn", "bustling Shibuya crossing at night", "abandoned space station interior"],
    badExamples: ["outside", "somewhere nice", "in a room"],
  },
  {
    step: 4,
    title: "조명 · 색감 · 분위기 (Lighting / Mood)",
    icon: Sun,
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/40",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-300",
    tagColor: "bg-amber-900/40 text-amber-300",
    description: "감성을 보강하는 조명과 분위기 키워드입니다.",
    tips: [
      "조명: neon lighting, Rembrandt lighting, soft diffused light",
      "색감: muted tones, high contrast, pastel palette",
      "분위기: melancholic, ethereal, gritty cyberpunk",
    ],
    examples: ["neon-lit, moody atmosphere", "warm golden hour glow, nostalgic", "harsh shadow, high contrast, dramatic"],
    badExamples: ["bright", "dark", "colorful"],
  },
  {
    step: 5,
    title: "구도 (Composition)",
    icon: Layout,
    color: "from-rose-500 to-pink-600",
    borderColor: "border-rose-500/40",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-300",
    tagColor: "bg-rose-900/40 text-rose-300",
    description: "화면 구성과 카메라 위치를 지정합니다.",
    tips: [
      "샷 사이즈: extreme close-up, mid-shot, full body",
      "카메라 앵글: low angle, bird's-eye view, over-the-shoulder",
      "렌즈: 85mm portrait, 14mm wide-angle, tilt-shift",
    ],
    examples: ["close-up portrait, 85mm lens, shallow depth of field", "aerial drone shot, bird's-eye view", "Dutch angle, wide-angle distortion"],
    badExamples: ["zoomed in", "from far away"],
  },
  {
    step: 6,
    title: "파라미터 (Parameters)",
    icon: Settings,
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-500/40",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-300",
    tagColor: "bg-slate-800/60 text-slate-300",
    description: "미드저니 세부 제어값으로 결과물을 미세 조정합니다.",
    tips: [
      "--ar 16:9 (가로형), 9:16 (세로형), 1:1 (정사각형)",
      "--stylize 250 (기본) → 500+ (예술적) → 0 (리터럴)",
      "--chaos 0 (일관성) → 50+ (의외성) → 100 (랜덤)",
    ],
    examples: ["--ar 16:9 --v 6.1 --stylize 300", "--ar 9:16 --s 750 --chaos 30 --style raw", "--ar 1:1 --v 6.1 --no text, watermark"],
    badExamples: [],
  },
];

/* ─────────────── 명령어 사전 데이터 ─────────────── */
const commandsData = [
  {
    category: "핵심 명령어 (Core Commands)",
    items: [
      {
        name: "/imagine",
        nameKo: "이미지 생성",
        description: "텍스트 프롬프트를 입력하여 이미지를 생성하는 핵심 명령어입니다.",
        tooltip: "/imagine prompt: a cyberpunk cafe in Tokyo, neon lights, rain, 85mm --ar 16:9 --v 6.1",
      },
      {
        name: "/settings",
        nameKo: "설정",
        description: "모델 버전, 스타일 강도 등 기본 설정을 변경합니다.",
        tooltip: "설정 패널에서 Model Version, Stylize, Mode 등을 토글할 수 있습니다.",
      },
      {
        name: "/describe",
        nameKo: "이미지 역분석",
        description: "이미지를 업로드하면 AI가 프롬프트를 역추출합니다.",
        tooltip: "/describe [이미지 업로드] → 4가지 프롬프트 후보가 제시됩니다.",
      },
      {
        name: "/blend",
        nameKo: "이미지 합성",
        description: "2~5개의 이미지를 블렌딩하여 새로운 이미지를 생성합니다.",
        tooltip: "/blend [이미지1] [이미지2] → 두 이미지의 콘셉트가 융합된 결과물",
      },
    ],
  },
  {
    category: "필수 파라미터 (Parameters)",
    items: [
      {
        name: "--ar <ratio>",
        nameKo: "화면 비율",
        description: "출력 이미지의 가로:세로 비율을 제어합니다.",
        tooltip: "a mountain landscape --ar 16:9  |  a phone wallpaper --ar 9:16  |  a logo --ar 1:1",
      },
      {
        name: "--stylize <n>",
        nameKo: "예술적 강도",
        description: "미드저니 특유의 예술적 해석 강도를 조절합니다. (0~1000, 기본 100)",
        tooltip: "low (0~50): 프롬프트에 충실  |  medium (100~250): 균형  |  high (500+): 미드저니 자율 해석 극대화",
      },
      {
        name: "--chaos <n>",
        nameKo: "다양성 조절",
        description: "결과물의 의외성과 다양성을 조절합니다. (0~100)",
        tooltip: "0: 일관된 결과  |  30: 적당한 변형  |  100: 완전히 예측 불가한 랜덤 결과",
      },
      {
        name: "--no",
        nameKo: "부정 프롬프트",
        description: "원하지 않는 요소를 결과에서 제외합니다.",
        tooltip: "a forest landscape --no people, buildings, text  →  인물과 건물 없는 순수 자연 풍경",
      },
      {
        name: "--v <version>",
        nameKo: "모델 버전",
        description: "사용할 미드저니 모델 버전을 선택합니다.",
        tooltip: "--v 6.1 (최신, 텍스트 이해력 극대화)  |  --v 5.2 (이전 버전)  |  --niji 6 (애니메이션 특화)",
      },
      {
        name: "--style raw",
        nameKo: "로우 스타일",
        description: "미드저니의 자동 미화를 비활성화하고 프롬프트에 더 충실한 결과를 생성합니다.",
        tooltip: "a candid photo of a person --style raw  →  미화 없는 사실적 결과물",
      },
      {
        name: "--quality <n>",
        nameKo: "품질 레벨",
        description: "렌더링 품질을 조절합니다. (0.25, 0.5, 1)",
        tooltip: "--quality 0.25: 빠른 초안  |  --quality 0.5: 중간  |  --quality 1: 최고 품질 (기본)",
      },
    ],
  },
  {
    category: "인터랙션 기능 (Post-Generation)",
    items: [
      {
        name: "U (Upscale)",
        nameKo: "업스케일",
        description: "4장의 결과물 중 하나를 선택하여 고해상도로 확대합니다.",
        tooltip: "U1~U4: 각각 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래 이미지를 선택",
      },
      {
        name: "V (Variation)",
        nameKo: "변형 생성",
        description: "선택한 이미지와 유사한 스타일의 변형 4개를 생성합니다.",
        tooltip: "V1~V4: 원본 이미지를 기반으로 구도, 색감, 요소가 약간 변형된 결과물",
      },
      {
        name: "Vary Region",
        nameKo: "영역 수정",
        description: "이미지의 특정 영역을 선택하여 해당 부분만 재생성합니다.",
        tooltip: "업스케일된 이미지에서 Vary Region 클릭 → 영역 선택 → 수정 프롬프트 입력",
      },
      {
        name: "Zoom Out",
        nameKo: "배경 확장",
        description: "이미지 바깥 영역을 AI가 자동으로 생성하여 캔버스를 확장합니다.",
        tooltip: "1.5x 또는 2x 줌아웃 → 원본 유지한 채 외곽 배경이 생성됩니다",
      },
    ],
  },
];

/* ─────────────── 실전 팁 프리셋 데이터 ─────────────── */
const practicalTips = [
  {
    category: "🎯 핵심 원칙",
    tips: [
      {
        title: "긍정문 우선 원칙",
        description: "\"배경이 복잡하지 않은\" 대신 \"clean white background\"처럼 원하는 것을 직접 서술하세요.",
        good: "a portrait of a woman, clean white background, soft lighting",
        bad: "a portrait of a woman, background is not messy or cluttered",
      },
      {
        title: "구체적 명사 사용",
        description: "모호한 형용사 대신 구체적인 단어를 선택하면 결과물의 정확도가 올라갑니다.",
        good: "a gigantic medieval castle with moss-covered stone walls",
        bad: "a big old castle",
      },
      {
        title: "수량 명시 습관",
        description: "개수를 명시하면 미드저니가 의도에 더 정확하게 대응합니다.",
        good: "three red roses in a crystal vase",
        bad: "roses in a vase",
      },
    ],
  },
  {
    category: "📸 상황별 추천 프롬프트",
    presets: [
      {
        name: "광고 제품 컷",
        prompt: "product photography of [제품], studio lighting, softbox, clean white background, 85mm lens, hyper-detailed, commercial quality --ar 4:5 --stylize 200 --v 6.1",
      },
      {
        name: "시네마틱 인물 컷",
        prompt: "cinematic portrait of [인물 설명], Rembrandt lighting, shallow depth of field, 85mm f/1.4, film grain, moody atmosphere --ar 2:3 --stylize 400 --v 6.1",
      },
      {
        name: "건축 인테리어",
        prompt: "interior design photography of [공간 설명], natural daylight, minimalist Scandinavian style, wide-angle lens, editorial quality --ar 16:9 --stylize 250 --v 6.1",
      },
      {
        name: "푸드 포토그래피",
        prompt: "[음식 이름], overhead flat lay, rustic wooden table, natural light, steam rising, editorial food photography --ar 4:5 --stylize 300 --v 6.1",
      },
      {
        name: "SNS 세로형 배경",
        prompt: "[주제] aesthetic, dreamy pastel palette, soft bokeh, ethereal atmosphere, Instagram story style --ar 9:16 --stylize 500 --v 6.1",
      },
      {
        name: "로고 · 아이콘 디자인",
        prompt: "minimalist logo design for [브랜드명], clean vector style, flat design, single color, centered composition --ar 1:1 --stylize 50 --no text --v 6.1",
      },
    ],
  },
];

/* ─────────────── 컴포넌트 본문 ─────────────── */
export default function MidjourneyGuideClient() {
  const { toast } = useToast();
  const [expandedGlossary, setExpandedGlossary] = useState<string | null>(null);
  const [expandedFormula, setExpandedFormula] = useState<number | null>(0);

  const copyText = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      toast("프롬프트가 클립보드에 복사되었습니다!", "copy");
    },
    [toast]
  );

  return (
    <div className="space-y-24">
      {/* ───────── SECTION 1: 핵심 철학 ───────── */}
      <section>
        <div className="glass-card p-8 md:p-10 border-brand-yellow/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
              <Zap className="text-brand-yellow" size={28} />
              미드저니 핵심 철학
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  emoji: "🎯",
                  title: "키워드 압축형",
                  desc: "장문보다 핵심 명사를 나열하는 것이 효과적입니다. 미드저니는 짧고 선명한 지시를 선호합니다.",
                },
                {
                  emoji: "🔍",
                  title: "구체적 서술",
                  desc: "\"big\" 대신 \"huge, gigantic, towering\" 등 정확한 단어를 사용하고, 수량을 반드시 명시하세요.",
                },
                {
                  emoji: "✅",
                  title: "긍정문 작성",
                  desc: "\"~하지 않은\" 대신 원하는 것을 직접 서술하세요. 부정형보다 긍정형이 훨씬 정확합니다.",
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50"
                >
                  <span className="text-3xl mb-3 block">{p.emoji}</span>
                  <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── SECTION 2: 6단계 공식 ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <Layers className="text-brand-yellow" size={28} />
          미드저니 표준 공식 (6단계)
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          아래 6단계를 순서대로 조합하면 완성도 높은 프롬프트가 만들어집니다. 카드를 클릭해 상세 가이드를 확인하세요.
        </p>

        {/* Formula Flow Indicator */}
        <div className="hidden md:flex items-center justify-center gap-1 mb-10">
          {formulaSteps.map((s, i) => (
            <div key={s.step} className="flex items-center gap-1">
              <button
                onClick={() => setExpandedFormula(expandedFormula === i ? null : i)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  expandedFormula === i
                    ? `bg-gradient-to-r ${s.color} text-white shadow-lg scale-105`
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80"
                }`}
              >
                {s.step}. {s.title.split(" (")[0]}
              </button>
              {i < formulaSteps.length - 1 && <ArrowRight size={14} className="text-slate-600 mx-1" />}
            </div>
          ))}
        </div>

        {/* Formula Cards */}
        <div className="space-y-4">
          {formulaSteps.map((step, idx) => {
            const Icon = step.icon;
            const isOpen = expandedFormula === idx;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-card border ${isOpen ? step.borderColor : "border-slate-800"} overflow-hidden transition-all`}
              >
                <button
                  onClick={() => setExpandedFormula(isOpen ? null : idx)}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-md ${step.tagColor}`}>STEP {step.step}</span>
                      <h3 className="font-bold text-lg tracking-tight">{step.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{step.description}</p>
                  </div>
                  <ChevronDown size={20} className={`text-slate-500 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6 pt-2 border-t border-slate-800/50">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* 작성 팁 */}
                          <div>
                            <h4 className={`text-xs font-black uppercase tracking-widest mb-3 ${step.textColor}`}>작성 팁</h4>
                            <ul className="space-y-2">
                              {step.tips.map((tip, ti) => (
                                <li key={ti} className="text-sm text-slate-300 flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-gradient-to-r ${step.color}`} />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 예시 */}
                          <div>
                            <h4 className={`text-xs font-black uppercase tracking-widest mb-3 ${step.textColor}`}>Good 예시</h4>
                            <div className="space-y-2">
                              {step.examples.map((ex, ei) => (
                                <button
                                  key={ei}
                                  onClick={() => copyText(ex)}
                                  className="w-full text-left group flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2.5 rounded-xl transition-all border border-slate-700/30 hover:border-slate-600/50"
                                >
                                  <code className="text-xs text-emerald-400 font-mono flex-1">{ex}</code>
                                  <Copy size={13} className="text-slate-600 group-hover:text-brand-yellow transition-colors shrink-0" />
                                </button>
                              ))}
                            </div>
                            {step.badExamples.length > 0 && (
                              <>
                                <h4 className="text-xs font-black uppercase tracking-widest mb-3 mt-4 text-rose-400">Bad 예시</h4>
                                <div className="space-y-2">
                                  {step.badExamples.map((ex, ei) => (
                                    <div key={ei} className="bg-rose-950/20 px-4 py-2.5 rounded-xl border border-rose-800/20">
                                      <code className="text-xs text-rose-400/80 font-mono line-through">{ex}</code>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Assembled prompt example */}
        <div className="mt-8 glass-card p-6 border-brand-yellow/20">
          <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-brand-yellow">🧩 조합 완성 프롬프트 예시</h4>
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
            <code className="text-sm text-slate-200 font-mono leading-relaxed block">
              <span className="text-blue-400">a samurai warrior in golden armor</span>,{" "}
              <span className="text-purple-400">editorial photograph</span>,{" "}
              <span className="text-emerald-400">in a misty bamboo forest at dawn</span>,{" "}
              <span className="text-amber-400">dramatic Rembrandt lighting, moody atmosphere</span>,{" "}
              <span className="text-rose-400">low angle, 85mm lens, shallow depth of field</span>{" "}
              <span className="text-slate-400">--ar 2:3 --v 6.1 --stylize 400</span>
            </code>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formulaSteps.map((s) => (
              <span key={s.step} className={`text-[10px] font-bold px-2 py-1 rounded-md ${s.tagColor}`}>
                {s.step}. {s.title.split(" (")[0]}
              </span>
            ))}
          </div>
          <button
            onClick={() =>
              copyText(
                "a samurai warrior in golden armor, editorial photograph, in a misty bamboo forest at dawn, dramatic Rembrandt lighting, moody atmosphere, low angle, 85mm lens, shallow depth of field --ar 2:3 --v 6.1 --stylize 400"
              )
            }
            className="mt-4 bg-brand-yellow hover:bg-yellow-400 text-black px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-yellow/20"
          >
            전체 프롬프트 복사
          </button>
        </div>
      </section>

      {/* ───────── SECTION 3: 용어 사전 (아코디언) ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <Terminal className="text-brand-yellow" size={28} />
          용어 사전 (Glossary)
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          각 항목을 클릭하면 예시 프롬프트가 표시됩니다. 형식: <span className="text-brand-yellow">[한국어 명칭 (영어 원어)]</span>
        </p>

        <div className="space-y-8">
          {commandsData.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-brand-yellow" />
                {cat.category}
              </h3>
              <div className="space-y-2">
                {cat.items.map((item) => {
                  const isExpanded = expandedGlossary === item.name;
                  return (
                    <div key={item.name} className="glass-card border-slate-800 overflow-hidden">
                      <button
                        onClick={() => setExpandedGlossary(isExpanded ? null : item.name)}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
                      >
                        <code className="text-brand-yellow font-mono font-bold text-sm shrink-0">{item.name}</code>
                        <span className="text-slate-500 text-xs">—</span>
                        <span className="text-slate-400 text-sm font-medium">{item.nameKo} ({item.name.replace(/^\/|^--/, "")})</span>
                        <span className="flex-1" />
                        <ChevronDown
                          size={16}
                          className={`text-slate-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 pt-1 border-t border-slate-800/50">
                              <p className="text-sm text-slate-300 mb-3">{item.description}</p>
                              <div className="bg-slate-900/80 rounded-xl px-4 py-3 border border-slate-800 flex items-start gap-3">
                                <Sparkles size={14} className="text-brand-yellow mt-0.5 shrink-0" />
                                <code className="text-xs text-slate-300 font-mono leading-relaxed flex-1">{item.tooltip}</code>
                                <button onClick={() => copyText(item.tooltip)} className="shrink-0 text-slate-600 hover:text-brand-yellow transition-colors">
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── SECTION 4: 실전 팁 & 상황별 프리셋 ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <SlidersHorizontal className="text-brand-yellow" size={28} />
          실전 팁 & 상황별 프리셋
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          실무에서 바로 활용할 수 있는 프롬프트 작성 원칙과 상황별 추천 프리셋 템플릿입니다.
        </p>

        {/* 핵심 원칙 */}
        {practicalTips
          .filter((p) => "tips" in p)
          .map((section) => (
            <div key={section.category} className="mb-12">
              <h3 className="text-lg font-bold mb-6">{section.category}</h3>
              <div className="grid md:grid-cols-3 gap-5">
                {"tips" in section &&
                  section.tips!.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="glass-card p-6 border-slate-800 space-y-4"
                    >
                      <h4 className="font-bold text-base">{tip.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{tip.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs font-bold mt-0.5 shrink-0">GOOD</span>
                          <button
                            onClick={() => copyText(tip.good)}
                            className="text-left group flex-1 bg-emerald-950/20 hover:bg-emerald-950/30 px-3 py-2 rounded-lg border border-emerald-800/20 transition-all"
                          >
                            <code className="text-xs text-emerald-400/90 font-mono">{tip.good}</code>
                          </button>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-rose-400 text-xs font-bold mt-0.5 shrink-0">BAD</span>
                          <div className="bg-rose-950/15 px-3 py-2 rounded-lg border border-rose-800/15 flex-1">
                            <code className="text-xs text-rose-400/70 font-mono line-through">{tip.bad}</code>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}

        {/* 상황별 프리셋 */}
        {practicalTips
          .filter((p) => "presets" in p)
          .map((section) => (
            <div key={section.category}>
              <h3 className="text-lg font-bold mb-6">{section.category}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {"presets" in section &&
                  section.presets!.map((preset, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="glass-card p-5 border-slate-800 group hover:border-brand-yellow/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-sm flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-yellow" />
                          {preset.name}
                        </h4>
                        <button
                          onClick={() => copyText(preset.prompt)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20 transition-colors flex items-center gap-1.5"
                        >
                          <Copy size={12} />
                          복사
                        </button>
                      </div>
                      <code className="text-xs text-slate-400 font-mono leading-relaxed block break-all">{preset.prompt}</code>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}
