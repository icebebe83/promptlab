"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Zap, Loader2, RotateCcw, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "./Toast";

type Phase = "idle" | "diagnose" | "coaching" | "finalize";

type CollectedInfo = {
  subject?: string;
  medium?: string;
  environment?: string;
  lighting?: string;
  composition?: string;
  details?: string;
  parameters?: string;
};

type Message = {
  role: "system" | "user" | "ai";
  content: string;
  rawJson?: string;
  metadata?: {
    phase?: Phase;
    score?: number;
    question?: string;
    choiceA?: string;
    choiceB?: string;
    missingAxes?: string[];
    collectedInfo?: CollectedInfo;
    finalMidjourney?: string;
    finalNanobanana?: string;
    designIntent?: string;
  };
};

// Score gauge axis labels
const axisLabels: Record<string, string> = {
  subject: "피사체",
  medium: "매체/스타일",
  environment: "환경/배경",
  lighting: "조명/색감",
  composition: "구도/카메라",
  details: "디테일/질감",
  parameters: "파라미터",
};

const ALL_AXES = ["subject", "medium", "environment", "lighting", "composition", "details", "parameters"];

export default function ScoreRefineClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "✨ Masterpiece Maker에 오신 걸 환영합니다!\n\n개선하고 싶은 프롬프트를 입력해 주세요. AI 코치가 대화를 통해 부족한 요소를 하나씩 채워 100점짜리 마스터피스로 완성시켜 드립니다.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [collectedInfo, setCollectedInfo] = useState<CollectedInfo>({});
  const [missingAxes, setMissingAxes] = useState<string[]>(ALL_AXES);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Animated score counter
  useEffect(() => {
    if (displayScore === currentScore) return;
    const step = currentScore > displayScore ? 1 : -1;
    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        const next = prev + step;
        if ((step > 0 && next >= currentScore) || (step < 0 && next <= currentScore)) {
          clearInterval(interval);
          return currentScore;
        }
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [currentScore, displayScore]);

  const handleReset = () => {
    setMessages([
      {
        role: "system",
        content: "✨ Masterpiece Maker에 오신 걸 환영합니다!\n\n개선하고 싶은 프롬프트를 입력해 주세요. AI 코치가 대화를 통해 부족한 요소를 하나씩 채워 100점짜리 마스터피스로 완성시켜 드립니다.",
      },
    ]);
    setCurrentScore(0);
    setDisplayScore(0);
    setPhase("idle");
    setCollectedInfo({});
    setMissingAxes(ALL_AXES);
  };

  const handleSend = async (userText?: string) => {
    const userMessage = (userText || input).trim();
    if (!userMessage || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history
      const history = messages
        .filter((m) => m.role === "user" || m.role === "ai")
        .map((m) => ({
          role: m.role,
          content: m.role === "ai" ? (m.rawJson || m.content) : m.content,
        }));

      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          history,
          collectedInfo,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "코칭에 실패했습니다");
      }

      const data = await response.json();
      const rawJson = JSON.stringify(data);

      // Update state
      const newScore = data.score || currentScore;
      setCurrentScore(newScore);
      if (data.phase) setPhase(data.phase);
      if (data.collectedInfo) {
        setCollectedInfo((prev) => ({ ...prev, ...data.collectedInfo }));
      }
      if (data.missingAxes) setMissingAxes(data.missingAxes);

      const aiResponse: Message = {
        role: "ai",
        content: data.message || "분석이 완료되었습니다.",
        rawJson,
        metadata: {
          phase: data.phase,
          score: newScore,
          question: data.question,
          choiceA: data.choiceA,
          choiceB: data.choiceB,
          missingAxes: data.missingAxes,
          collectedInfo: data.collectedInfo,
          finalMidjourney: data.finalMidjourney,
          finalNanobanana: data.finalNanobanana,
          designIntent: data.designIntent,
        },
      };

      setMessages((prev) => [...prev, aiResponse]);

      if (data.phase === "finalize") {
        toast("🎉 100점 마스터피스가 완성되었습니다!", "success");
      }
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `오류: ${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceClick = (choice: string) => {
    handleSend(choice);
  };

  const copyPrompt = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} 복사 완료!`, "copy");
  };

  // Score color
  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-emerald-400";
    if (s >= 70) return "text-brand-yellow";
    if (s >= 40) return "text-orange-400";
    return "text-rose-400";
  };

  const getGaugeColor = (s: number) => {
    if (s >= 90) return "from-emerald-500 to-emerald-400";
    if (s >= 70) return "from-brand-yellow to-yellow-400";
    if (s >= 40) return "from-orange-500 to-orange-400";
    return "from-rose-500 to-rose-400";
  };

  const getGaugeBg = (s: number) => {
    if (s >= 90) return "shadow-emerald-500/30";
    if (s >= 70) return "shadow-brand-yellow/30";
    if (s >= 40) return "shadow-orange-500/30";
    return "shadow-rose-500/30";
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden glass-card shadow-2xl relative min-h-[700px] mb-10">
      
      {/* ===== TOP: Score Gauge Bar ===== */}
      <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-brand-yellow" />
            <span className="text-xs uppercase font-black tracking-[0.2em] text-slate-400">MASTERPIECE SCORE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-4xl font-black tabular-nums transition-colors duration-500 ${getScoreColor(displayScore)}`}>
              {displayScore}
            </span>
            <span className="text-slate-600 font-bold text-lg">/100</span>
          </div>
        </div>
        
        {/* Progress gauge */}
        <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getGaugeColor(displayScore)} transition-all duration-700 ease-out shadow-lg ${getGaugeBg(displayScore)}`}
            style={{ width: `${Math.min(displayScore, 100)}%` }}
          />
          {/* Glow pulse at the tip */}
          {displayScore > 0 && displayScore < 100 && (
            <div 
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/40 blur-sm animate-pulse transition-all duration-700`}
              style={{ left: `${Math.min(displayScore, 100)}%`, transform: `translate(-50%, -50%)` }}
            />
          )}
        </div>

        {/* Axis completion indicators */}
        <div className="flex flex-wrap gap-2 mt-3">
          {ALL_AXES.map((axis) => {
            const isCollected = collectedInfo[axis as keyof CollectedInfo];
            const isMissing = missingAxes.includes(axis);
            return (
              <span
                key={axis}
                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border transition-all duration-500 ${
                  isCollected 
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                    : isMissing 
                    ? "bg-slate-800/50 text-slate-600 border-slate-700/50" 
                    : "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/30"
                }`}
              >
                {isCollected && <span className="mr-1">✓</span>}
                {axisLabels[axis] || axis}
              </span>
            );
          })}
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 flex items-center gap-1.5 text-[10px] text-slate-600 hover:text-slate-300 transition-colors uppercase font-black tracking-wider"
        >
          <RotateCcw size={12} />
          RESET
        </button>
      </div>

      {/* ===== MESSAGES AREA ===== */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex max-w-[92%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
            {/* Avatar */}
            {msg.role !== "system" && (
              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
                msg.role === "user" 
                  ? "bg-slate-700/80 ml-3" 
                  : "bg-gradient-to-br from-brand-yellow to-yellow-500 text-slate-900 mr-3 shadow-lg shadow-brand-yellow/20"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={18} />}
              </div>
            )}

            {/* Bubble */}
            <div className={`flex flex-col gap-3 w-full ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-5 py-4 rounded-2xl text-sm leading-relaxed font-medium shadow-md whitespace-pre-wrap ${
                  msg.role === "system"
                    ? "bg-gradient-to-br from-blue-900/30 to-purple-900/20 text-blue-200 border border-blue-800/40"
                    : msg.role === "user"
                    ? "bg-slate-800 text-slate-200 rounded-br-md"
                    : "bg-slate-800/60 text-slate-300 border border-slate-700/40 rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>

              {/* AI Question Card with Choices */}
              {msg.metadata?.question && msg.metadata.phase !== "finalize" && (
                <div className="w-full max-w-[520px] bg-slate-950/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                  {/* Question */}
                  <div className="px-5 py-4 border-b border-slate-800/50">
                    <p className="text-sm font-bold text-white leading-relaxed">
                      💬 {msg.metadata.question}
                    </p>
                  </div>
                  
                  {/* A/B Choice Buttons */}
                  {msg.metadata.choiceA && msg.metadata.choiceB && (
                    <div className="p-4 flex flex-col gap-2.5">
                      <button
                        onClick={() => handleChoiceClick(msg.metadata!.choiceA!)}
                        disabled={loading}
                        className="w-full text-left px-5 py-4 rounded-xl bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/20 hover:border-blue-500/40 text-slate-200 text-sm font-medium transition-all active:scale-[0.98] group disabled:opacity-50"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-black text-xs mr-3 group-hover:bg-blue-500/30 transition-colors">A</span>
                        {msg.metadata.choiceA}
                      </button>
                      <button
                        onClick={() => handleChoiceClick(msg.metadata!.choiceB!)}
                        disabled={loading}
                        className="w-full text-left px-5 py-4 rounded-xl bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-500/40 text-slate-200 text-sm font-medium transition-all active:scale-[0.98] group disabled:opacity-50"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 font-black text-xs mr-3 group-hover:bg-purple-500/30 transition-colors">B</span>
                        {msg.metadata.choiceB}
                      </button>
                      <p className="text-[10px] text-slate-600 text-center mt-1 uppercase tracking-widest font-bold">
                        또는 직접 입력으로 자유롭게 답변하세요
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ===== FINALIZE: Final Prompt Cards ===== */}
              {msg.metadata?.phase === "finalize" && (
                <div className="w-full max-w-[600px] space-y-4 mt-2">
                  {/* Achievement Banner */}
                  <div className="bg-gradient-to-r from-emerald-900/30 to-brand-yellow/10 border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-brand-yellow flex items-center justify-center shadow-xl shadow-emerald-500/30 shrink-0">
                      <CheckCircle2 size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white mb-1">🏆 Masterpiece Complete!</h3>
                      <p className="text-xs text-slate-400 font-medium">
                        대화를 통해 수집한 모든 요소가 반영된 프로페셔널 프롬프트입니다.
                      </p>
                    </div>
                  </div>

                  {/* Midjourney 6-Step Card */}
                  {msg.metadata.finalMidjourney && (
                    <FinalPromptCard
                      platform="MIDJOURNEY"
                      subtitle="6-STEP FORMULA"
                      color="blue"
                      prompt={msg.metadata.finalMidjourney}
                      onCopy={() => copyPrompt(msg.metadata!.finalMidjourney!, "Midjourney 프롬프트")}
                    />
                  )}

                  {/* Nanobanana 7-Step Card */}
                  {msg.metadata.finalNanobanana && (
                    <FinalPromptCard
                      platform="NANOBANANA"
                      subtitle="7-STEP NARRATIVE"
                      color="purple"
                      prompt={msg.metadata.finalNanobanana}
                      onCopy={() => copyPrompt(msg.metadata!.finalNanobanana!, "Nanobanana 프롬프트")}
                    />
                  )}

                  {/* Design Intent */}
                  {msg.metadata.designIntent && (
                    <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-3 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-[8px] text-blue-400">韓</span>
                        한국어 해석 · 디자인 의도 요약
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed font-medium whitespace-pre-line">
                        {msg.metadata.designIntent}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="self-start flex items-center gap-3">
            <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-brand-yellow to-yellow-500 text-slate-900 mr-3 shadow-lg shadow-brand-yellow/20">
              <Bot size={18} />
            </div>
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-800/60 border border-slate-700/40 rounded-bl-md">
              <Loader2 size={16} className="animate-spin text-brand-yellow" />
              <span className="text-sm text-slate-400 font-medium">
                {phase === "idle" ? "프롬프트 진단 중..." : phase === "finalize" ? "마스터피스 최종 조립 중..." : "다음 코칭 질문 준비 중..."}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== INPUT BAR ===== */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            phase === "idle"
              ? "개선할 프롬프트를 입력하세요... (예: a cat in a neon-lit Tokyo alley)"
              : phase === "finalize"
              ? "새로운 프롬프트로 다시 시작하려면 입력하세요..."
              : "A/B 선택지를 클릭하거나, 직접 답변을 입력하세요..."
          }
          className="flex-1 bg-slate-950 text-slate-200 border-none outline-none ring-0 placeholder:text-slate-600 px-6 py-4 rounded-full text-sm font-medium focus:ring-1 focus:ring-slate-700 transition-all"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="bg-brand-yellow text-slate-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-yellow-400 disabled:opacity-30 transition-all shrink-0 shadow-lg shadow-brand-yellow/20"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="translate-x-[1px]" />}
        </button>
      </div>
    </div>
  );
}

// ===== Subcomponent: Final Prompt Card =====
function FinalPromptCard({ 
  platform, subtitle, color, prompt, onCopy 
}: { 
  platform: string; subtitle: string; color: "blue" | "purple"; prompt: string; onCopy: () => void;
}) {
  const borderColor = color === "blue" ? "border-blue-500/30" : "border-purple-500/30";
  const bgColor = color === "blue" ? "bg-blue-900/10" : "bg-purple-900/10";
  const badgeBg = color === "blue" ? "bg-blue-600" : "bg-purple-600";
  const textColor = color === "blue" ? "text-blue-300" : "text-purple-300";

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl overflow-hidden shadow-xl group relative`}>
      <div className="px-5 py-3 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`${badgeBg} text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider`}>
            {platform}
          </span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{subtitle}</span>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all font-bold uppercase tracking-wider"
        >
          <Copy size={11} />
          COPY
        </button>
      </div>
      <div className="p-5">
        <p className={`text-sm font-mono ${textColor} leading-relaxed break-words whitespace-pre-wrap selection:bg-brand-yellow/30`}>
          {prompt}
        </p>
      </div>
    </div>
  );
}
