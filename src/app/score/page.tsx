import Navigation from "@/components/Navigation";
import ScoreRefineClient from "@/components/ScoreRefineClient";

export default function ScoreRefinePage() {
  return (
    <main className="min-h-screen pb-24 bg-slate-950 flex flex-col">
      <Navigation />
      
      <section className="pt-32 px-6 max-w-4xl mx-auto flex-1 w-full flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-4 tracking-tight">
            100점 프롬프트 메이커
          </h1>
          <p className="text-slate-400 font-medium">
            AI가 현재 프롬프트의 품질을 진단하고, 대화를 통해 100점짜리 마스터피스로 개선해드립니다.
          </p>
        </div>

        <ScoreRefineClient />
      </section>
    </main>
  );
}
