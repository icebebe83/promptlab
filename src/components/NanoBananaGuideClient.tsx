"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Zap,
  Sparkles,
  Sun,
  Layout,
  Settings,
  Layers,
  ArrowRight,
  ImageIcon,
  PencilRuler,
  Paintbrush,
  BoxSelect,
  Hammer
} from "lucide-react";
import { useToast } from "./Toast";

/* ─────────────── 7단계 공식 데이터 ─────────────── */
const generateSteps = [
  {
    step: 1,
    title: "주제 (Subject)",
    icon: Sparkles,
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-300",
    tagColor: "bg-blue-900/40 text-blue-300",
    description: "피사체의 종류, 수량, 특징을 명시합니다.",
    tips: [
      "피사체를 정확한 명사로 지정하세요.",
      "수량을 명시하면 더 정확한 결과물을 얻습니다.",
      "의상, 재질, 주요 특징을 포함하세요."
    ],
    examples: ["a modern velvet corner sofa", "three glowing crystal spheres", "a cyberpunk female hacker with red hair"],
    badExamples: ["a nice sofa", "some spheres", "a cool girl"]
  },
  {
    step: 2,
    title: "동작과 관계 (Action & Rel)",
    icon: Hammer,
    color: "from-purple-500 to-purple-700",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-300",
    tagColor: "bg-purple-900/40 text-purple-300",
    description: "피사체가 무엇을 하는지, 주변 요소와의 관계를 설정합니다.",
    tips: [
      "피사체의 동적인 자세나 동작을 서술하세요.",
      "주변 사물과 어떻게 상호작용하는지 적으세요."
    ],
    examples: ["sitting cross-legged on a floating chair", "typing rapidly on a holographic keyboard", "leaning against a concrete wall"],
    badExamples: ["doing something", "standing"]
  },
  {
    step: 3,
    title: "배경 (Background)",
    icon: ImageIcon,
    color: "from-emerald-500 to-emerald-700",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-300",
    tagColor: "bg-emerald-900/40 text-emerald-300",
    description: "장소, 시간, 날씨 등 환경 조건을 명확히 합니다.",
    tips: [
      "공간적/시간적 맥락을 제공하세요.",
      "날씨와 분위기를 묘사하여 몰입감을 더하세요."
    ],
    examples: ["inside a futuristic Tokyo subway car at midnight", "a high-end art museum with marble floors", "misty autumn forest during heavy rain"],
    badExamples: ["in a room", "outside"]
  },
  {
    step: 4,
    title: "스타일과 매체 (Style & Medium)",
    icon: Paintbrush,
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/40",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-300",
    tagColor: "bg-amber-900/40 text-amber-300",
    description: "사진, 3D, 일러스트 등 렌더링 스타일을 정의합니다.",
    tips: [
      "매체(medium)를 정확히 명시하세요.",
      "선명도, 렌더링 언진, 화풍 등을 구체적으로 나열하세요."
    ],
    examples: ["hyper-realistic architectural photography", "3D render in Unreal Engine 5", "water color illustration, studio ghibli style"],
    badExamples: ["pretty picture", "good drawing"]
  },
  {
    step: 5,
    title: "구도와 카메라 (Composition)",
    icon: Layout,
    color: "from-rose-500 to-pink-600",
    borderColor: "border-rose-500/40",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-300",
    tagColor: "bg-rose-900/40 text-rose-300",
    description: "앵글, 렌즈 화각, 피사계 심도를 지정합니다.",
    tips: [
      "카메라 앵글(low angle, top-down)을 지정하세요.",
      "특정 렌즈 스펙(85mm, 14mm)을 추가하면 사실감이 올라갑니다."
    ],
    examples: ["wide-angle lens, bird's eye view", "85mm portrait lens, shallow depth of field", "Dutch angle, dynamic composition"],
    badExamples: ["make it big", "zoomed"]
  },
  {
    step: 6,
    title: "조명과 색상 (Lighting & Color)",
    icon: Sun,
    color: "from-yellow-400 to-yellow-600",
    borderColor: "border-yellow-500/40",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-300",
    tagColor: "bg-yellow-900/40 text-yellow-300",
    description: "광원의 위치와 톤앤매너 등 색상을 설정합니다.",
    tips: [
      "광원의 종류(softbox, neon, natural sunlight)를 명시하세요.",
      "무드와 톤(warm tone, cynical, muted colors)을 결정하세요."
    ],
    examples: ["neon pink and cyan lighting, high contrast", "soft studio lighting, Rembrandt lighting", "golden hour sunlight, warm pastel tones"],
    badExamples: ["bright lights", "darkness"]
  },
  {
    step: 7,
    title: "디테일과 제약 (Details & Negative)",
    icon: Settings,
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-500/40",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-300",
    tagColor: "bg-slate-800/60 text-slate-300",
    description: "질감 및 제외할 요소(Negative Prompt)를 명시합니다.",
    tips: [
      "재질감(matte, glossy, rough texture)을 추가하세요.",
      "화면에서 배제하고 싶은 요소를 --no 와 함께 묶거나 명시하세요."
    ],
    examples: ["intricate leather texture, 8k resolution", "highly detailed, vivid clarity", "no text, no watermarks, no people"],
    badExamples: ["detailed", "no bad stuff"]
  }
];

