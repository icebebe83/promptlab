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
import { X } from "lucide-react";
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
  design: 2,      // 배경
  art3d: 3,       // 스타일/매체
  technical: 4,   // 구도/카메라
  lighting: 5,    // 조명
};

const categoryTranslation: Record<string, string> = {
  person: "인물",
  art3d: "3D & 아트",
  design: "디자인 & 배경",
  technical: "카메라 제어",
  lighting: "조명",
};

export type TagItem = {
  id: string;
  content: string;
  category: string;
};

// Colors based on category to organize visually
const categoryColors: Record<string, string> = {
  person: "bg-blue-900/40 text-blue-300 border-blue-500/50",
  art3d: "bg-purple-900/40 text-purple-300 border-purple-500/50",
  design: "bg-emerald-900/40 text-emerald-300 border-emerald-500/50",
  technical: "bg-brand-yellow/20 text-brand-yellow border-brand-yellow/50",
  lighting: "bg-orange-900/40 text-orange-300 border-orange-500/50",
};

export default function TagBuilderClient({
  initialTags,
}: {
  initialTags: Record<string, TagItem[]>;
}) {
  // Tags the user has currently placed on the canvas
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [customText, setCustomText] = useState("");
  // 1: 단순함, 2: 보통, 3: 복잡함
  const [complexity, setComplexity] = useState(2);
  const [optimizationMode, setOptimizationMode] = useState<'mj' | 'nb'>('mj');
  const { toast } = useToast();

  // DND Configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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



  const generatePrompt = () => {
    if (selectedTags.length === 0 && !customText) {
      return "설계할 주제를 입력하거나 태그를 선택해 주세요...";
    }

    const getAllText = () => {
      const texts = [customText.toLowerCase(), ...selectedTags.map(t => t.content.toLowerCase())];
      return texts.join(" ");
    };

    const combinedText = getAllText();

    // -------------------------------------------------------------
    // Contextual Reasoning Engine - Detect Scenarios
    // -------------------------------------------------------------
    const isPortrait = /woman|man|girl|boy|face|portrait|female|male|여자|남자|소녀|소년|세로|얼굴|인물/.test(combinedText);
    const isFood = /apple|fruit|food|coffee|cake|meal|juice|사과|과일|음식|커피|케이크|식사/.test(combinedText);
    const isProduct = /product|bottle|perfume|cosmetic|제품|향수|화장품|보틀|오브제/.test(combinedText);
    const isSelfie = /selfie|vlog|셀카|브이로그/.test(combinedText);
    const isBed = /bed|bedroom|cozy|sleep|침대|이불|침실|포근한|수면/.test(combinedText);
    const isNature = /forest|nature|mountain|tree|자연|숲|나무|산/.test(combinedText);


    // -------------------------------------------------------------
    // Deducing Narrative Blocks (Zero-Template Policy)
    // -------------------------------------------------------------
    
    // 1. Core Scene & Mood
    let moodPrefix = "Ultra-realistic intimate portrait of";
    if (isProduct) moodPrefix = "High-end commercial product shot of";
    else if (isFood) moodPrefix = "Mouth-watering culinary photography highlighting";
    else if (isNature) moodPrefix = "Breathtaking national geographic style landscape featuring";
    else if (!isPortrait) moodPrefix = "Hyper-detailed cinematic establishment shot of";

    const baseSubject = customText ? customText : selectedTags.map(t => t.content).join(" ");
    const layer1 = `${moodPrefix} ${baseSubject}`;

    // 2. Physical Interaction & Texture Expansion
    const textures: string[] = [];
    if (isFood) textures.push("glistening moisture droplets, fine fuzz on the skin, organic sub-surface scattering");
    if (isPortrait) textures.push("visible natural skin pores, realistic epidermal translucency, subtle vellus hairs");
    if (isBed) textures.push("soft wrinkles of luxurious linen fabric, cozy textile depth");
    if (isProduct) textures.push("perfectly polished surface reflections, tactile material fidelity");

    const textureStr = textures.length > 0 ? `emphasizing ${textures.join(", and ")}` : "";

    // 3. Environment & Light Expansion
    const lTags = selectedTags.filter(t => t.category === 'lighting').map(t => t.content);
    const dTags = selectedTags.filter(t => t.category === 'design').map(t => t.content);
    
    let lightStr = "";
    if (lTags.length > 0) {
      if (lTags.join(" ").toLowerCase().includes("golden hour")) {
         lightStr = "bathed in a high-contrast warm amber glow with long soft shadows";
      } else {
         lightStr = `illuminated by ${lTags.join(", ")} casting highly defined volumetric rays`;
      }
    } else {
      if (isBed) lightStr = "soft morning light filtering through a nearby window";
      else lightStr = "beautifully lit with soft wrapping light";
    }

    let envStr = "";
    if (dTags.length > 0) {
      envStr = `set amidst a ${dTags.join(", ")} environment`;
    }

    // 4. Camera & Technical Match
    const tTags = selectedTags.filter(t => t.category === 'technical').map(t => t.content);
    let techStr = "";
    if (isSelfie) {
      techStr = "shot handheld at arm's length, ultra-wide 14mm distortion creating an intimate personal perspective";
    } else if (isFood || isProduct) {
      techStr = "captured with a 100mm macro lens for extreme shallow depth of field and creamy bokeh";
    } else if (tTags.length > 0) {
      if (tTags.join(" ").includes("85mm")) techStr = "shot on an 85mm portrait lens with cinematic background compression";
      else techStr = `captured flawlessly using ${tTags.join(", ")}`;
    } else {
      techStr = "shot on a professional 35mm prime lens";
    }

    // 5. Negative Prompt & Quality Check
    let negative = "no artificial smoothing, no plastic skin, reject CGI look";
    if (isFood) negative = "no plastic appearance, no artificial gloss, natural organic look";
    if (isProduct) negative = "no smudges, reject low resolution, perfect studio fidelity";

    // Build the final Strings
    const nbSentence = `${layer1}, ${textureStr}. The scene is ${envStr ? envStr + ", " : ""}${lightStr}. ${techStr}. Masterpiece quality, ${negative}.`;
    
    // Clean up empty commas or double spaces
    const cleanNb = nbSentence.replace(/ ,/g, ",").replace(/, \./g, ".").replace(/\s+/g, " ").replace(/ \./g, ".");

    // --- NB Mode: Practical Cinematic Narrative ---
    if (optimizationMode === 'nb') {
      let finalNB = cleanNb;
      if (complexity === 1) finalNB = `${layer1}. ${lightStr}.`;
      else if (complexity === 3) finalNB = `${cleanNb} Award-winning cinematography, Arri Alexa 65 format, 8k resolution.`;
      
      return finalNB;
    } 
    // --- MJ Mode: High-Density Token Compression ---
    else {
      const pool = [
        customText,
        ...selectedTags.map(t => t.content),
        isPortrait ? "intimate portrait, visible natural skin pores, epidermal translucency" : "",
        isFood ? "culinary photography, glistening moisture droplets, organic sub-surface scattering" : "",
        isBed ? "luxurious linen fabric wrinkles, cozy textile" : "",
        isProduct ? "high-end commercial product shot, perfectly polished surface" : "",
        isSelfie ? "intimate personal wide-angle perspective, arm's length, 14mm distortion" : (isFood || isProduct ? "100mm macro lens, creamy bokeh" : ""),
        lightStr.includes("amber glow") ? "golden hour, warm amber glow, volumetrics" : lTags.join(", "),
        "hyper-realistic, 8k, raw photo style",
        `--no ${negative.replace(/no |reject /g, "").split(", ").join(", ")}`
      ].filter(Boolean);

      let mjText = [...new Set(pool)].join(", ").replace(/, ,/g, ",");
      
      if (complexity === 1) mjText += " --v 6.1 --stylize 50";
      else if (complexity === 2) mjText += " --v 6.1 --stylize 250";
      else if (complexity === 3) mjText += " --v 6.1 --stylize 750 --weird 10 --relax";
      
      return mjText;
    }
  };

  const copyToClipboard = () => {
    const prompt = generatePrompt();
    if (selectedTags.length > 0 || customText) {
      navigator.clipboard.writeText(prompt);
      toast("서사가 클립보드에 복사되었습니다!", "copy");
    }
  };

  return (
    <div className="w-full flex md:flex-row flex-col gap-6">
      {/* LEFT: Builder Canvas */}
      <div className="flex-1 flex flex-col gap-6">
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
                      />
                    ))}
                  </SortableContext>
                )}
              </div>
            </DndContext>
          </div>
        </div>

        {/* Live Export Output */}
        <div className="p-8 bg-slate-950 border border-slate-800 shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow/30 to-transparent"></div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-500 flex items-center gap-3">
              전문 시각 설계 서사 결과
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-ping"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span>
              </span>
            </h3>
            <span className="text-[10px] font-black px-2 py-1 bg-slate-800 text-slate-400 rounded-md border border-slate-700">
              {optimizationMode === 'mj' ? 'MIDJOURNEY' : 'NANOBANANA'} V1.5
            </span>
          </div>
          <div className="relative">
            <p className="text-slate-300 text-lg leading-relaxed font-mono break-words min-h-[120px] bg-black/40 p-6 rounded-2xl border border-slate-800/80 shadow-inner selection:bg-brand-yellow/30">
              {generatePrompt()}
            </p>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={copyToClipboard}
              className="bg-brand-yellow hover:bg-yellow-400 active:scale-95 text-black px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-brand-yellow/10 flex items-center gap-3"
            >
              프롬프터 복사
            </button>
            <div className="h-12 w-[1px] bg-slate-800 mx-2 hidden sm:block"></div>
            <button
               onClick={() => handleOptimize('mj')}
               className={`px-7 py-4 rounded-2xl font-bold tracking-tight transition-all border ${
                 optimizationMode === 'mj' 
                 ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' 
                 : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
               }`}
            >
              미드저니용
            </button>
            <button
               onClick={() => handleOptimize('nb')}
               className={`px-7 py-4 rounded-2xl font-bold tracking-tight transition-all border ${
                 optimizationMode === 'nb' 
                 ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20' 
                 : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
               }`}
            >
              나노바나나용
            </button>
            <button
               onClick={() => {
                 setSelectedTags([]);
                 setCustomText("");
               }}
               className="text-white hover:text-brand-yellow px-4 py-4 rounded-2xl text-base font-black uppercase tracking-widest transition-colors ml-auto"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Tag Bank */}
      <div className="w-full md:w-[350px] glass-card p-6 border-slate-700 flex flex-col gap-6">
        <h2 className="text-xl font-bold tracking-tight mb-2">태그 보관함</h2>

        {Object.entries(initialTags).map(([category, tags]) => (
          <div key={category} className="mb-2">
            <h3 className="text-xs tracking-widest uppercase text-slate-500 font-bold mb-3">
              {categoryTranslation[category] || category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleAddTag(t)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${categoryColors[category] || "bg-slate-800 text-slate-300 border-slate-700"} hover:brightness-125`}
                >
                  {t.content}
                </button>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

// Subcomponent: Sortable draggable tag
function SortableTagItem({ tag, onRemove }: { tag: TagItem; onRemove: () => void }) {
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
      className={`touch-none relative group flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg border backdrop-blur-md cursor-grab active:cursor-grabbing shadow-lg ${
        categoryColors[tag.category] || "bg-slate-800 text-slate-300 border-slate-700"
      }`}
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
