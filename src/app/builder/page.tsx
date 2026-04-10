import Navigation from "@/components/Navigation";
import TagBuilderClient from "@/components/TagBuilderClient";
import { wikiData } from "@/data/wikiData";

export default function BuilderPage() {
  // Extract legacy tags from existing wiki structured data
  const legacyCameraTags = wikiData
    .filter((item) => item.category === "lens" || item.category === "angle")
    .map((item) => ({ id: `legacy-${item.id}`, content: item.title, category: "technical", translationKo: item.description.split(":")[0] || item.title }));

  const legacyLightingTags = wikiData
    .filter((item) => item.category === "lighting")
    .map((item) => ({ id: `legacy-${item.id}`, content: item.title, category: "lighting", translationKo: item.description.split(":")[0] || item.title }));

  // ===== PHOTOGRAPHY 모드 태그 세트 =====
  const photoPersonTags = [
    { id: "photo-person-1", content: "Adult Male", category: "person", translationKo: "성인 남성" },
    { id: "photo-person-2", content: "Adult Female", category: "person", translationKo: "성인 여성" },
    { id: "photo-person-3", content: "Young Boy", category: "person", translationKo: "소년" },
    { id: "photo-person-4", content: "Young Girl", category: "person", translationKo: "소녀" },
    { id: "photo-person-5", content: "Elderly Person", category: "person", translationKo: "노인" },
    { id: "photo-person-6", content: "Fashion Model", category: "person", translationKo: "패션 모델" },
    { id: "photo-person-7", content: "Product (Still Life)", category: "person", translationKo: "제품 (정물)" },
  ];

  const photoArt3dTags = [
    { id: "photo-art-1", content: "Hyper-realistic Photography", category: "art3d", translationKo: "초현실 사진" },
    { id: "photo-art-2", content: "Cinematic Film Still", category: "art3d", translationKo: "시네마틱 필름 스틸" },
    { id: "photo-art-3", content: "Editorial Photography", category: "art3d", translationKo: "에디토리얼 사진" },
    { id: "photo-art-4", content: "Studio Photography", category: "art3d", translationKo: "스튜디오 사진" },
    { id: "photo-art-5", content: "Vintage Film Stock", category: "art3d", translationKo: "빈티지 필름" },
  ];

  const photoDesignTags = [
    { id: "photo-design-1", content: "Clean Studio Background", category: "design", translationKo: "클린 스튜디오 배경" },
    { id: "photo-design-2", content: "Blurred Cityscape", category: "design", translationKo: "블러 도시 풍경" },
    { id: "photo-design-3", content: "Nature Forest", category: "design", translationKo: "자연 숲" },
    { id: "photo-design-4", content: "Cinematic Environment", category: "design", translationKo: "시네마틱 환경" },
    { id: "photo-design-5", content: "Luxury Marble Surface", category: "design", translationKo: "럭셔리 대리석 표면" },
    { id: "photo-design-6", content: "Soft Bokeh Background", category: "design", translationKo: "소프트 보케 배경" },
  ];

  const photoCameraTags = [
    { id: "photo-cam-1", content: "14mm Wide Angle", category: "technical", translationKo: "14mm 광각" },
    { id: "photo-cam-2", content: "35mm Standard", category: "technical", translationKo: "35mm 표준" },
    { id: "photo-cam-3", content: "85mm Portrait Lens", category: "technical", translationKo: "85mm 인물 렌즈" },
    { id: "photo-cam-4", content: "200mm Telephoto", category: "technical", translationKo: "200mm 망원" },
    { id: "photo-cam-5", content: "Low Angle", category: "technical", translationKo: "로우 앵글" },
    { id: "photo-cam-6", content: "High Angle", category: "technical", translationKo: "하이 앵글" },
    { id: "photo-cam-7", content: "Dutch Angle", category: "technical", translationKo: "더치 앵글" },
    { id: "photo-cam-8", content: "Bird's Eye View", category: "technical", translationKo: "버즈아이 뷰" },
    { id: "photo-cam-9", content: "DSLR Camera", category: "technical", translationKo: "DSLR 카메라" },
    { id: "photo-cam-10", content: "Leica Photography", category: "technical", translationKo: "라이카 촬영" },
    { id: "photo-cam-11", content: "Mirrorless Camera", category: "technical", translationKo: "미러리스 카메라" },
    ...legacyCameraTags,
  ];

  const photoLightingTags = [
    { id: "photo-light-1", content: "Studio Lighting", category: "lighting", translationKo: "스튜디오 조명" },
    { id: "photo-light-2", content: "Rim Light", category: "lighting", translationKo: "림 라이트" },
    { id: "photo-light-3", content: "Dramatic Chiaroscuro", category: "lighting", translationKo: "드라마틱 명암법" },
    { id: "photo-light-4", content: "Natural Window Light", category: "lighting", translationKo: "자연광 (창문)" },
    { id: "photo-light-5", content: "Cinematic Shadow", category: "lighting", translationKo: "시네마틱 그림자" },
    { id: "photo-light-6", content: "Volumetric Glow", category: "lighting", translationKo: "볼류메트릭 글로우" },
    ...legacyLightingTags,
  ];

  const photoActionTags = [
    { id: "photo-act-1", content: "Looking at Camera", category: "action", translationKo: "카메라를 응시하는" },
    { id: "photo-act-2", content: "Captured in Motion", category: "action", translationKo: "역동적인 동작" },
    { id: "photo-act-3", content: "Standing Elegantly", category: "action", translationKo: "우아하게 서 있는" },
    { id: "photo-act-4", content: "Candid Moment", category: "action", translationKo: "자연스러운 순간" },
    { id: "photo-act-5", content: "High-Fashion Pose", category: "action", translationKo: "하이패션 포즈" },
  ];

  const photoDetailTags = [
    { id: "photo-det-1", content: "High Skin Texture", category: "details", translationKo: "피부 질감 강조" },
    { id: "photo-det-2", content: "Microscopic Surface Detail", category: "details", translationKo: "미세 표면 디테일" },
    { id: "photo-det-3", content: "Sharp Focus", category: "details", translationKo: "선명한 초점" },
    { id: "photo-det-4", content: "Intricate Fabric Weave", category: "details", translationKo: "섬세한 직물 짜임" },
    { id: "photo-det-5", content: "Ultra-High Resolution", category: "details", translationKo: "초고해상도" },
  ];

  // ===== GRAPHIC DESIGN 모드 태그 세트 =====
  const designSubjectTags = [
    { id: "gd-subject-1", content: "Brand Logo", category: "person", translationKo: "브랜드 로고" },
    { id: "gd-subject-2", content: "Product Mockup", category: "person", translationKo: "제품 목업" },
    { id: "gd-subject-3", content: "Abstract Shape", category: "person", translationKo: "추상 형태" },
    { id: "gd-subject-4", content: "Character Mascot", category: "person", translationKo: "캐릭터 마스코트" },
    { id: "gd-subject-5", content: "Typography Composition", category: "person", translationKo: "타이포그래피 구성" },
    { id: "gd-subject-6", content: "Icon Set", category: "person", translationKo: "아이콘 세트" },
  ];

  const designStyleTags = [
    { id: "gd-style-1", content: "Vector Graphic Art", category: "art3d", translationKo: "벡터 그래픽 아트" },
    { id: "gd-style-2", content: "Swiss Style / Helvetica", category: "art3d", translationKo: "스위스 스타일 / 헬베티카" },
    { id: "gd-style-3", content: "Bauhaus Geometric", category: "art3d", translationKo: "바우하우스 기하학" },
    { id: "gd-style-4", content: "3D Isometric Render", category: "art3d", translationKo: "3D 아이소메트릭 렌더" },
    { id: "gd-style-5", content: "Flat Design 2.0", category: "art3d", translationKo: "플랫 디자인 2.0" },
    { id: "gd-style-6", content: "Glassmorphism", category: "art3d", translationKo: "글래스모피즘" },
    { id: "gd-style-7", content: "Neomorphism", category: "art3d", translationKo: "뉴모피즘" },
  ];

  const designLayoutTags = [
    { id: "gd-layout-1", content: "Grid-Based Layout", category: "design", translationKo: "그리드 기반 레이아웃" },
    { id: "gd-layout-2", content: "Minimalist White Space", category: "design", translationKo: "미니멀 여백" },
    { id: "gd-layout-3", content: "Gradient Mesh Background", category: "design", translationKo: "그래디언트 메쉬 배경" },
    { id: "gd-layout-4", content: "Dark Mode UI Canvas", category: "design", translationKo: "다크 모드 UI 캔버스" },
    { id: "gd-layout-5", content: "Geometric Pattern Fill", category: "design", translationKo: "기하학 패턴 채움" },
    { id: "gd-layout-6", content: "Asymmetric Composition", category: "design", translationKo: "비대칭 구성" },
  ];

  const designTechnicalTags = [
    { id: "gd-tech-1", content: "Isometric Perspective", category: "technical", translationKo: "아이소메트릭 원근" },
    { id: "gd-tech-2", content: "Orthographic View", category: "technical", translationKo: "정사영 뷰" },
    { id: "gd-tech-3", content: "Golden Ratio Grid", category: "technical", translationKo: "황금비 그리드" },
    { id: "gd-tech-4", content: "Rule of Thirds", category: "technical", translationKo: "삼분할 법칙" },
    { id: "gd-tech-5", content: "Centered Symmetry", category: "technical", translationKo: "중앙 대칭" },
    { id: "gd-tech-6", content: "Radial Composition", category: "technical", translationKo: "방사형 구성" },
  ];

  const designLightingTags = [
    { id: "gd-light-1", content: "Global Illumination", category: "lighting", translationKo: "글로벌 일루미네이션" },
    { id: "gd-light-2", content: "Ambient Occlusion", category: "lighting", translationKo: "앰비언트 오클루전" },
    { id: "gd-light-3", content: "Flat Even Lighting", category: "lighting", translationKo: "균일 플랫 조명" },
    { id: "gd-light-4", content: "Neon Glow Effect", category: "lighting", translationKo: "네온 글로우 효과" },
    { id: "gd-light-5", content: "Soft Gradient Light", category: "lighting", translationKo: "소프트 그래디언트 빛" },
    { id: "gd-light-6", content: "High Contrast Shadows", category: "lighting", translationKo: "고대비 그림자" },
  ];

  const designActionTags = [
    { id: "gd-act-1", content: "Professionally Arranged", category: "action", translationKo: "전문적으로 배열된" },
    { id: "gd-act-2", content: "Stylishly Floating", category: "action", translationKo: "스타일리시하게 떠 있는" },
    { id: "gd-act-3", content: "Centered on Canvas", category: "action", translationKo: "캔버스 중앙 배치" },
    { id: "gd-act-4", content: "Symmetrically Composed", category: "action", translationKo: "대칭적 구성" },
    { id: "gd-act-5", content: "Technically Specified", category: "action", translationKo: "기술적으로 명시된" },
  ];

  const designDetailTags = [
    { id: "gd-det-1", content: "Clean Geometric Lines", category: "details", translationKo: "깨끗한 기하학적 선" },
    { id: "gd-det-2", content: "Absolute Vector Precision", category: "details", translationKo: "완벽한 벡터 정밀도" },
    { id: "gd-det-3", content: "High-Contrast Clarity", category: "details", translationKo: "고대비 선명도" },
    { id: "gd-det-4", content: "Minimalist Branding Detail", category: "details", translationKo: "미니멀 브랜딩 디테일" },
    { id: "gd-det-5", content: "Mathematical Balance", category: "details", translationKo: "수학적 균형" },
  ];

  const photographyTags = {
    person: photoPersonTags,
    action: photoActionTags,
    design: photoDesignTags,
    art3d: photoArt3dTags,
    technical: photoCameraTags,
    lighting: photoLightingTags,
    details: photoDetailTags,
  };

  const graphicTags = {
    person: designSubjectTags,
    action: designActionTags,
    design: designLayoutTags,
    art3d: designStyleTags,
    technical: designTechnicalTags,
    lighting: designLightingTags,
    details: designDetailTags,
  };

  return (
    <main className="min-h-screen pb-24 bg-slate-950">
      <Navigation />
      
      <section className="pt-32 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-4 tracking-tight">
          #태그 빌더
        </h1>
        <p className="text-slate-400 max-w-2xl text-center mb-12">
          시각적으로 프롬프트를 조합하세요. 태그를 드래그 앤 드롭하여 실시간으로 구조를 변경하면, 최종 프롬프트가 자동으로 생성됩니다.
        </p>

        <TagBuilderClient 
          photographyTags={photographyTags} 
          graphicTags={graphicTags} 
        />
      </section>
    </main>
  );
}
