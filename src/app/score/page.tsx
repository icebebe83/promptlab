import Navigation from "@/components/Navigation";
import ScoreRefineClient from "@/components/ScoreRefineClient";

export default function ScoreRefinePage() {
  return (
    <main className="min-h-screen pb-24 bg-slate-950 flex flex-col">
      <Navigation />
      
      <section className="pt-32 px-6 max-w-4xl mx-auto flex-1 w-full flex flex-col">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/20 px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow">Interactive Coaching Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-4 tracking-tight">
            Masterpiece Maker
          </h1>
          <p className="text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            AI 코치와의 대화를 통해 프롬프트의 부족한 요소를 하나씩 채워 나가며, 미드저니 & 나노바나나 100점짜리 마스터피스를 완성하세요.
          </p>
        </div>

        <ScoreRefineClient />
      </section>
    </main>
  );
}