/* ─────────────── 4단계 편집 데이터 ─────────────── */
const editSteps = [
  {
    step: 1,
    title: "유지 (Maintain)",
    description: "건드리지 않고 원본 그대로 보존해야 할 핵심 요소를 정의합니다.",
    highlight: "얼굴, 포즈, 나이 등 아이덴티티 요소",
    example: "keep the character's face, expression, and current body posture exactly the same"
  },
  {
    step: 2,
    title: "변경 (Change)",
    description: "수정하거나 새롭게 교체해야 할 타겟 영역을 명시합니다.",
    highlight: "배경화면, 의상의 재질, 소품",
    example: "change the background to a modern art museum wall"
  },
  {
    step: 3,
    title: "방법 (Method)",
    description: "바꾸고자 하는 요소에 어떤 구체적인 기술이나 분위기를 적용할 것인지 서술합니다.",
    highlight: "색상 톤(B&W), 조명 추가, 화풍 변경",
    example: "fill the wall with framed abstract paintings and warm gallery spot lighting"
  },
  {
    step: 4,
    title: "제약 조건 (Constraints)",
    description: "편집 과정에서 절대 변형되거나 침범해서는 안 될 부분을 경고합니다.",
    highlight: "비율 유지, 추가 인물 등장 금지",
    example: "do not alter the lighting on the subject's face, do not add other people"
  }
];

/* ─────────────── 메뉴 기능 데이터 ─────────────── */
const menuData = [
  {
    name: "Generate",
    nameKo: "신규 생성",
    icon: Sparkles,
    description: "상세 브리핑 기반의 신규 이미지 생성 메뉴.",
    features: ["7단계 구조화 공식을 가장 잘 활용할 수 있는 메인 대시보드", "프롬프트를 구체적 지시서로 치환하여 한 번에 원하는 결과를 타겟팅"]
  },
  {
    name: "Edit (Canvas)",
    nameKo: "정밀 편집",
    icon: BoxSelect,
    description: "특정 영역을 수정하거나 배경을 확장하는 정밀 편집 메뉴.",
    features: ["Inpainting(부분 영역 재작업) 기능 내장", "Outpainting으로 기존 이미지를 훼손하지 않고 화면을 넓히는 확장성", "4단계 보존 공식이 필수적으로 적용되는 메뉴"]
  },
  {
    name: "Batch",
    nameKo: "일괄 생성",
    icon: Layers,
    description: "일관된 스타일로 여러 장의 에셋을 동시 생성하는 기능.",
    features: ["브랜드 가이드라인이나 특정 캠페인 무드를 대량으로 찍어낼 때 유리", "동일한 시드(Seed) 및 스타일 값을 연속 적용하여 무드보드 최적화"]
  }
];

