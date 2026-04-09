import Navigation from "@/components/Navigation";
import NanoBananaGuideClient from "@/components/NanoBananaGuideClient";

export default function NanoBananaGuidePage() {
  return (
    <main className="min-h-screen pb-24">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          NANO BANANA 7단계 공식
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-100 mb-6 tracking-tighter leading-tight">
          나노바나나 통합{" "}
          <span className="bg-gradient-to-r from-brand-yellow to-yellow-600 bg-clip-text text-transparent">
            조건 및 사용 설명서
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl font-medium break-keep">
          7단계 생성 공식과 4단계 정밀 편집법, 필수 메뉴 활용부터 상황별 프리셋까지. 
          의도대로 완벽하게 제어하는 나노바나나 마스터 가이드입니다.
        </p>
      </section>

      {/* Guide Content */}
      <section className="max-w-5xl mx-auto px-6">
        <NanoBananaGuideClient />
      </section>
    </main>
  );
}
