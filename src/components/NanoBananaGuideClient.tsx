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
    description: "피사체의 종류, 수량, 특징을 상업 광고 수준으로 명시합니다. (NB Pro 극사실주의 반영)",
    tips: [
      "피사체를 정확한 명사로 지정하세요.",
      "광고용 메인 제품과 서브 오브젝트를 명확히 분리하세요.",
      "제품의 재질감(반사율, 투명도, 표면 질감)을 매우 구체적으로 묘사하세요."
    ],
    examples: ["a luxurious matte black perfume bottle with gold metallic caps", "crystal clear luxury skin care serum droplet with micro-bubbles", "hyper-detailed sleek white sports car with carbon fiber accents"],
    badExamples: ["a nice perfume", "some drops", "a cool car"]
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
    description: "제품이 어떻게 디스플레이되는지, 어떤 상호작용 및 시각적 장치와 결합되는지 설정합니다.",
    tips: [
      "제품이 공중에 떠있는지(levitating), 튀어오르는지(splashing) 등 역동적 상태를 묘사하세요.",
      "물, 빛, 연기 등 주변 효과와의 상호작용을 적으세요."
    ],
    examples: ["splash of clear water curving elegantly around the perfume bottle", "levitating slightly above a polished obsidian stone pedestal", "shattering into glowing gold particles"],
    badExamples: ["doing something", "standing on a table"]
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
    description: "제품을 돋보이게 하는 장소, 무드, 질감을 가진 배경을 설정합니다.",
    tips: [
      "주 피사체와 대비되는 색상이나 질감의 배경을 선택하세요.",
      "단순한 스튜디오 배경이 아니라 고급스러운 텍스처(리넨, 대리석, 금속)를 환경으로 묘사하세요."
    ],
    examples: ["minimalist podium set against a seamless backdrop of smooth brushed stainless steel", "abstract background features geometric forms with frosted glass finish", "premium dark moody setting with dark marble surfaces"],
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
    description: "최고 수준의 상업 렌더링 스타일 및 사진 촬영 기법을 정의합니다.",
    tips: [
      "하이엔드 3D 렌더링(Octane Render, Unreal Engine 5)인지 상업 사진(Product Photography)인지 명시하세요.",
      "마크로 촬영인지, 하이테크 스타일인지 구체적인 화풍을 나열하세요."
    ],
    examples: ["commercial product photography, hyper-realistic, 8k resolution, crisp details", "high-end 3D render in Octane Render, luxurious aesthetic", "macrophotography, extreme close up, editorial style"],
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
    description: "제품의 볼륨감과 시선을 압도하는 앵글, 화각을 지정합니다.",
    tips: [
      "제품의 웅장함을 살리는 앵글(low angle, dramatic perspective)을 지정하세요.",
      "초광각 렌즈나 마크로 렌즈 등 특정 렌즈 스펙(100mm macro, 24mm)을 추가하세요."
    ],
    examples: ["100mm macro lens focus, shallow depth of field, centered heroic composition", "dynamic dramatic angle, low camera placement emphasizing height", "symmetrical and perfectly balanced framing, sharp foreground"],
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
    description: "극적인 광고 연출을 위한 광원 위치 및 고급스러운 톤앤매너를 설정합니다.",
    tips: [
      "반사 재질을 돋보이게 하는 조명(rim light, hard spot light, cinematic studio lighting)을 활용하세요.",
      "투톤 라이팅 등 대비를 극대화하는 색상 배열(cyan & orange, monochromatic premium styling)을 지시하세요."
    ],
    examples: ["cinematic rim lighting highlighting the edge of the bottle, soft global illumination", "harsh dramatic shadows, monochromatic dark theme with a hint of gold reflections", "volumetric light rays piercing from the top right, clear icy blue tones"],
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
    description: "최종 퀄리티를 폭발시키는 미세 질감 및 결함 제거를 명시합니다.",
    tips: [
      "극저노이즈, 선명도 극대화(vivid clarity, insanely detailed surface)를 추가하세요.",
      "화면에서 배제할 텍스트, 사람, 지저분한 요소를 철저히 차단하세요."
    ],
    examples: ["insanely detailed micro-surface reflections, perfect condensation drops on glass", "flawless metallic finish, UHD, masterpiece", "no text, no blurry edges, no noise, no amateur artifacts"],
    badExamples: ["detailed", "no bad stuff"]
  }
];

