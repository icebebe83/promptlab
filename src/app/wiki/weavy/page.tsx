import Navigation from "@/components/Navigation";
import WeavyGuideClient from "@/components/WeavyGuideClient";

export default function WeavyGuidePage() {
  return (
    <main className="min-h-screen pb-24">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          노드 기반 비주얼 워크플로우
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-100 mb-6 tracking-tighter leading-tight">
          위비 통합{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            워크플로우 가이드 & 용어 사전
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl font-medium break-keep">
          노드 캔버스, ControlNet 구조 통제, 업스케일 파이프라인, 실전 용어 사전까지.
          노드의 연결(Flow)을 통해 이미지를 설계하는 프로 레퍼런스입니다.
        </p>
      </section>

      {/* Guide Content */}
      <section className="max-w-5xl mx-auto px-6">
        <WeavyGuideClient />
      </section>
    </main>
  );
}
