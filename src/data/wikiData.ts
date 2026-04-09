import { KnowledgeItem } from "./schema";

export const wikiData: KnowledgeItem[] = [
  // Lenses
  {
    id: "lens-14mm",
    title: "14mm",
    category: "lens",
    description: "Ultra-wide: 광활한 풍경, 역동적인 왜곡 효과",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#14mm", "#Ultra-wide", "#Dynamic", "#Landscape"],
    examplePrompt: "A futuristic city skyline, 14mm ultra-wide lens, dynamic distortion --ar 16:9"
  },
  {
    id: "lens-35mm",
    title: "35mm",
    category: "lens",
    description: "Standard: 일상적인 스냅, 스트리트 포토",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#35mm", "#Standard", "#Street", "#Snapshot"],
    examplePrompt: "A street photographer taking a photo in a neon city, 35mm lens, realistic style --s 250"
  },
  {
    id: "lens-85mm",
    title: "85mm",
    category: "lens",
    description: "Portrait: 인물 강조, 부드러운 배경 흐림(Bokeh)",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#85mm", "#Portrait", "#Bokeh", "#DepthOfField"],
    examplePrompt: "A dramatic portrait of a woman in cyberpunk attire, 85mm lens, creamy bokeh, hyper-realistic"
  },
  {
    id: "lens-200mm",
    title: "200mm",
    category: "lens",
    description: "Telephoto: 압축감 있는 원경, 스포츠/야생동물",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#200mm", "#Telephoto", "#Compression", "#Wildlife"],
    examplePrompt: "A majestic eagle flying close-up, 200mm telephoto lens, background compression, cinematic --ar 16:9"
  },

  // Angles
  {
    id: "angle-low",
    title: "Low Angle",
    category: "angle",
    description: "웅장하고 권위 있는 느낌",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#LowAngle", "#Majestic", "#Authoritative"],
    examplePrompt: "Low angle shot of a massive skyscraper reaching the clouds, heroic and grand"
  },
  {
    id: "angle-high",
    title: "High Angle",
    category: "angle",
    description: "작고 연약하거나 전체를 조망하는 느낌",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#HighAngle", "#Overview", "#Vulnerable"],
    examplePrompt: "High angle shot of a lonely puppy in a large park, evoking vulnerability"
  },
  {
    id: "angle-dutch",
    title: "Dutch Angle",
    category: "angle",
    description: "불안함, 긴장감, 역동성",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#DutchAngle", "#Tilted", "#Dynamic", "#Tension"],
    examplePrompt: "Dutch angle shot of a spy running through a narrow alley, intense action scene"
  },
  {
    id: "angle-bird",
    title: "Bird's Eye View",
    category: "angle",
    description: "수직 위에서 아래로 내려다보는 평면적 구도",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#BirdsEyeView", "#TopDown", "#Flat"],
    examplePrompt: "Bird's eye view of a serene Zen garden, highly detailed, top-down perspective --ar 1:1"
  },

  // Lighting
  {
    id: "lighting-rim",
    title: "Rim Light",
    category: "lighting",
    description: "피사체 테두리를 따라 빛나는 역광 효과",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#RimLighting", "#Backlit", "#Silhouette"],
    examplePrompt: "A glowing silhouette of a samurai, rim lighting around the edge of his armor, dark background"
  },
  {
    id: "lighting-rembrandt",
    title: "Rembrandt Lighting",
    category: "lighting",
    description: "인물의 한쪽 뺨에 삼각형 빛이 생기는 고전적 조명",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#RembrandtLighting", "#Classical", "#PortraitLighting"],
    examplePrompt: "A classic oil painting style portrait of a wiseman, dramatic Rembrandt lighting, chiaroscuro --s 500"
  },
  {
    id: "lighting-softbox",
    title: "Softbox",
    category: "lighting",
    description: "부드럽고 그림자가 적은 상업 사진 조명",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#Softbox", "#Commercial", "#EvenLighting"],
    examplePrompt: "Product photography of a luxury perfume bottle, softbox lighting, clean white background, highly detailed"
  },
  {
    id: "lighting-golden",
    title: "Golden Hour",
    category: "lighting",
    description: "해 질 녘의 따뜻하고 긴 그림자",
    platforms: ["midjourney", "nanobanana", "weavy", "higsfield"],
    tags: ["#GoldenHour", "#Warm", "#Sunset", "#LongShadows"],
    examplePrompt: "A couple walking on the beach, golden hour lighting, warm orange glow, long shadows, romantic tone --ar 16:9"
  }
];
