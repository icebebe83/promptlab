import Navigation from "@/components/Navigation";
import HigsfieldGuideClient from "@/components/HigsfieldGuideClient";

export default function HigsfieldGuidePage() {
  return (
    <main className="min-h-screen pb-24">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          CINEMA STUDIO 2.5 대응
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-100 mb-6 tracking-tighter leading-tight">
          힉스필드 통합{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            사용 설명서 & 용어 사전
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl font-medium break-keep">
          10대 메뉴 마스터, 모션 제어 용어 사전, Cinema Studio 2.5 딥다이브까지.
          AI 영상 생성을 감독처럼 제어하는 올인원 레퍼런스입니다.
        </p>
      </section>

      {/* Guide Content */}
      <section className="max-w-5xl mx-auto px-6">
        <HigsfieldGuideClient />
      </section>
    </main>
  );
}
