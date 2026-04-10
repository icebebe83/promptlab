"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Download, Upload, Copy } from "lucide-react";
import { useToast } from "./Toast";

const mjOrder: Record<string, number> = {
  person: 1,      // 주제 (인물/대상)
  design: 2,      // 환경/배경
  art3d: 3,       // 매체
  lighting: 4,    // 조명
  technical: 5,   // 구도/카메라
};

const nbOrder: Record<string, number> = {
  person: 1,      // 주제
  action: 2,      // 동작/상태
  design: 3,      // 배경
  art3d: 4,       // 스타일/매체
  technical: 5,   // 구도/카메라
  lighting: 6,    // 조명
  details: 7,     // 세부 묘사
};

const categoryTranslation: Record<string, Record<string, string>> = {
  photography: {
    person: "인물 / 피사체",
    action: "동작 / 상태",
    art3d: "촬영 매체",
    design: "배경 / 환경",
    technical: "카메라 제어",
    lighting: "조명",
    details: "세부 묘사",
  },
  graphic: {
    person: "디자인 주제",
    action: "상태 / 배열",
    art3d: "그래픽 스타일",
    design: "레이아웃 / 배경",
    technical: "구도 / 원근",
    lighting: "조명 / 질감",
    details: "디자인 정밀도",
  },
};

export type TagItem = {
  id: string;
  content: string;
  category: string;
  translationKo?: string;
};

// Colors based on category to organize visually
const categoryColors: Record<string, string> = {
  person: "bg-blue-900/40 text-blue-300 border-blue-500/50",
  action: "bg-teal-900/40 text-teal-300 border-teal-500/50",
  art3d: "bg-purple-900/40 text-purple-300 border-purple-500/50",
  design: "bg-emerald-900/40 text-emerald-300 border-emerald-500/50",
  technical: "bg-brand-yellow/20 text-brand-yellow border-brand-yellow/50",
  lighting: "bg-orange-900/40 text-orange-300 border-orange-500/50",
  details: "bg-rose-900/40 text-rose-300 border-rose-500/50",
};

// Step labels for visual output
const mjStepLabels: Record<number, string> = {
  1: "Subject",
  2: "Medium",
  3: "Environment",
  4: "Lighting/Color",
  5: "Composition",
  6: "Parameters",
};

const nbStepLabels: Record<number, string> = {
  1: "Subject",
  2: "Action",
  3: "Background",
  4: "Style",
  5: "Composition",
  6: "Lighting",
  7: "Details",
};

type PromptStep = {
  step: number;
  label: string;
  content: string;
  isEmpty?: boolean;
};

