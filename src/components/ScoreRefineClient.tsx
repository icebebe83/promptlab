"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap, Loader2, RotateCcw } from "lucide-react";
import { useToast } from "./Toast";

type Platform = "midjourney" | "nanobanana";
type Mode = "generation" | "editing";

type BadgeMap = Record<string, string>;

type Message = {
  role: "system" | "user" | "ai";
  content: string;
  rawJson?: string; // keep raw AI response for history
  metadata?: {
    score?: number;
    badges?: BadgeMap;
    revisedPrompt?: string;
    suggestions?: string[];
  };
};

export default function ScoreRefineClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "진단할 초기 프롬프트를 입력해 주세요.\n예: 'a cat sitting on a rooftop in Tokyo at sunset'",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<Platform>("midjourney");
  const [mode, setMode] = useState<Mode>("generation");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReset = () => {
    setMessages([
      {
        role: "system",
        content: "진단할 초기 프롬프트를 입력해 주세요.\n예: 'a cat sitting on a rooftop in Tokyo at sunset'",
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history for multi-turn
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
          platform,
          mode,
          history,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "채점에 실패했습니다");
      }

      const data = await response.json();
      const rawJson = JSON.stringify(data);

      // Extract badge labels based on platform
      const badges: BadgeMap = {};
      if (data.badges) {
        Object.entries(data.badges).forEach(([key, value]) => {
          badges[key] = value as string;
        });
      }

      const aiResponse: Message = {
        role: "ai",
        content: data.reasoning || "분석이 완료되었습니다.",
        rawJson,
        metadata: {
          score: data.score || 0,
          badges: Object.keys(badges).length > 0 ? badges : undefined,
          revisedPrompt: data.revisedPrompt,
          suggestions: data.suggestions,
        },
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `오류가 발생했습니다: ${errorMessage}. .env.local에 GEMINI_API_KEY가 설정되어 있는지 확인해 주세요.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Map badge keys to Korean labels
  const badgeLabelMap: Record<string, string> = {
    // Midjourney
    specificity: "피사체 구체성",
    medium: "매체/스타일",
    environment: "환경/배경",
    lighting: "조명/색감",
    composition: "구도/카메라",
    parameters: "파라미터 활용",
    // Nanobanana Gen
    subject: "① 피사체",
    action: "② 동작/관계",
    background: "③ 배경",
    style: "④ 스타일/매체",
    // composition is shared
    // lighting is shared
    details: "⑦ 핵심 디테일",
    // Nanobanana Edit
    keepClarity: "유지 명확도",
    changeSpecificity: "변경 구체성",
    styleMatch: "스타일 적합도",
    constraints: "제약 명시도",
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden glass-card shadow-2xl relative min-h-[600px] mb-10">
      {/* Platform & Mode Selector */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center gap-4">
        {/* Platform Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">플랫폼</span>
          <div className="flex bg-slate-950 rounded-full p-0.5">
            <button
              onClick={() => setPlatform("midjourney")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                platform === "midjourney"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Midjourney
            </button>
            <button
              onClick={() => setPlatform("nanobanana")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                platform === "nanobanana"
                  ? "bg-yellow-500 text-slate-900 shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Nanobanana
            </button>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RotateCcw size={12} />
          초기화
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8 flex flex-col pt-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex max-w-[90%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
            {/* Avatar */}
            {msg.role !== "system" && (
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-slate-700 ml-4" : "bg-brand-yellow text-slate-900 mr-4"}`}>
                {msg.role === "user" ? <User size={20} /> : <Bot size={22} />}
              </div>
            )}

            {/* Bubble */}
            <div className={`flex flex-col gap-3 w-full ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed font-medium shadow-md whitespace-pre-wrap ${
                  msg.role === "system"
                    ? "bg-blue-900/30 text-blue-200 border border-blue-800/40"
                    : msg.role === "user"
                    ? "bg-slate-800 text-slate-200"
                    : "bg-slate-800/80 text-slate-300 border border-slate-700/50"
                }`}
              >
                {msg.content}
              </div>

              {/* Score Dashboard */}
              {msg.metadata && (
                <div className="mt-2 w-full max-w-[500px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  {/* Score Header */}
                  <div className="bg-slate-900 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-black tracking-widest text-slate-500">
                        {platform === "midjourney" ? "미드저니" : "나노바나나"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap
                        size={16}
                        className={
                          msg.metadata.score! >= 80
                            ? "text-brand-yellow"
                            : msg.metadata.score! >= 50
                            ? "text-orange-500"
                            : "text-rose-500"
                        }
                      />
                      <span
                        className={`text-3xl font-black ${
                          msg.metadata.score! >= 80
                            ? "text-brand-yellow"
                            : msg.metadata.score! >= 50
                            ? "text-orange-500"
                            : "text-rose-500"
                        }`}
                      >
                        {msg.metadata.score}
                      </span>
                      <span className="text-slate-600 font-bold mb-1">/ 100</span>
                    </div>
                  </div>

                  {/* Badges */}
                  {msg.metadata.badges && (
                    <div className="px-5 py-4 flex flex-col gap-3 border-b border-slate-800 bg-slate-900/40">
                      {Object.entries(msg.metadata.badges).map(([key, value]) => (
                        <BadgeListItem
                          key={key}
                          label={badgeLabelMap[key] || key}
                          value={value}
                          status={msg.metadata!.score! >= 80 ? "good" : msg.metadata!.score! >= 50 ? "warning" : "bad"}
                        />
                      ))}
                    </div>
                  )}

                  {/* Revised Prompt */}
                  {msg.metadata.revisedPrompt && (
                    <div className="bg-slate-950 p-5 group relative">
                      <h4 className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">
                        개선된 프롬프트
                      </h4>
                      <p className="text-sm font-mono text-brand-yellow leading-relaxed break-words whitespace-pre-wrap">
                        {msg.metadata.revisedPrompt}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.metadata!.revisedPrompt!);
                          toast("프롬프트가 복사되었습니다!", "copy");
                        }}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded font-bold hover:bg-slate-700 hover:text-white"
                      >
                        복사하기
                      </button>
                    </div>
                  )}

                  {/* Suggestions */}
                  {msg.metadata.suggestions && msg.metadata.suggestions.length > 0 && (
                    <div className="px-5 py-4 border-t border-slate-800 bg-slate-900/20">
                      <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">
                        💡 개선 제안
                      </h4>
                      <div className="flex flex-col gap-2">
                        {msg.metadata.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => setInput(s)}
                            className="text-left text-xs text-slate-400 hover:text-brand-yellow bg-slate-800/50 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all border border-slate-700/30 hover:border-brand-yellow/30"
                          >
                            → {s}
                          </button>
                        ))}
                      </div>
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
            <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-brand-yellow text-slate-900 mr-4">
              <Bot size={22} />
            </div>
            <div className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
              <Loader2 size={16} className="animate-spin text-brand-yellow" />
              <span className="text-sm text-slate-400 font-medium">
                {platform === "midjourney" ? "키워드 압축형" : "7단계 구조화형"} 루브릭으로 채점 중...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            platform === "nanobanana" && mode === "editing"
              ? "편집 프롬프트를 입력하세요... (예: 인물의 얼굴, 헤어스타일은 유지하고 배경을 바꿔줘)"
              : "프롬프트를 입력하세요... (예: a cat in a neon-lit Tokyo alley)"
          }
          className="flex-1 bg-slate-950 text-slate-200 border-none outline-none ring-0 placeholder:text-slate-600 px-6 py-4 rounded-full text-sm font-medium focus:ring-1 focus:ring-slate-700 transition-all"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-brand-yellow text-slate-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-yellow-400 disabled:opacity-50 transition-colors shrink-0"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="translate-x-[1px]" />}
        </button>
      </div>
    </div>
  );
}

function BadgeListItem({ label, value, status }: { label: string; value: string; status: "good" | "warning" | "bad" }) {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "warning":
        return "text-brand-yellow border-brand-yellow/30 bg-brand-yellow/10";
      case "bad":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      default:
        return "text-slate-400 border-slate-700 bg-slate-800";
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-400 font-medium shrink-0">{label}</span>
      <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded border ${getStatusColor()} text-right`}>
        {value}
      </span>
    </div>
  );
}
