"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, PlayCircle, Image as ImageIcon, Camera } from "lucide-react";
import { useToast } from "./Toast";

export default function PromptLabClient() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [activeTab, setActiveTab] = useState<"midjourney" | "nanobanana">("midjourney");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '분석에 실패했습니다');
      }

      const data = await response.json();
      setResults(data);
      toast("AI 분석이 완료되었습니다!", "success");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : '분석 오류가 발생했습니다';
      toast(`분석 오류: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} 복사 완료!`, "copy");
  };

  return (
    <>
      {/* 업로드 영역 */}
      <div className="glass-card w-full p-8 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-700 hover:border-brand-yellow/50 transition-colors relative h-[300px] overflow-hidden group">
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={handleImageUpload}
        />

        {image ? (
          <Image 
            src={image} 
            alt="업로드된 이미지" 
            fill 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" 
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400 gap-4">
            <div className="p-4 bg-slate-800 rounded-full shadow-lg">
              <UploadCloud size={32} className="text-brand-yellow" />
            </div>
            <p className="font-bold tracking-wider uppercase text-sm">이미지를 여기에 끌어다 놓으세요</p>
            <p className="text-xs text-slate-500">JPG, PNG 최대 5MB</p>
          </div>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!image || loading}
        className="w-full bg-brand-yellow text-slate-900 font-black py-4 rounded-xl text-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(252,211,77,0.2)] transition-all flex items-center justify-center gap-3"
      >
        {loading ? (
          <><Loader2 className="animate-spin" /> 이미지 분석 / 프롬프트 변형 중...</>
        ) : (
          "🔬 이미지 분석 시작"
        )}
      </button>

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

                {/* 영어 프롬프트 */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-inner">
                  <h3 className="text-xs uppercase text-brand-yellow font-bold mb-2 tracking-widest flex items-center justify-between">
                    최종 영어 프롬프트
                    <button className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                      onClick={() => handleCopy(results[activeTab]?.english || "", "영어 프롬프트")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      복사하기
                    </button>
                  </h3>
                  <p className="text-slate-200 font-mono text-base leading-relaxed break-words whitespace-pre-wrap">
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
          </div>
        </div>
      )}
    </>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all
        ${active ? 'text-brand-yellow border-b-2 border-brand-yellow bg-slate-800/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}