export default function TagBuilderClient({
  photographyTags,
  graphicTags,
}: {
  photographyTags: Record<string, TagItem[]>;
  graphicTags: Record<string, TagItem[]>;
}) {
  // Tags the user has currently placed on the canvas
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [customText, setCustomText] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [complexity, setComplexity] = useState(2);
  const [labMode, setLabMode] = useState<'photography' | 'graphic'>('photography');
  const [optimizationMode, setOptimizationMode] = useState<'mj' | 'nb'>('mj');
  const [activeCategoryFocus, setActiveCategoryFocus] = useState<string | null>(null);
  const [koreanInterpretation, setKoreanInterpretation] = useState<string>("");
  const { toast } = useToast();

  // DND Configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Select the correct tag set based on mode
  const currentTags = labMode === 'photography' ? photographyTags : graphicTags;

  const handleModeSwitch = (mode: 'photography' | 'graphic') => {
    setLabMode(mode);
    // Clear selected tags since the tag set is changing
    setSelectedTags([]);
    setActiveCategoryFocus(null);
    setKoreanInterpretation("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedTags((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddTag = (tag: TagItem) => {
    // Prevent strictly identical duplicate tags, but allow others
    if (selectedTags.find((t) => t.id === tag.id)) return;
    setSelectedTags((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (id: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOptimize = (mode: 'mj' | 'nb') => {
    setOptimizationMode(mode);
    const order = mode === 'mj' ? mjOrder : nbOrder;
    setSelectedTags((prev) => 
      [...prev].sort((a, b) => (order[a.category] || 99) - (order[b.category] || 99))
    );
    toast(`${mode === 'mj' ? '미드저니용' : '나노바나나용'} 서사 설계가 완료되었습니다.`, "success");
  };

  const handleExport = () => {
    const yaml = `---
version: 2.0
optimizationMode: ${optimizationMode}
labMode: ${labMode}
complexity: ${complexity}
customText: "${customText}"
tags:
${selectedTags.map(t => `  - id: "${t.id}"\n    content: "${t.content}"\n    category: "${t.category}"\n    translationKo: "${t.translationKo || ""}"`).join('\n')}
---
`;
    const steps = generatePromptSteps();
    const plainText = steps.map(s => s.content).join(", ");
    const markdown = `${yaml}\n# 프롬프트 설계\n\n${plainText}\n`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_design_${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("MD 내보내기가 완료되었습니다.", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const complexityMatch = text.match(/complexity:\s*(\d)/);
        const modeMatch = text.match(/optimizationMode:\s*(mj|nb)/);
        const labModeMatch = text.match(/labMode:\s*(photography|graphic)/);
        const textMatch = text.match(/customText:\s*"(.*?)"/);
        
        if (complexityMatch) setComplexity(Number(complexityMatch[1]));
        if (modeMatch) setOptimizationMode(modeMatch[1] as 'mj'|'nb');
        if (labModeMatch) setLabMode(labModeMatch[1] as 'photography'|'graphic');
        if (textMatch) setCustomText(textMatch[1]);

        const tagMatches = text.match(/  - id: "(.*?)"\n    content: "(.*?)"\n    category: "(.*?)"/g);
        if (tagMatches) {
           const parsedTags = tagMatches.map(line => {
             const idMatch = line.match(/id: "(.*?)"/);
             const contentMatch = line.match(/content: "(.*?)"/);
             const catMatch = line.match(/category: "(.*?)"/);
             return {
               id: idMatch ? idMatch[1] : Math.random().toString(),
               content: contentMatch ? contentMatch[1] : "",
               category: catMatch ? catMatch[1] : "person"
             };
           });
           setSelectedTags(parsedTags);
        }
        toast("MD 파일에서 설정이 복원되었습니다.", "success");
      } catch (err) {
        toast("파일을 읽는 중 오류가 발생했습니다.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleBuildPrompt = async () => {
    try {
      setIsBuilding(true);
      
      const allCategories = ['person', 'action', 'art3d', 'design', 'technical', 'lighting', 'details'];
      const existingCategories = [...new Set(selectedTags.map(t => t.category))];
      
      let categoriesToFill = allCategories;
      // If Midjourney mode, typically action and details are less focused, but we still generate them for a robust prompt 
      // or we can strictly filter them. Let's strictly filter for MJ to save tokens.
      if (optimizationMode === 'mj') {
        categoriesToFill = ['person', 'art3d', 'design', 'technical', 'lighting'];
      }
      
      const missingCategories = categoriesToFill.filter(c => !existingCategories.includes(c));
      
      if (missingCategories.length === 0) {
        toast("이미 모든 설계 요소가 구성되어 있습니다.", "success");
        setIsBuilding(false);
        return;
      }

      const response = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customText,
          existingTags: selectedTags,
          missingCategories,
          labMode,
          optimizationMode,
          complexity
        })
      });

      if (!response.ok) throw new Error("서버 오류");
      
      const data = await response.json();
      if (data.suggestedTags && data.suggestedTags.length > 0) {
        setSelectedTags(prev => [...prev, ...data.suggestedTags]);
        toast("AI가 프롬프트를 전문적으로 완성했습니다!", "success");
      } else {
        toast("추천할 태그 내용이 없습니다.", "error");
      }
    } catch (err) {
      toast("프롬프트 빌드 중 오류가 발생했습니다.", "error");
    } finally {
      setIsBuilding(false);
    }
  };

  const generatePromptSteps = (): PromptStep[] => {
    if (selectedTags.length === 0 && !customText) {
      return [{ step: 0, label: "안내", content: "설계할 주제를 입력하거나 태그를 선택해 주세요..." }];
    }

    const isGraphic = labMode === 'graphic';
    const coreSubject = customText || "the subject of interest";

    // Midjourney Mode: Standard 6-Step Flow
    if (optimizationMode === 'mj') {
      const medium = selectedTags.filter(t => t.category === 'art3d').map(t => t.content);
      const environment = selectedTags.filter(t => t.category === 'design').map(t => t.content);
      const lighting = selectedTags.filter(t => t.category === 'lighting').map(t => t.content);
      const composition = selectedTags.filter(t => t.category === 'technical').map(t => t.content);

      let steps: PromptStep[] = [
        { step: 1, label: mjStepLabels[1], content: coreSubject },
        { step: 2, label: mjStepLabels[2], content: medium.length > 0 ? medium.join(", ") : "미지정 (AI 자율 반영)", isEmpty: medium.length === 0 },
        { step: 3, label: mjStepLabels[3], content: environment.length > 0 ? environment.join(", ") : "미지정 (AI 자율 반영)", isEmpty: environment.length === 0 },
        { step: 4, label: mjStepLabels[4], content: lighting.length > 0 ? lighting.join(", ") : "미지정 (AI 자율 반영)", isEmpty: lighting.length === 0 },
        { step: 5, label: mjStepLabels[5], content: composition.length > 0 ? composition.join(", ") : "미지정 (AI 자율 반영)", isEmpty: composition.length === 0 },
      ];

      // Filter photography terms in Graphic mode
      if (isGraphic) {
        steps = steps.map(s => ({
          ...s,
          content: s.content.replace(/dslr|photography|photo-realistic|photorealistic|lens|focal length/gi, "high-end design"),
        }));
      }

      // Auto-Parameters
      let paramContent: string;
      if (isGraphic) {
        const hasCharacter = selectedTags.some(t => t.content.toLowerCase().includes('character') || t.content.toLowerCase().includes('person'));
        const noParams = hasCharacter ? "--no photorealistic" : "--no photorealistic, character, person, human, anime";
        paramContent = `${noParams} --v 6.1 --ar 3:4 --stylize ${complexity * 333}`;
      } else {
        const ar = complexity === 1 ? "16:9" : (complexity === 3 ? "4:5" : "1:1");
        paramContent = `--v 6.1 --ar ${ar} --stylize ${complexity * 250}`;
      }
      steps.push({ step: 6, label: mjStepLabels[6], content: paramContent });

      return steps;
    }
    
    // Nanobanana Mode: Structured 7-Step Narrative
    else {
      const actionBlock = selectedTags.filter(t => t.category === 'action').map(t => t.content);
      const background = selectedTags.filter(t => t.category === 'design').map(t => t.content);
      const style = selectedTags.filter(t => t.category === 'art3d').map(t => t.content);
      const composition = selectedTags.filter(t => t.category === 'technical').map(t => t.content);
      const lightingVal = selectedTags.filter(t => t.category === 'lighting').map(t => t.content);
      const details = selectedTags.filter(t => t.category === 'details').map(t => t.content);

      const steps: PromptStep[] = [
        { step: 1, label: nbStepLabels[1], content: coreSubject },
        { step: 2, label: nbStepLabels[2], content: actionBlock.length > 0 ? actionBlock.join(", ") : "미지정 (AI 자율 반영)", isEmpty: actionBlock.length === 0 },
        { step: 3, label: nbStepLabels[3], content: background.length > 0 ? background.join(", ") : "미지정 (AI 자율 반영)", isEmpty: background.length === 0 },
        { step: 4, label: nbStepLabels[4], content: style.length > 0 ? style.join(", ") : "미지정 (AI 자율 반영)", isEmpty: style.length === 0 },
        { step: 5, label: nbStepLabels[5], content: composition.length > 0 ? composition.join(", ") : "미지정 (AI 자율 반영)", isEmpty: composition.length === 0 },
        { step: 6, label: nbStepLabels[6], content: lightingVal.length > 0 ? lightingVal.join(", ") : "미지정 (AI 자율 반영)", isEmpty: lightingVal.length === 0 },
        { step: 7, label: nbStepLabels[7], content: details.length > 0 ? details.join(", ") : "미지정 (AI 자율 반영)", isEmpty: details.length === 0 },
      ];

      // Complexity scaling
      if (complexity === 3) {
        steps.push({
          step: 8,
          label: "Quality",
          content: `This design follows the highest quality commercial standards for ${isGraphic ? 'premium branding' : 'editorial excellence'}.`,
        });
      }

      return steps;
    }
  };

  // Generate a flat prompt string for copy
  const generatePromptFlat = (): string => {
    const steps = generatePromptSteps();
    if (steps.length === 1 && steps[0].step === 0) return steps[0].content;

    const hasCharacter = selectedTags.some(t => t.content.toLowerCase().includes('character') || t.content.toLowerCase().includes('person'));
    const isGraphic = labMode === 'graphic';
    const nbGraphicParams = (isGraphic && !hasCharacter) ? " --no photorealistic, character, person, human, anime" : (isGraphic ? " --no photorealistic" : "");

    if (optimizationMode === 'mj') {
      // MJ: comma-separated, last step joined with space (parameters), ignore empty steps
      const mainSteps = steps.filter(s => s.step < 6 && !s.isEmpty).map(s => s.content);
      const paramStep = steps.find(s => s.step === 6);
      return mainSteps.join(", ") + (paramStep ? ` ${paramStep.content}` : "");
    } else {
      // NB: narrative style, ignore empty steps
      const basePrompt = steps.filter(s => !s.isEmpty).map(s => `[${s.label}] ${s.content}`).join(", ") + ".";
      return basePrompt + nbGraphicParams;
    }
  };

  // Generate Korean interpretation of the design intent
  const generateKoreanSummary = (): string => {
    if (selectedTags.length === 0 && !customText) return "";
    
    const isGraphic = labMode === 'graphic';
    const modeLabel = isGraphic ? "그래픽 디자인" : "사진 촬영";
    const platformLabel = optimizationMode === 'mj' ? "미드저니 6단계" : "나노바나나 7단계";
    
    const subjectTags = selectedTags.filter(t => t.category === 'person').map(t => t.translationKo || t.content);
    const styleTags = selectedTags.filter(t => t.category === 'art3d').map(t => t.translationKo || t.content);
    const envTags = selectedTags.filter(t => t.category === 'design').map(t => t.translationKo || t.content);
    const techTags = selectedTags.filter(t => t.category === 'technical').map(t => t.translationKo || t.content);
    const lightTags = selectedTags.filter(t => t.category === 'lighting').map(t => t.translationKo || t.content);

    let summary = `🎯 [${modeLabel}] 모드 · [${platformLabel}] 공식 기반 설계\n\n`;
    
    if (customText) summary += `📌 핵심 주제: ${customText}\n`;
    if (subjectTags.length > 0) summary += `👤 피사체/주제: ${subjectTags.join(", ")}\n`;
    if (styleTags.length > 0) summary += `🎨 스타일/매체: ${styleTags.join(", ")}\n`;
    if (envTags.length > 0) summary += `🏞️ 배경/환경: ${envTags.join(", ")}\n`;
    if (techTags.length > 0) summary += `📐 구도/기법: ${techTags.join(", ")}\n`;
    if (lightTags.length > 0) summary += `💡 조명: ${lightTags.join(", ")}\n`;
    
    summary += `\n⚙️ 정밀도: ${complexity === 1 ? "LOW" : complexity === 2 ? "STANDARD" : "HI-RES"}`;
    
    return summary;
  };

  const copyToClipboard = () => {
    const prompt = generatePromptFlat();
    if (selectedTags.length > 0 || customText) {
      navigator.clipboard.writeText(prompt);
      toast("서사가 클립보드에 복사되었습니다!", "copy");
    }
  };

  const steps = generatePromptSteps();
  const isEmptyResult = steps.length === 1 && steps[0].step === 0;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: Builder Canvas */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="glass-card flex flex-col p-6 min-h-[450px] shadow-2xl relative border-slate-700 w-full">
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter text-brand-yellow">프롬프트 설계소</h2>
              <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Professional Visual Narrative Engine</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">설계 정밀도</span>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold ${complexity === 1 ? 'text-brand-yellow' : 'text-slate-600'}`}>LOW</span>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  value={complexity}
                  onChange={(e) => setComplexity(Number(e.target.value))}
                  className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                />
                <span className={`text-[10px] font-bold ${complexity === 3 ? 'text-brand-yellow' : 'text-slate-600'}`}>HI-RES</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 flex-1">
            {/* Custom Content Input */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-yellow/20 to-blue-500/20 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="설계할 프롬프트의 시각적 서사 핵심 주제를 입력하세요..."
                className="w-full bg-black/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-yellow/30 transition-all min-h-[120px] relative z-10 text-base font-medium"
              />
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="flex-1 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 p-5 w-full flex flex-wrap gap-3 items-start content-start min-h-[180px] shadow-inner">
                {selectedTags.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-xs font-bold uppercase tracking-[0.2em] gap-3">
                    <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center opacity-50">+</div>
                    태그를 레이어에 배치하여 시각 설계 시작
                  </div>
                ) : (
                  <SortableContext
                    items={selectedTags}
                    strategy={horizontalListSortingStrategy}
                  >
                    {selectedTags.map((tag) => (
                      <SortableTagItem
                        key={tag.id}
                        tag={tag}
                        onRemove={() => handleRemoveTag(tag.id)}
                        onClick={() => setActiveCategoryFocus(tag.category)}
                      />
                    ))}
                  </SortableContext>
                )}
              </div>
            </DndContext>
          </div>
        </div>

        {/* Live Export Output — 단계별 시각적 구분 */}
        <div className="p-8 bg-slate-950 border border-slate-800 shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow/30 to-transparent"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-3 mt-1 sm:mt-0">
              전문 시각 설계 서사 결과
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-ping"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span>
              </span>
            </h3>
            
            {/* Platform Mode Group */}
            <div className="flex bg-slate-900/50 p-1.5 rounded-[1.25rem] border border-slate-800 w-full sm:w-auto">
              <button
                 onClick={() => handleOptimize('mj')}
                 className={`flex-1 sm:px-6 h-9 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                   optimizationMode === 'mj' 
                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                 }`}
              >
                MIDJOURNEY
              </button>
              <button
                 onClick={() => handleOptimize('nb')}
                 className={`flex-1 sm:px-6 h-9 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                   optimizationMode === 'nb' 
                   ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                 }`}
              >
                NANOBANANA
              </button>
            </div>
          </div>

          {/* Structured step-by-step output */}
          <div className="relative">
            {isEmptyResult ? (
              <p className="text-slate-500 text-lg leading-relaxed font-mono break-words min-h-[120px] bg-black/40 p-6 rounded-2xl border border-slate-800/80 shadow-inner flex items-center justify-center">
                {steps[0].content}
              </p>
            ) : (
              <div className="bg-black/40 rounded-2xl border border-slate-800/80 shadow-inner overflow-hidden">
                {steps.map((s, idx) => {
                  const isMJ = optimizationMode === 'mj';
                  const stepColor = isMJ
                    ? ['text-blue-400', 'text-purple-400', 'text-emerald-400', 'text-orange-400', 'text-brand-yellow', 'text-rose-400'][idx % 6]
                    : ['text-blue-400', 'text-teal-400', 'text-emerald-400', 'text-purple-400', 'text-brand-yellow', 'text-orange-400', 'text-rose-400'][idx % 7];
                  const bgColor = isMJ
                    ? ['bg-blue-500/5', 'bg-purple-500/5', 'bg-emerald-500/5', 'bg-orange-500/5', 'bg-brand-yellow/5', 'bg-rose-500/5'][idx % 6]
                    : ['bg-blue-500/5', 'bg-teal-500/5', 'bg-emerald-500/5', 'bg-purple-500/5', 'bg-brand-yellow/5', 'bg-orange-500/5', 'bg-rose-500/5'][idx % 7];

                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-4 px-6 py-4 ${bgColor} ${idx !== steps.length - 1 ? 'border-b border-slate-800/50' : ''} transition-colors hover:brightness-125 ${s.isEmpty ? 'opacity-40 grayscale-[50%]' : ''}`}
                    >
                      <div className="flex items-center gap-2 shrink-0 min-w-[140px]">
                        <span className={`text-xs font-black w-6 h-6 rounded-lg flex items-center justify-center border border-current/20 ${stepColor}`}>
                          {s.step}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${stepColor}`}>
                          {s.label}
                        </span>
                      </div>
                      <p className={`font-mono text-sm leading-relaxed break-words flex-1 selection:bg-brand-yellow/30 ${s.isEmpty ? 'text-slate-500 italic' : 'text-slate-200'}`}>
                        {s.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* 한국어 해석 영역 */}
          {!isEmptyResult && (
            <div className="mt-6 p-5 bg-slate-900/60 rounded-2xl border border-slate-800/60 shadow-inner">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-[8px] text-blue-400">韓</span>
                한국어 해석 · 디자인 의도 요약
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed font-medium whitespace-pre-line">
                {generateKoreanSummary()}
              </p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-4">
            {/* Primary Action Group */}
            {/* Primary Action Group */}
            <div className="flex items-center gap-3 w-full xl:w-auto">
              <button
                onClick={handleBuildPrompt}
                disabled={isBuilding}
                className={`flex-1 xl:flex-none h-14 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider text-[13px] px-8 border ${
                  isBuilding 
                  ? 'bg-purple-900/50 text-purple-400 border-purple-800/50 cursor-not-allowed' 
                  : 'bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600 hover:text-white hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95'
                }`}
              >
                {isBuilding ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                    BUILDING...
                  </>
                ) : (
                  <>
                    <span className="text-lg leading-none">✨</span> BUILD PROMPT
                  </>
                )}
              </button>

              <button
                onClick={copyToClipboard}
                className="flex-1 xl:flex-none bg-brand-yellow hover:bg-yellow-400 active:scale-95 text-black px-8 h-14 rounded-2xl font-black transition-all shadow-xl shadow-brand-yellow/10 flex items-center justify-center gap-2 uppercase tracking-wider text-[13px]"
              >
                <Copy size={18} />
                COPY PROMPT
              </button>
            </div>

            {/* Utility Group */}
            <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 mt-2 xl:mt-0">
              <label className="cursor-pointer bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white px-5 h-12 rounded-xl font-bold transition-all flex items-center gap-2 border border-slate-700/50 text-[10px] uppercase tracking-widest whitespace-nowrap">
                <input type="file" accept=".md" className="hidden" onChange={handleImport} />
                <Upload size={14} />
                <span>IMPORT MD</span>
              </label>
              <button
                onClick={handleExport}
                className="bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white px-5 h-12 rounded-xl font-bold transition-all flex items-center gap-2 border border-slate-700/50 text-[10px] uppercase tracking-widest whitespace-nowrap"
              >
                <Download size={14} />
                <span>SAVE MD</span>
              </button>
              <div className="w-px h-8 bg-slate-800 mx-1"></div>
              <button
                 onClick={() => {
                   setSelectedTags([]);
                   setCustomText("");
                   setKoreanInterpretation("");
                 }}
                 className="text-slate-600 hover:text-rose-400 px-4 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors whitespace-nowrap"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Tag Bank */}
      <div className={`w-full lg:col-span-4 glass-card p-6 border-slate-700 flex flex-col gap-5 transition-all duration-500 relative overflow-hidden ${activeCategoryFocus ? 'ring-2 ring-brand-yellow/50 shadow-[0_0_30px_rgba(252,211,77,0.15)]' : ''}`}>
        
        {/* Glow effect for drawer open interaction */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-brand-yellow/30 rounded-full blur-[60px] pointer-events-none transition-opacity duration-1000 ${activeCategoryFocus ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold tracking-tight">
            태그 보관함
          </h2>
          {activeCategoryFocus && (
            <button 
              onClick={() => setActiveCategoryFocus(null)}
              className="text-[10px] bg-slate-800 px-2 py-1 flex items-center gap-1 rounded text-slate-300 hover:text-brand-yellow"
            >
              포커스 해제
            </button>
          )}
        </div>

        {/* Photography / Graphic Design 모드 전환 탭 — 타이틀 바로 아래 */}
        <div className="flex gap-1 bg-slate-900/60 rounded-xl p-1 border border-slate-800">
          <button
            onClick={() => handleModeSwitch('photography')}
            className={`flex-1 py-2.5 rounded-lg font-black transition-all text-[10px] uppercase tracking-widest ${
              labMode === 'photography' 
              ? 'bg-white text-slate-900 shadow-lg' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            📷 Photography
          </button>
          <button
            onClick={() => handleModeSwitch('graphic')}
            className={`flex-1 py-2.5 rounded-lg font-black transition-all text-[10px] uppercase tracking-widest ${
              labMode === 'graphic' 
              ? 'bg-white text-slate-900 shadow-lg' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🎨 Design
          </button>
        </div>

        {/* 모드 설명 */}
        <p className="text-[10px] text-slate-600 font-medium px-1">
          {labMode === 'photography' 
            ? '상업 사진·인물·제품 촬영에 최적화된 태그 세트' 
            : '그래픽 디자인·브랜딩·벡터 아트에 최적화된 태그 세트'}
        </p>

        {/* 태그 카테고리 리스트 — 모드에 따라 완전 교체 */}
        <div className="flex flex-col gap-4 overflow-y-auto flex-1">
          {Object.entries(currentTags).map(([category, tags]) => {
            const isFocused = activeCategoryFocus === category;
            const isFaded = activeCategoryFocus !== null && !isFocused;
            const catLabel = categoryTranslation[labMode]?.[category] || category;
            
            return (
              <div 
                key={`${labMode}-${category}`} 
                className={`transition-all duration-300 p-2 -mx-2 rounded-xl ${isFocused ? 'bg-slate-800/80 border border-slate-700 scale-[1.02]' : ''} ${isFaded ? 'opacity-40 grayscale-[50%]' : ''}`}
              >
                <h3 className={`text-[10px] tracking-widest uppercase font-black mb-3 flex items-center gap-2 ${isFocused ? 'text-brand-yellow' : 'text-slate-500'}`}>
                  {catLabel}
                  {isFocused && <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></span>}
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {tags.map((t) => (
                    <TagChipWithTooltip
                      key={t.id}
                      tag={t}
                      category={category}
                      onAdd={() => handleAddTag(t)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// Subcomponent: Tag chip with Korean hover tooltip
function TagChipWithTooltip({ tag, category, onAdd }: { tag: TagItem; category: string; onAdd: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative w-full z-10" 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={onAdd}
        className={`w-full text-center truncate text-[11px] font-bold px-3 py-2 rounded-[0.4rem] border backdrop-blur-md transition-all hover:scale-[1.03] active:scale-95 ${categoryColors[category] || "bg-slate-800 text-slate-300 border-slate-700"} hover:brightness-125 hover:z-20`}
      >
        {tag.content}
      </button>
      {/* 한글 번역 호버 팝업 */}
      {showTooltip && tag.translationKo && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg shadow-xl text-[11px] font-bold text-brand-yellow whitespace-nowrap z-[100] pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-150">
          {tag.translationKo}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-slate-600"></div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Sortable draggable tag
function SortableTagItem({ tag, onRemove, onClick }: { tag: TagItem; onRemove: () => void; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tag.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`touch-none relative group flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg border backdrop-blur-md cursor-grab active:cursor-grabbing shadow-lg ${
        categoryColors[tag.category] || "bg-slate-800 text-slate-300 border-slate-700"
      }`}
      title={tag.translationKo || tag.content}
    >
      <span>{tag.content}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-black/20"
        onPointerDown={(e) => e.stopPropagation()} 
      >
        <X size={14} />
      </button>
    </div>
  );
}
