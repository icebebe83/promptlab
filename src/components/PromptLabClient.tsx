"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, PlayCircle, Image as ImageIcon, Camera, X, Download, Upload } from "lucide-react";
import { useToast } from "./Toast";
export default function PromptLabClient() {
  const initialLayers = {
    subject: { data: null, weights: { structure: 80, color: 10, style: 10 } },
    composition: { data: null, weights: { structure: 100, color: 0, style: 0 } },
    style: { data: null, weights: { structure: 10, color: 40, style: 50 } },
    material: { data: null, weights: { structure: 30, color: 20, style: 50 } },
  };

  const [layers, setLayers] = useState<Record<string, any>>(initialLayers);
  const [brandConstants, setBrandConstants] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [activeTab, setActiveTab] = useState<"midjourney" | "nanobanana">("midjourney");
  
  const [currentBlocks, setCurrentBlocks] = useState<Array<{text: string, category: string}>>([]);
  const [drawerCategory, setDrawerCategory] = useState<string | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const TAG_DATABASE: Record<string, string[]> = {
    subject: ["Whiskey Bottle", "Glass Surface", "Luxury Watch", "Model Face", "Cosmetic Jar", "Handbag", "Modern Interior", "Cyberpunk Character", "Gourmet Food", "Automobile"],
    lighting: ["Golden Hour", "Studio Lighting", "Rim Light", "Cyberpunk Neon", "Soft Sunlight", "Cinematic Shadow", "Dramatic Chiaroscuro", "Natural Window Light", "Volumetric Glow"],
    composition: ["85mm Portrait", "Close-up", "Low Angle", "Flat Lay", "Eye Level", "Wide Shot", "Macro Detail", "Dutch Angle", "Top-down View"],
    style: ["Hyper-realistic", "Cinematic", "Minimalist", "Vibrant", "Vintage Film", "Noir", "Octane Render", "Studio Photography", "Editorial"],
    bg: ["Studio Grey", "Blurred Cityscape", "Nature Forest", "Pristine White", "Luxury Marble", "Concrete Wall", "Soft Bokeh", "Solid Dark"],
    details: ["Intricate Texture", "Water Droplets", "Dust Motes", "Sharp Focus", "Subsurface Scattering", "Micro Details", "Soft Skin"],
    param: ["--v 6.1", "--stylize 250", "--ar 3:4", "--ar 16:9", "--ar 9:16", "--stylize 750", "--weird 10"]
  };

  const { toast } = useToast();

  // Sync currentBlocks when tab changes or results are initialised
  useEffect(() => {
    if (results && results[activeTab]?.blocks) {
      setCurrentBlocks(results[activeTab].blocks);
    }
  }, [activeTab, results]);

  const handleLayerUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLayers(prev => ({
          ...prev,
          [key]: { ...prev[key], data: reader.result as string }
        }));
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLayerImage = (key: string) => {
    setLayers(prev => ({
      ...prev,
      [key]: { ...prev[key], data: null }
    }));
    setResults(null);
  };

  const updateWeight = (key: string, weightKey: string, value: number) => {
    setLayers(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        weights: { ...prev[key].weights, [weightKey]: value }
      }
    }));
  };

  const handleAnalyze = async () => {
    const activeLayers = Object.values(layers).filter(l => l.data !== null);
    if (activeLayers.length === 0) {
      toast("분석할 이미지를 최소 하나 이상 업로드해주세요.", "error");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layers, brandConstants }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '분석에 실패했습니다');
      }

      const data = await response.json();
      setResults(data);
      if (data[activeTab]?.blocks) {
        setCurrentBlocks(data[activeTab].blocks);
      }
      toast("Professional 엔진 분석 완료!", "success");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : '분석 오류가 발생했습니다';
      toast(`분석 오류: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    // If it's structured multi-line (Nanobanana), use as is. Otherwise join by comma.
    const finalCopyText = text || "";
    navigator.clipboard.writeText(finalCopyText);
    toast(`${label} 복사 완료!`, "copy");
  };

  const handleExportMd = () => {
    if (!results || !currentBlocks || currentBlocks.length === 0) return;
    const englishStr = currentBlocks.map(b => b.text).join(", ");
    const yaml = `---
version: 2.0
optimizationMode: ${activeTab === 'midjourney' ? 'mj' : 'nb'}
customText: ""
type: "PromptLab"
tags:
${currentBlocks.map(b => `  - id: "${Math.random().toString(36).substr(2, 9)}"
    content: "${b.text}"
    category: "${b.category}"`).join('\n')}
---

# 프롬프트 설계
${englishStr}
`;
    const blob = new Blob([yaml], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hybrid_prompt_${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("마크다운 내보내기가 완료되었습니다.", "success");
  };

  const handleImportMd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const modeMatch = text.match(/optimizationMode:\s*(mj|nb)/);
        const tagMatches = text.match(/  - id: "(.*?)"\n    content: "(.*?)"\n    category: "(.*?)"/g);
        
        let parsedBlocks: any[] = [];
        if (tagMatches) {
           parsedBlocks = tagMatches.map(line => {
             const contentMatch = line.match(/content: "(.*?)"/);
             const catMatch = line.match(/category: "(.*?)"/);
             return {
               text: contentMatch ? contentMatch[1] : "",
               category: catMatch ? catMatch[1] : "person"
             };
           });
        }
        
        const mode = modeMatch ? (modeMatch[1] === 'mj' ? 'midjourney' : 'nanobanana') : 'midjourney';
        setActiveTab(mode);
        
        // Mock the results to inject the loaded blocks seamlessly
        setResults({
          midjourney: { english: parsedBlocks.map(b=>b.text).join(", "), korean: "MD 파일에서 복원됨", reasoning: "MD 파싱 완료", score: 100, blocks: parsedBlocks },
          nanobanana: { english: parsedBlocks.map(b=>b.text).join(", "), korean: "MD 파일에서 복원됨", reasoning: "MD 파싱 완료", score: 100, blocks: parsedBlocks }
        });
        setCurrentBlocks(parsedBlocks);
        toast("스마트 블록이 .md 환경에서 복원되었습니다.", "success");
      } catch (err) {
        toast("파일을 읽는 중 오류가 발생했습니다.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={`flex flex-col xl:flex-row gap-8 transition-all duration-700 ${results ? 'w-full' : 'max-w-4xl mx-auto'}`}>
      
      {/* Left: Input Dashboard */}
      <div className={`w-full flex flex-col gap-6 transition-all duration-500 ${results ? 'xl:w-[480px] shrink-0' : ''}`}>
        
        {/* Header */}
        <div className={`mb-4 transition-all duration-500 ${results ? 'text-left' : 'text-center items-center flex flex-col'}`}>
          <div className="inline-flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow">Professional Edition</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
            Prompt LAB <span className="text-brand-yellow opacity-80">PRO</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-lg mb-4">
            브랜드 상수와 4개 레이어 가중치 제어를 통해 상업용 프롬프트의 감도를 전문적으로 튜닝합니다.
          </p>
          
          {!results && (
            <div className={`mt-2 ${results ? 'text-left' : 'flex justify-center md:justify-start'}`}>
              <label className="cursor-pointer inline-flex items-center gap-3 text-xs font-black bg-brand-yellow/5 hover:bg-brand-yellow/10 text-brand-yellow/80 hover:text-brand-yellow px-8 py-3.5 rounded-xl border border-brand-yellow/20 hover:border-brand-yellow/40 transition-all duration-300 active:scale-95 group/import shadow-[0_0_20px_rgba(252,211,77,0.05)] hover:shadow-[0_0_30px_rgba(252,211,77,0.1)]">
                <Upload size={18} className="text-brand-yellow/60 group-hover/import:text-brand-yellow transition-colors" />
                과거 분석 세션 (.md) 불러오기
                <input type="file" accept=".md" className="hidden" onChange={handleImportMd} />
              </label>
            </div>
          )}
        </div>

        {/* 1. Brand Constants Area */}
        <div className="glass-card p-6 border-slate-700/50 bg-slate-900/40">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center gap-2">
            <PlayCircle size={14} className="text-brand-yellow/60" />
            Brand Constants (고정 페르소나/아이덴티티)
          </h3>
          <textarea
            value={brandConstants}
            onChange={(e) => setBrandConstants(e.target.value)}
            placeholder="예: Luxury, Minimalist, Matte Black background, 8k professional product shot..."
            className="w-full h-24 bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-brand-yellow/30 transition-all font-mono resize-none"
          />
        </div>

        {/* 2. 4-Layer Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LayerSlot 
            id="subject"
            label="Subject (피사체)" 
            icon={Camera} 
            data={layers.subject.data} 
            weights={layers.subject.weights}
            onUpload={(e) => handleLayerUpload('subject', e)}
            onRemove={() => removeLayerImage('subject')}
            onWeightChange={(wk, v) => updateWeight('subject', wk, v)}
          />
          <LayerSlot 
            id="composition"
            label="Composition (구도)" 
            icon={PlayCircle} 
            data={layers.composition.data} 
            weights={layers.composition.weights}
            onUpload={(e) => handleLayerUpload('composition', e)}
            onRemove={() => removeLayerImage('composition')}
            onWeightChange={(wk, v) => updateWeight('composition', wk, v)}
          />
          <LayerSlot 
            id="style"
            label="Style (라이팅/무드)" 
            icon={ImageIcon} 
            data={layers.style.data} 
            weights={layers.style.weights}
            onUpload={(e) => handleLayerUpload('style', e)}
            onRemove={() => removeLayerImage('style')}
            onWeightChange={(wk, v) => updateWeight('style', wk, v)}
          />
          <LayerSlot 
            id="material"
            label="Material (질감/매질)" 
            icon={Download} 
            data={layers.material.data} 
            weights={layers.material.weights}
            onUpload={(e) => handleLayerUpload('material', e)}
            onRemove={() => removeLayerImage('material')}
            onWeightChange={(wk, v) => updateWeight('material', wk, v)}
          />
        </div>


        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-brand-yellow text-slate-900 font-black py-4 rounded-2xl text-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_40px_rgba(252,211,77,0.15)] hover:shadow-[0_10px_50px_rgba(252,211,77,0.25)] transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.98]"
        >
          {loading ? (
            <><Loader2 className="animate-spin" /> <span className="animate-pulse">Professional 분석 엔진 가동 중...</span></>
          ) : (
            <>
              <PlayCircle className="fill-slate-900" />
              멀티 시드 하이브리드 엔진 분석 시작
            </>
          )}
        </button>
      </div>

      {/* 결과 패널 */}
      {results && (
        <div className="fixed md:static inset-y-0 right-0 w-full md:flex-1 md:h-full z-50 p-6 md:p-0 bg-slate-950 md:bg-transparent overflow-y-auto">
          <div className="glass-card w-full border-slate-700 overflow-hidden flex flex-col h-full min-h-[500px]">

            {/* 플랫폼 탭 */}
            <div className="flex border-b border-slate-800 bg-slate-900/50">
              <TabBtn active={activeTab === "midjourney"} onClick={() => setActiveTab("midjourney")} icon={<ImageIcon size={14} />} label="Midjourney" />
              <TabBtn active={activeTab === "nanobanana"} onClick={() => setActiveTab("nanobanana")} icon={<ImageIcon size={14} />} label="Nanobanana" />
            </div>

            {/* 콘텐츠 영역 */}
            <div className="p-8 flex-1 flex flex-col relative">
              <div className="absolute top-4 right-4 animate-pulse">
                <span className="text-[10px] uppercase font-black tracking-widest bg-brand-yellow/20 text-brand-yellow px-2 py-1 rounded border border-brand-yellow/30">AI 추출 완료</span>
              </div>

              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight text-white flex gap-2">
                {activeTab} <span className="text-slate-500 font-medium lowercase">포뮬라</span>
              </h2>

              <div className="flex-1 flex flex-col gap-4 overflow-y-auto">

                {/* 점수 표시 (Midjourney / Nanobanana) */}
                {results[activeTab]?.score !== undefined && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-black ${results[activeTab].score >= 80 ? "text-brand-yellow" : results[activeTab].score >= 50 ? "text-orange-500" : "text-rose-500"}`}>
                        {results[activeTab].score}
                      </span>
                      <span className="text-slate-600 font-bold text-sm">/ 100점</span>
                    </div>
                    {results[activeTab]?.breakdown && (
                      <div className="flex-1 flex flex-wrap gap-1.5 ml-4">
                        {results[activeTab].breakdown.map((b: { axis?: string; step?: string; score: number }, i: number) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                            {b.axis || b.step}: {b.score}/{10}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 스마트 블록 UI */}
                {currentBlocks && currentBlocks.length > 0 && (
                  <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 shadow-inner mb-2">
                    <h3 className="text-xs uppercase text-brand-yellow font-bold mb-3 tracking-widest flex items-center justify-between">
                      스마트 블록 캔버스 (클릭하여 편집/교체)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentBlocks.map((block, i) => (
                        <div key={i} className="relative group">
                          {selectedBlockIndex === i && isEditing ? (
                            <input
                              autoFocus
                              type="text"
                              value={block.text}
                              onChange={(e) => {
                                const newBlocks = [...currentBlocks];
                                newBlocks[i].text = e.target.value;
                                setCurrentBlocks(newBlocks);
                              }}
                              onBlur={() => setIsEditing(false)}
                              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                              className="px-3 py-1.5 rounded-lg text-sm font-bold bg-white text-slate-900 border-2 border-brand-yellow outline-none min-w-[120px]"
                            />
                          ) : (
                            <button
                              onClick={() => {
                                if (selectedBlockIndex === i) {
                                  setIsEditing(true);
                                } else {
                                  setDrawerCategory(block.category);
                                  setSelectedBlockIndex(i);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border shadow-sm hover:-translate-y-0.5 active:translate-y-0 ${
                                selectedBlockIndex === i 
                                  ? 'bg-brand-yellow text-slate-900 border-brand-yellow shadow-brand-yellow/20' 
                                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              {block.text}
                            </button>
                          )}
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 rounded-full p-0.5 pointer-events-none">
                            <Camera size={8} className="text-brand-yellow" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 영어 프롬프트 */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-inner">
                  <h3 className="text-xs uppercase text-brand-yellow font-bold mb-2 tracking-widest flex items-center justify-between">
                    최종 영어 프롬프트
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors bg-slate-800 px-2 py-1 rounded">
                        <input type="file" accept=".md" className="hidden" onChange={handleImportMd} />
                        <Upload size={12} />
                        MD 불러오기
                      </label>
                      <button className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors bg-slate-800 px-2 py-1 rounded"
                        onClick={handleExportMd}
                      >
                        <Download size={12} />
                        MD 내보내기
                      </button>
                      <button className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors bg-brand-yellow/20 text-brand-yellow px-2 py-1 rounded border border-brand-yellow/30"
                        onClick={() => handleCopy(
                          currentBlocks.length > 0 ? currentBlocks.map(b => b.text).join(", ") : (results[activeTab]?.english || ""), 
                          "영어 프롬프트"
                        )}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        복사하기
                      </button>
                    </div>
                  </h3>
                  <p className="text-slate-200 font-mono text-base leading-relaxed break-words whitespace-pre-wrap">
                    {/* Display actual english string from results to preserve structure (like multi-line NB) */}
                    {results[activeTab]?.english || "내용이 없습니다."}
                  </p>
                </div>

                {/* 한국어 해석 */}
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/50 shadow-inner">
                  <h3 className="text-xs uppercase text-slate-500 font-bold mb-2 tracking-widest">한국어 해석</h3>
                  <p className="text-slate-300 font-medium text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {results[activeTab]?.korean || "내용이 없습니다."}
                  </p>
                </div>

                {/* 디자인 의도 */}
                <div className="bg-blue-900/20 p-5 rounded-2xl border border-blue-900/30 shadow-inner mt-2">
                  <h3 className="text-xs uppercase text-blue-400 font-bold mb-2 tracking-widest">디자인 의도 분석</h3>
                  <p className="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                    {results[activeTab]?.reasoning || "내용이 없습니다."}
                  </p>
                </div>

              </div>
            </div>

            {/* 태그 서랍 (Drawer) */}
            {drawerCategory && (
              <div className="absolute inset-y-0 right-0 w-full md:w-[320px] bg-slate-900/95 backdrop-blur-3xl border-l border-slate-700 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-50 flex flex-col transition-transform animate-in slide-in-from-right">
                <div className="p-6 border-b border-slate-800 flex flex-col gap-4 sticky top-0 bg-slate-900/90 z-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-brand-yellow uppercase tracking-widest text-lg">태그 교체</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{drawerCategory} 카테고리</p>
                    </div>
                    <button 
                      onClick={() => {
                        setDrawerCategory(null);
                        setSelectedBlockIndex(null);
                        setIsEditing(false);
                      }} 
                      className="p-2 hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
                    >
                      <X size={20} className="text-slate-400 hover:text-white" />
                    </button>
                  </div>

                </div>


                {/* 직접 수정 입력 필드 (Drawer 상단) */}
                {selectedBlockIndex !== null && (
                  <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800 animate-in fade-in slide-in-from-top-1">
                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-2 block">텍스트 직접 수정 (전체 서사 반영)</label>
                    <div className="relative">
                      <input 
                        type="text"
                        autoFocus
                        value={currentBlocks[selectedBlockIndex]?.text || ""}
                        onChange={(e) => {
                          const newBlocks = [...currentBlocks];
                          newBlocks[selectedBlockIndex].text = e.target.value;
                          setCurrentBlocks(newBlocks);
                        }}
                        placeholder="태그 내용을 직접 입력하세요..."
                        className="w-full bg-slate-900 border-2 border-brand-yellow/30 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/10 transition-all shadow-[0_0_15px_rgba(252,211,77,0.05)]"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-[9px] bg-brand-yellow/10 text-brand-yellow px-1.5 py-0.5 rounded font-black uppercase">Direct</span>
                        <Camera size={14} className="text-brand-yellow/50" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                  {/* 최상단 지능형 필터 영역 */}
                  {drawerCategory && TAG_DATABASE[drawerCategory.toLowerCase()] && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <DrawerTagSection 
                        title={`${drawerCategory.toUpperCase()} 추천 태그`} 
                        tags={TAG_DATABASE[drawerCategory.toLowerCase()]}
                        onSelect={(tag) => {
                          if (selectedBlockIndex !== null) {
                            const newBlocks = [...currentBlocks];
                            newBlocks[selectedBlockIndex].text = tag;
                            setCurrentBlocks(newBlocks);
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* 나머지 전체 라이브러리 (필터링된 것 제외) */}
                  <div className="mt-4 pt-8 border-t border-slate-800/50">
                    <h4 className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-6">전체 라이브러리</h4>
                    <div className="flex flex-col gap-8">
                      {Object.entries(TAG_DATABASE)
                        .filter(([cat]) => cat !== (drawerCategory?.toLowerCase() || ""))
                        .map(([cat, tags]) => (
                          <DrawerTagSection 
                            key={cat}
                            title={`${cat} library`} 
                            tags={tags}
                            onSelect={(tag) => {
                              if (selectedBlockIndex !== null) {
                                const newBlocks = [...currentBlocks];
                                newBlocks[selectedBlockIndex].text = tag;
                                newBlocks[selectedBlockIndex].category = cat;
                                setCurrentBlocks(newBlocks);
                                setDrawerCategory(cat); // 선택한 카테고리로 위쪽 추천 태그 업데이트
                              }
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

function LayerSlot({ 
  id, 
  label, 
  icon: Icon, 
  data, 
  weights, 
  onUpload, 
  onRemove, 
  onWeightChange 
}: { 
  id: string, 
  label: string, 
  icon: any, 
  data: string | null, 
  weights: any, 
  onUpload: (e: any) => void, 
  onRemove: () => void,
  onWeightChange: (wKey: string, val: number) => void
}) {
  return (
    <div className="glass-card border-slate-800 p-5 flex flex-col gap-4 relative group hover:border-slate-700/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-brand-yellow/10 transition-colors">
            <Icon size={14} className="text-brand-yellow" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
        </div>
        {data && (
          <button onClick={onRemove} className="p-1.5 hover:bg-rose-500/20 rounded-md transition-colors">
            <X size={14} className="text-slate-500 hover:text-rose-400" />
          </button>
        )}
      </div>

      <div className="relative h-[140px] rounded-xl overflow-hidden border-2 border-dashed border-slate-800 group-hover:border-brand-yellow/30 transition-all bg-slate-950/30">
        {data ? (
          <Image src={data} alt={label} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 group-hover:text-slate-400 transition-colors">
            <div className="p-3 bg-slate-900 rounded-full mb-3 border border-slate-800 group-hover:border-brand-yellow/20 group-hover:bg-brand-yellow/5">
              <UploadCloud size={20} className="group-hover:text-brand-yellow transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Upload Source</span>
            <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-1">
        <WeightSlider label="Structure" value={weights.structure} onChange={(v) => onWeightChange('structure', v)} />
        <WeightSlider label="Color" value={weights.color} onChange={(v) => onWeightChange('color', v)} />
        <WeightSlider label="Style" value={weights.style} onChange={(v) => onWeightChange('style', v)} />
      </div>
    </div>
  );
}

function WeightSlider({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider font-mono">{label}</span>
        <span className="text-[10px] font-black text-brand-yellow underline decoration-brand-yellow/30 underline-offset-4">{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-yellow transition-all"
      />
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-5 text-[11px] font-black uppercase tracking-widest transition-all
        ${active ? 'text-brand-yellow border-b-2 border-brand-yellow bg-slate-900/80 shadow-[inset_0_-20px_30px_rgba(252,211,77,0.02)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}
