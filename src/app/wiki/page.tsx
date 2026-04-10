import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function WikiPage() {
  return (
    <main className="min-h-screen pb-24">
      <Navigation />
      
      {/* Wiki Header */}
      <section className="pt-40 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-black text-slate-100 mb-6 tracking-tighter">
          위키 가이드
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl font-medium break-keep">
          브랜드 디자인의 정밀한 설계도, 프롬프트 엔진의 기준
        </p>
      </section>

      {/* ───── Cross-Platform Synergy Guide ───── */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <span className="text-brand-yellow">/</span> 통합 작업 시너지 가이드
          </h2>
        </div>
        <div className="glass-card p-8 md:p-10 border-brand-yellow/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/5 rounded-full blur-[120px]" />
          <div className="relative z-10">
            <p className="text-sm text-slate-400 mb-8 max-w-3xl break-keep">
              브랜드 디자인팀 전용 워크플로우: <strong className="text-slate-200">프롬프트 설계소 V2</strong>의 하이브리드 비전(이미지+스타일 병합)과 스마트 블록 교체 시스템을 기반으로, <strong className="text-slate-200">미드저니</strong>로 스타일 키워드를 추출하고, <strong className="text-slate-200">나노바나나</strong>로 정밀 편집·보정한 뒤, <strong className="text-slate-200">힉스필드</strong>로 모션과 사운드를 부여하는 차세대 파이프라인입니다.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1: Midjourney */}
              <div className="relative bg-slate-800/50 rounded-2xl p-6 border border-blue-500/20">
                <div className="absolute -top-3 left-5">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Step 1</span>
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                    <span className="text-lg font-black text-white">M</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-blue-300">미드저니</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">스타일 추출</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                  6단계 압축형 공식으로 핵심 스타일 키워드를 추출합니다. 주제 → 매체 → 환경 → 조명 → 구도 → 파라미터.
                </p>
                <div className="bg-slate-900/80 rounded-lg px-3 py-2 border border-slate-700">
                  <code className="text-[10px] text-blue-400 font-mono">
                    samurai, editorial photo, misty forest, Rembrandt lighting, 85mm --ar 2:3 --s 400
                  </code>
                </div>
              </div>

              {/* Step 2: Nanobanana */}
              <div className="relative bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
                <div className="absolute -top-3 left-5">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-700 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Step 2</span>
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                    <span className="text-lg font-black text-white">N</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-purple-300">나노바나나</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">정밀 편집</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                  4단계 보존 공식(유지 → 변경 → 방법 → 제약)으로 스타일은 유지하면서 배경·소품·조명을 세밀하게 보정합니다.
                </p>
                <div className="bg-slate-900/80 rounded-lg px-3 py-2 border border-slate-700">
                  <code className="text-[10px] text-purple-400 font-mono">
                    maintain: face, pose | change: background → art museum | method: marble floor, spot lights
                  </code>
                </div>
              </div>

              {/* Step 3: Higsfield */}
              <div className="relative bg-slate-800/50 rounded-2xl p-6 border border-emerald-500/20">
                <div className="absolute -top-3 left-5">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Step 3</span>
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                    <span className="text-lg font-black text-white">H</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-emerald-300">힉스필드</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">모션 부여</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                  완성된 스틸컷을 Hero Frame으로 업로드하고 카메라 무빙·속도 곡선·사운드를 지정하여 생동감을 부여합니다.
                </p>
                <div className="bg-slate-900/80 rounded-lg px-3 py-2 border border-slate-700">
                  <code className="text-[10px] text-emerald-400 font-mono">
                    Camera: Dolly In | Lens: 85mm f/2 | Motion: 6/10 | Audio: ambient forest SFX
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Platform Guides ───── */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <span className="text-brand-yellow">/</span> 플랫폼별 가이드
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Midjourney Guide Card */}
          <Link href="/wiki/midjourney" className="group">
            <div className="glass-card p-6 border-blue-500/20 hover:border-blue-500/50 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-white">M</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-blue-300 transition-colors">미드저니 (Midjourney)</h3>
                    <p className="text-xs text-slate-500">v6.1 대응 · 올인원 가이드</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  6단계 프롬프트 공식, 필수 명령어 · 파라미터 사전, 상황별 실전 프리셋까지 수록된 통합 가이드
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold group-hover:gap-3 transition-all">
                가이드 보기 →
              </div>
            </div>
          </Link>

          {/* Nanobanana Guide Card */}
          <Link href="/wiki/nanobanana" className="group">
            <div className="glass-card p-6 border-purple-500/20 hover:border-purple-500/50 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-white">N</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-purple-300 transition-colors">나노바나나 (Nano Banana)</h3>
                    <p className="text-xs text-slate-500">Pro & V2 상업 광고</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  극사실주의 질감, Case 37 제품 교체 로직 등 하이엔드 상업 광고 퀄리티 전용 가이드
                </p>
              </div>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-bold group-hover:gap-3 transition-all">
                가이드 보기 →
              </div>
            </div>
          </Link>

          {/* Higsfield Guide Card — NOW ACTIVE */}
          <Link href="/wiki/higsfield" className="group">
            <div className="glass-card p-6 border-emerald-500/20 hover:border-emerald-500/50 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-white">H</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-emerald-300 transition-colors">힉스필드 (Higsfield)</h3>
                    <p className="text-xs text-slate-500">Cinema Studio 2.5 대응</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  10대 메뉴 마스터, 모션 제어 용어 사전, Cinema Studio 2.5 딥다이브 및 실전 프리셋
                </p>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold group-hover:gap-3 transition-all">
                가이드 보기 →
              </div>
            </div>
          </Link>

          {/* Weavy Guide Card — NOW ACTIVE */}
          <Link href="/wiki/weavy" className="group">
            <div className="glass-card p-6 border-amber-500/20 hover:border-amber-500/50 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-white">W</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-amber-300 transition-colors">위비 (Weavy)</h3>
                    <p className="text-xs text-slate-500">노드 기반 워크플로우</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  노드 그래프, ControlNet, 업스케일러, 전문 용어 사전 및 단계별 워크플로우 가이드
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold group-hover:gap-3 transition-all">
                가이드 보기 →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ───── AI Model Master Library ───── */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <span className="text-brand-yellow">/</span> AI 모델 마스터 라이브러리
          </h2>
        </div>
        
        <div className="space-y-16">
          {/* Image Models */}
          <div>
            <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-yellow rounded-full"></span>
              이미지 모델 라이브러리 (Image Models)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card p-6 border-slate-700/50 hover:border-brand-yellow/50 transition-colors">
                <h4 className="text-lg font-bold text-brand-yellow mb-4">전문 시네마틱/패션</h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Higgsfield Soul 2.0</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">NEW</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">초현실적 패션 화보 및 고품질 질감 표현 특화</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Higgsfield Soul Cinema</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400">TOP</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">압도적인 영화적 미학과 깊이감 있는 룩 앤 필 구현</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Flux Pro 1.1 Ultra</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">극사실주의 표면 디테일과 완벽한 빛의 산란 제어</p>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6 border-slate-700/50 hover:border-brand-yellow/50 transition-colors">
                <h4 className="text-lg font-bold text-brand-yellow mb-4">브랜드 디자인/벡터</h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Recraft V4</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400">TOP</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">무손실 벡터 그래픽 및 심볼릭 로고 생성의 뉴 플래그십</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Ideogram V3</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">NEW</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">정밀한 텍스트 렌더링(타이포그래피) 및 캐릭터 마스코트 구축</p>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6 border-slate-700/50 hover:border-brand-yellow/50 transition-colors">
                <h4 className="text-lg font-bold text-brand-yellow mb-4">고성능 범용</h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Nano Banana Pro</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400">TOP</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">4K 해상도의 압도적인 선명도를 자랑하는 상업용 이미지 생성기</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Nano Banana 2</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">초고속 렌더링과 균형 잡힌 퀄리티의 프로토타이핑 엔진</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Imagen 4/3</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">구글의 철저한 프롬프트 이해력을 바탕으로 한 범용 모델</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">GPT Image 1.5</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">복잡한 맥락의 대화형 프롬프트를 정확히 시각화하는 모델</p>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6 border-slate-700/50 hover:border-brand-yellow/50 transition-colors">
                <h4 className="text-lg font-bold text-brand-yellow mb-4">편집 및 최적화</h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Reve</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">인페인팅 및 미세 톤 보정에 특화된 고급 리터칭 엔진</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Topaz</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400">TOP</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">AI 기반의 노이즈 제거 및 무손실 화질 업스케일링</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Flux Fast</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">다량의 아이디에이션을 위한 고속 스케치 및 렌더링 툴</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Nvidia Sana</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">엔비디아 하드웨어 최적화 기반 초고해상도 에셋 생성</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Video Models */}
          <div>
            <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-yellow rounded-full"></span>
              영상 모델 라이브러리 (Video Models)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card p-6 border-slate-700/50 hover:border-brand-yellow/50 transition-colors">
                <h4 className="text-lg font-bold text-brand-yellow mb-4">① 차세대 시네마틱 & 메인스트림</h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Runway Gen-4.5 / Gen-4</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">NEW</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">최신 영상 생성 엔진의 기준이자 물리 시뮬레이션의 정점</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Sora 2 (OpenAI)</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400">TOP</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">가장 진보된 물리 엔진 기반의 장시간 고해상도 영상 모델</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Google Veo 3.1 / 2</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">텍스트 및 이미지 기반의 정교한 시각·음향 동기화 생성</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Kling 3.0 / 2.6</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">NEW</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">오디오가 포함된 압도적 화질의 전문 시네마틱 영상 제작</p>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6 border-slate-700/50 hover:border-brand-yellow/50 transition-colors">
                <h4 className="text-lg font-bold text-brand-yellow mb-4">② 정밀 모션 제어 & VFX</h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Kling 3.0 Motion Control</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">NEW</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">비디오의 움직임을 특정 이미지로 전이시키는 핵심 제어 기술</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Higgsfield DOP / Video</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400">TOP</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">VFX 및 정밀한 카메라 워킹(Camera Control) 설계 특화</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Kling 01 Edit</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">전문가 수준의 영상 리터칭 및 영역 편집 전용 모델</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Kling First & Last Frame</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">시작과 끝 프레임을 지정하여 정교한 화면 흐름 생성</p>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6 border-slate-700/50 hover:border-brand-yellow/50 transition-colors">
                <h4 className="text-lg font-bold text-brand-yellow mb-4">③ 스토리텔링 & 특수 목적</h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Wan 2.6 / 2.5 / 2.2</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400">TOP</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">멀티샷 시네마틱 구성 및 스토리텔링 워크플로우 최적화</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Minimax Video Director</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">고역동성(High-dynamic) 액션 및 디렉팅 중심 영상 모델</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Seedance 1.5 Pro</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">프로급 오디오-비주얼 동기화 및 SFX 자동 생성 지원</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Kling Avatars 2.0</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">NEW</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">차세대 립싱크 및 자연스러운 대화형 아바타 생성</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Pixverse 6 / 6 Extend</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">NEW</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">기존 영상의 매끄러운 연장 및 확장에 특화된 최신 모델</p>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6 border-slate-700/50 hover:border-brand-yellow/50 transition-colors">
                <h4 className="text-lg font-bold text-brand-yellow mb-4">④ 고속 및 유틸리티</h4>
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Luma Ray 2 / 2 Flash</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-400">TOP</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">매우 빠른 렌더링 속도를 자랑하는 실무 프로토타이핑용</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Grok Imagine Video</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">오디오가 동기화된 시네마틱 영상 탐색 및 고속 추출</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">Hunyuan / Moonvalley</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">다양한 화풍과 스타일의 고속 영상 생성 지원</p>
                  </li>
                  <li>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200 text-sm">LTX 2 Video</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">저지연 환경에서의 효율적인 영상 에셋 렌더링</p>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
