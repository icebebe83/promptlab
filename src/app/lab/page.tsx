import Navigation from "@/components/Navigation";
import PromptLabClient from "@/components/PromptLabClient";

export default function PromptLabPage() {
  return (
    <main className="min-h-screen pb-24 bg-slate-950">
      <Navigation />
      
      <section className="pt-32 px-6 max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
        
        {/* Left: Upload and Info */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6">
          <div className="text-left mb-4">
            <h1 className="text-4xl font-black text-slate-100 mb-4 tracking-tight">
              프롬프트 연구소
            </h1>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              이미지를 업로드하면 AI가 피사체, 스타일, 조명, 카메라 정보를 역분석하여 Midjourney, Nanobanana에 최적화된 프롬프트를 생성합니다.
            </p>
          </div>
          <PromptLabClient />
        </div>

        {/* Right: Results Dashboard (Rendered inside Client) */}
        
      </section>
    </main>
  );
}
