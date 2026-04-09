import Navigation from "@/components/Navigation";
import PromptGalleryClient from "@/components/PromptGalleryClient";

export default function Home() {
  return (
    <main className="min-h-screen pb-24">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-100 mb-6 tracking-tighter leading-tight">
          브랜드 디자인팀을 위한 프롬프트 설계도, <br />
          <span className="bg-gradient-to-r from-brand-yellow to-yellow-600 bg-clip-text text-transparent">
            프롬프트 엔진의 기준
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium mb-12 break-keep">
          실시간 최신 트렌드를 반영한 미드저니와 나노바나나의 완벽한 프롬프트들을 탐색하고 내 작업에 복사해 보세요.
        </p>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6">
        <PromptGalleryClient />
      </section>
    </main>
  );
}
