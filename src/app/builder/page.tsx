import Navigation from "@/components/Navigation";
import TagBuilderClient from "@/components/TagBuilderClient";
import { wikiData } from "@/data/wikiData";

export default function BuilderPage() {
  // Extract legacy tags from existing wiki structured data
  const legacyCameraTags = wikiData
    .filter((item) => item.category === "lens" || item.category === "angle")
    .map((item) => ({ id: `legacy-${item.id}`, content: item.title, category: "technical" }));

  const legacyLightingTags = wikiData
    .filter((item) => item.category === "lighting")
    .map((item) => ({ id: `legacy-${item.id}`, content: item.title, category: "lighting" }));

  const personTags = [
    { id: "person-1", content: "Adult Male", category: "person" },
    { id: "person-2", content: "Adult Female", category: "person" },
    { id: "person-3", content: "Young Boy", category: "person" },
    { id: "person-4", content: "Young Girl", category: "person" },
    { id: "person-5", content: "Elderly Person", category: "person" },
  ];

  const art3dTags = [
    { id: "art-1", content: "3D Render", category: "art3d" },
    { id: "art-2", content: "Octane Render", category: "art3d" },
    { id: "art-3", content: "Unreal Engine 5", category: "art3d" },
    { id: "art-4", content: "Claymation", category: "art3d" },
    { id: "art-5", content: "Voxel Art", category: "art3d" },
  ];

  const designTags = [
    { id: "design-1", content: "UI/UX Design", category: "design" },
    { id: "design-2", content: "Graphic Poster", category: "design" },
    { id: "design-3", content: "Minimalism", category: "design" },
    { id: "design-4", content: "Cityscape", category: "design" },
    { id: "design-5", content: "Pristine Nature", category: "design" },
    { id: "design-6", content: "Cyberpunk City", category: "design" },
  ];

  const cameraTags = [
    { id: "cam-1", content: "14mm Wide Angle", category: "technical" },
    { id: "cam-2", content: "35mm Standard", category: "technical" },
    { id: "cam-3", content: "85mm Portrait Lens", category: "technical" },
    { id: "cam-4", content: "200mm Telephoto", category: "technical" },
  ];

  const angleTags = [
    { id: "angle-1", content: "Low Angle", category: "technical" },
    { id: "angle-2", content: "High Angle", category: "technical" },
    { id: "angle-3", content: "Dutch Angle", category: "technical" },
    { id: "angle-4", content: "Bird's Eye View", category: "technical" },
  ];

  const deviceTags = [
    { id: "dev-1", content: "DSLR Camera", category: "technical" },
    { id: "dev-2", content: "Leica Photography", category: "technical" },
    { id: "dev-3", content: "35mm Film Stock", category: "technical" },
    { id: "dev-4", content: "Mirrorless Camera", category: "technical" },
  ];

  const availableTags = {
    person: personTags,
    art3d: art3dTags,
    design: designTags,
    technical: [...cameraTags, ...angleTags, ...deviceTags, ...legacyCameraTags],
    lighting: legacyLightingTags,
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

        <TagBuilderClient initialTags={availableTags} />
      </section>
    </main>
  );
}