/* ─────────────── 4단계 편집 데이터 ─────────────── */
const editSteps = [
  {
    step: 1,
    title: "유지 (Maintain)",
    description: "건드리지 않고 원본 그대로 보존해야 할 핵심 광고 환경(배경, 배치 구조 요소)을 정의합니다. (NB2 Case 37 참조)",
    highlight: "배치된 배경 환경, 조명 세팅, 카메라 앵글, 그림자 방향",
    example: "keep the premium studio environment, the dynamic lighting, and the overall composition exactly the same"
  },
  {
    step: 2,
    title: "변경 (Change)",
    description: "수정하거나 새롭게 교체해야 할 메인 제품 타겟 영역을 명시합니다. (광고 제품 교체 로직)",
    highlight: "기존 오브젝트 → 신규 브랜드 제품",
    example: "change the central object to a sleek metallic smartphone (new product)"
  },
  {
    step: 3,
    title: "방법 (Method)",
    description: "제품이 어떻게 환경에 녹아들고 대체되는지 질감과 빛반사를 중심으로 서술합니다.",
    highlight: "사실적인 질감 적용(반사, 투명도), 환경 조명의 영향 매핑",
    example: "integrate the newly swapped smartphone with matching reflections from the studio rim light, ensuring extremely realistic glossy finish"
  },
  {
    step: 4,
    title: "제약 조건 (Constraints)",
    description: "광고 몰입도를 방해하는 시각적 오류가 발생하지 않도록 강제합니다.",
    highlight: "추가 제품 등장 금지, 조명 모순 방지",
    example: "do not alter the original background lighting, do not add multiple products, ensure shadows perfectly align"
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
                <h3 className="text-sm font-bold text-white mb-3">예제 1: 제품 컷 브리핑 (Generate / NB Pro Style)</h3>
                <div className="relative group">
                  <code className="text-xs text-blue-300 font-mono leading-relaxed block pr-12">
                    subject: a luxurious matte black perfume bottle with gold metallic caps<br/>
                    action: resting perfectly on a polished obsidian pedestal<br/>
                    background: premium dark moody setting with dark marble surfaces<br/>
                    style: commercial product photography, hyper-realistic, 8k resolution, crisp details<br/>
                    composition: 100mm macro lens focus, centered heroic composition<br/>
                    lighting: cinematic rim lighting highlighting the edge, harsh spotlight reflecting off gold<br/>
                    details: insanely detailed micro-surface reflections, flawless finish, no noise
                  </code>
                  <button
                    onClick={() => copyText("subject: a luxurious matte black perfume bottle with gold metallic caps\naction: resting perfectly on a polished obsidian pedestal\nbackground: premium dark moody setting with dark marble surfaces\nstyle: commercial product photography, hyper-realistic, 8k resolution, crisp details\ncomposition: 100mm macro lens focus, centered heroic composition\nlighting: cinematic rim lighting highlighting the edge, harsh spotlight reflecting off gold\ndetails: insanely detailed micro-surface reflections, flawless finish, no noise")}
                    className="absolute top-2 right-2 text-slate-500 hover:text-brand-yellow transition-colors"
                    title="프롬프트 구조 복사"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-3">예제 2: 광고 제품 교체 편집 (Edit / NB2 Case 37)</h3>
                <div className="relative group">
                  <code className="text-xs text-emerald-300 font-mono leading-relaxed block pr-12">
                    maintain: keep the premium studio environment, the dynamic background lighting, and the overall composition exactly the same<br/>
                    change: change the central perfume bottle into a sleek metallic smartphone<br/>
                    method: integrate the smartphone with matching reflections from the rim light, ensuring extremely realistic glossy screen finish<br/>
                    constraints: do not alter the existing shadows, do not add multiple products, ensure pristine integration
                  </code>
                  <button
                    onClick={() => copyText("maintain: keep the premium studio environment, the dynamic background lighting, and the overall composition exactly the same\nchange: change the central perfume bottle into a sleek metallic smartphone\nmethod: integrate the smartphone with matching reflections from the rim light, ensuring extremely realistic glossy screen finish\nconstraints: do not alter the existing shadows, do not add multiple products, ensure pristine integration")}
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