export default function NanoBananaGuideClient() {
  const { toast } = useToast();
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
              <Zap className="text-brand-yellow" size={28} />
              나노바나나 핵심 철학
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  emoji: "🏗️",
                  title: "프롬프트 = 구조화된 지시서",
                  desc: "나노바나나에서는 프롬프트를 창작용 서술이 아닌 명확한 '개발 지시서'로 취급합니다. 앞부분의 내용일수록 결과에 강력한 영향을 미칩니다.",
                },
                {
                  emoji: "🧐",
                  title: "추상적 표현의 배제",
                  desc: "\"더 예쁘게\", \"분위기 있게\" 같은 주관적 단어를 피하세요. 대신 사용할 조명 장비, 렌즈 초점거리, 구체적 재질 등 전문적이고 시각적 특성으로 묘사해야 합니다.",
                },
                {
                  emoji: "🛡️",
                  title: "정체성 보존 전략",
                  desc: "인물의 얼굴, 주요 제품 디자인 등 훼손되면 안 되는 아이덴티티는 편집 시 '유지' 명령어로 가장 먼저 명시하여 구조를 고정해야 합니다.",
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

      {/* ───────── SECTION 2: [생성용] 7단계 공식 ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <Layers className="text-purple-400" size={28} />
          [생성용] 7단계 구조화 공식
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          아래 순서를 따라 나노바나나 엔진에 전달할 완벽한 스펙 문서를 작성하세요. 앞쪽 단계가 가중치를 더 많이 받습니다.
        </p>

        {/* Formula Flow Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-1 mb-10">
          {generateSteps.map((s, i) => (
            <div key={s.step} className="flex items-center gap-1 mb-2">
              <button
                onClick={() => setExpandedFormula(expandedFormula === i ? null : i)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-bold transition-all ${
                  expandedFormula === i
                    ? `bg-gradient-to-r ${s.color} text-white shadow-lg scale-105`
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80"
                }`}
              >
                {s.step}. {s.title.split(" (")[0]}
              </button>
              {i < generateSteps.length - 1 && <ArrowRight size={14} className="text-slate-600 mx-0.5" />}
            </div>
          ))}
        </div>

        {/* Formula Cards (Accordion) */}
        <div className="space-y-4">
          {generateSteps.map((step, idx) => {
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
      </section>

      {/* ───────── SECTION 3: [편집용] 4단계 보존 공식 ───────── */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <PencilRuler className="text-emerald-400" size={28} />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            [편집용] 4단계 보존 공식
          </h2>
        </div>
        <p className="text-slate-400 mb-8 text-sm">
          나노바나나의 가장 강력한 기능인 &apos;정체성 보존&apos;을 위해 Inpainting/Edit 캔버스에서 사용하는 보호 및 변경 공식입니다.
        </p>

        <div className="grid md:grid-cols-4 gap-4">
          {editSteps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card flex flex-col justify-between p-6 border-slate-800 hover:border-emerald-500/30 transition-all h-full"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs shrink-0">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-lg">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">{step.description}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 mb-1">고려 요소:</div>
                <div className="text-xs font-medium text-emerald-300 mb-3">{step.highlight}</div>
                <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800">
                  <code className="text-[10px] text-slate-300 font-mono block break-all">&quot;{step.example}&quot;</code>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── SECTION 4: 필수 메뉴 구성 ───────── */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Settings className="text-slate-300" size={28} />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            필수 작동 환경
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {menuData.map((menu) => {
            const Icon = menu.icon;
            return (
              <div key={menu.name} className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                    <Icon size={20} className="text-slate-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{menu.name}</h3>
                    <p className="text-xs font-bold text-slate-400">{menu.nameKo}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4">{menu.description}</p>
                <ul className="space-y-2">
                  {menu.features.map((feature, fi) => (
                    <li key={fi} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-brand-yellow font-bold shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* ───────── SECTION 5: 실전 팁 & 예시 프리셋 ───────── */}
      <section>
        <div className="glass-card p-8 md:p-10 border-brand-yellow/30">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-black tracking-tight mb-4 flex items-center gap-3">
                <span className="text-brand-yellow">💡</span> 실무 제어 전략
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                한 번의 프롬프트나 한 번의 편집에 너무 많은 지시를 담지 마세요.
                우선 가장 원하는 피사체와 구도를 뽑아낸 뒤, <strong>Edit (Canvas) 메뉴</strong>로 넘어가서 주변 요소를 하나씩 
                &apos;Inpainting&apos;하며 확장하는 것이 나노바나나 엔진을 속이는 가장 완벽한 방법입니다.
              </p>
              
              <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-700 mb-6">
                <h3 className="text-sm font-bold text-white mb-3">예제 1: 제품 컷 브리핑 (Generate)</h3>
                <div className="relative group">
                  <code className="text-xs text-blue-300 font-mono leading-relaxed block pr-12">
                    subject: a modern velvet corner sofa, dark green<br/>
                    action: positioned centrally<br/>
                    background: a minimalist living room, huge windows, concrete floor<br/>
                    style: interior photography, hyper-realistic, 8k<br/>
                    composition: wide-angle view, eye-level<br/>
                    lighting: soft natural lighting through window, cinematic<br/>
                    details: detailed fabric texture, no other furniture, no people
                  </code>
                  <button
                    onClick={() => copyText("subject: a modern velvet corner sofa, dark green\naction: positioned centrally\nbackground: a minimalist living room, huge windows, concrete floor\nstyle: interior photography, hyper-realistic, 8k\ncomposition: wide-angle view, eye-level\nlighting: soft natural lighting through window, cinematic\ndetails: detailed fabric texture, no other furniture, no people")}
                    className="absolute top-2 right-2 text-slate-500 hover:text-brand-yellow transition-colors"
                    title="프롬프트 구조 복사"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-3">예제 2: 배경 치환 편집 (Edit)</h3>
                <div className="relative group">
                  <code className="text-xs text-emerald-300 font-mono leading-relaxed block pr-12">
                    maintain: keep the sofa and its lighting completely intact<br/>
                    change: change the background living room into an art museum<br/>
                    method: add marble tiles, a blank white wall with spotlighting<br/>
                    constraints: do not change the sofa material or color, do not add shadows on the sofa
                  </code>
                  <button
                    onClick={() => copyText("maintain: keep the sofa and its lighting completely intact\nchange: change the background living room into an art museum\nmethod: add marble tiles, a blank white wall with spotlighting\nconstraints: do not change the sofa material or color, do not add shadows on the sofa")}
                    className="absolute top-2 right-2 text-slate-500 hover:text-brand-yellow transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 bg-slate-800/40 rounded-2xl p-6 border border-slate-700 shrink-0">
              <h3 className="font-bold text-white mb-4">나노바나나 치트 시트</h3>
              <ul className="space-y-4">
                <li>
                  <div className="text-xs font-bold text-slate-500 mb-1">절대 피해야 할 단어</div>
                  <div className="text-sm text-rose-400 font-medium break-keep">beautiful, nice, awesome, amazing, high quality</div>
                </li>
                <li>
                  <div className="text-xs font-bold text-slate-500 mb-1">반드시 넣어야 할 요소</div>
                  <div className="text-sm text-emerald-400 font-medium break-keep">질감(Texture), 초점(Focus), 광원 방향(Light direction)</div>
                </li>
                <li>
                  <div className="text-xs font-bold text-slate-500 mb-1">편집 마술봉 팁</div>
                  <div className="text-sm text-slate-300 font-medium break-keep">선택 영역 외곽을 약간 뭉개듯(feather) 지정하면 AI가 주변부 환경을 훨씬 부드럽게 병합합니다.</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
