import Navigation from "@/components/Navigation";
import MidjourneyGuideClient from "@/components/MidjourneyGuideClient";

export default function MidjourneyGuidePage() {
  return (
    <main className="min-h-screen pb-24">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          MIDJOURNEY v6.1 대응
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-100 mb-6 tracking-tighter leading-tight">
          미드저니 통합{" "}
          <span className="bg-gradient-to-r from-brand-yellow to-yellow-600 bg-clip-text text-transparent">
            용어 사전 & 사용 설명서
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl font-medium break-keep">
          6단계 프롬프트 공식, 필수 명령어 · 파라미터 사전, 그리고 상황별 실전 프리셋까지.
          미드저니 마스터를 위한 올인원 레퍼런스입니다.
        </p>
      </section>

      {/* Guide Content */}
      <section className="max-w-5xl mx-auto px-6">
        <MidjourneyGuideClient />
      </section>
    </main>
  );
}
