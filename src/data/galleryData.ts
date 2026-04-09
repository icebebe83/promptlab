export interface GalleryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  platform: "midjourney" | "nanobanana";
  aspectRatio: "square" | "portrait" | "landscape";
  title?: string;
}

export const galleryData: GalleryItem[] = [
  // ── Nanobanana (bananaprompts.xyz 실제 데이터) ──
  {
    id: "nb1",
    imageUrl: "https://cdn.bananaprompts.xyz/ae5f8289-1a58-4605-8d97-0ffa38b6a5cf/76bcf139-247c-40a9-adf1-a450be31a762.jpeg?w=1920&q=75",
    prompt: "Studio portrait of a confident man sitting on a modern beige armchair with wooden legs, leaning slightly forward with his hands together. He wears a dark navy blue dress shirt with the top buttons open, light beige slim-fit pants, and black loafers with tan soles. Short dark brown hair styled with texture, trimmed full beard, tanned skin, intense confident gaze. Minimalist light gray background with smooth gradient, soft natural studio lighting. Cinematic fashion editorial, 50mm lens at f/2.8, vertical framing, full-body composition.",
    platform: "nanobanana",
    aspectRatio: "portrait",
    title: "에디토리얼 남성 포트레이트"
  },
  {
    id: "nb2",
    imageUrl: "https://cdn.bananaprompts.xyz/2513bb4b-b97f-4488-9f3e-7cc8448f1568/c30a900e-8ba4-4a2d-ac99-d18eb216898d.png?w=1920&q=75",
    prompt: "Hyper-realistic, ultra-detailed close-up portrait showing only the left half of my face submerged in water, one eye in sharp focus, positioned on the far left of the frame, light rays creating caustic patterns on the skin, suspended water droplets and bubbles adding depth, cinematic lighting with soft shadows and sharp highlights, photorealistic textures including skin pores, wet lips, eyelashes, and subtle subsurface scattering, surreal and dreamlike atmosphere, shallow depth of field, underwater macro perspective. 3:4 aspect ratio.",
    platform: "nanobanana",
    aspectRatio: "portrait",
    title: "수중 포트레이트"
  },
  {
    id: "nb3",
    imageUrl: "https://cdn.bananaprompts.xyz/95945df9-736c-4faf-8710-acee35cb47c3/db37e078-415c-41e3-be75-08d64fae3a3b.jpeg?w=1920&q=75",
    prompt: "A close-up portrait of a woman with long, jet-black, slightly wind-swept hair falling across her face. Her striking, light-colored eyes gaze upwards and to the right, catching a sharp, diagonal beam of natural light that illuminates the high points of her cheekbone, nose, and plump, glossy, mauve-toned lips.",
    platform: "nanobanana",
    aspectRatio: "portrait",
    title: "드라마틱 여성 클로즈업"
  },
  {
    id: "nb4",
    imageUrl: "https://cdn.bananaprompts.xyz/3af490e3-bf8b-4fc2-a77f-33dfca4e5040/5dbf467c-003a-43d1-b3ec-c0e46b428c4a.jpeg?w=1920&q=75",
    prompt: "A cinematic urban portrait of me, keeping my real face unchanged. Sitting casually on outdoor stone steps in front of a building entrance, leaning slightly forward with a confident and contemplative posture. Left elbow rests on knee, hand raised to temple in a thoughtful gesture. Gaze directed toward the camera, steady and intense, calm yet powerful expression. Wearing a black fitted turtleneck sweater layered under a black coat with wide collar and subtle texture.",
    platform: "nanobanana",
    aspectRatio: "portrait",
    title: "시네마틱 어반 포트레이트"
  },
  {
    id: "nb5",
    imageUrl: "https://cdn.bananaprompts.xyz/f4f238cc-bb8e-4716-bfde-51c2718d5984/7761e3e5-32c1-47a7-8dfa-9f650aec6af3.png?w=1920&q=75",
    prompt: "Create a realistic and emotional scene showing a man and a lion face to face in a moment of connection and respect. The man's eyes are closed, with a serene expression, while the lion gently rests its forehead and muzzle against his, conveying trust and a spiritual bond. Both standing on ground covered in light snow, snowflakes gently falling. Cold, misty natural landscape with blurred mountains and gray tones.",
    platform: "nanobanana",
    aspectRatio: "square",
    title: "본능과 영혼"
  },
  {
    id: "nb6",
    imageUrl: "https://cdn.bananaprompts.xyz/1a9193f2-4d4f-402a-b1fa-89f89b391554/75bdae76-e15a-4933-a487-ccc49acb5894.jpeg?w=1920&q=75",
    prompt: "A cinematic, mid-length portrait, capturing a female figure with a strong and elegant presence, standing next to a horse. The subject faces the camera with a steady, confident gaze. Dressed in a light-colored, long-sleeved button-up shirt, sleeves slightly rolled up. Wide, open field during golden hour, soft warm light illuminating the scene, shallow depth of field.",
    platform: "nanobanana",
    aspectRatio: "portrait",
    title: "골든아워 말과 함께"
  },
  {
    id: "nb7",
    imageUrl: "https://cdn.bananaprompts.xyz/68155dad-d783-427e-bb9e-b7254480bf27/6080b41d-5c16-40b8-b8f4-baf2d3722a75.jpeg?w=1920&q=75",
    prompt: "Studio photography of a me in a black suit, black turtleneck and round sunglasses with translucent yellow lenses. Vibrant orange background. Unique poses from the front.",
    platform: "nanobanana",
    aspectRatio: "portrait",
    title: "스튜디오 패션 포트레이트"
  },
  {
    id: "nb8",
    imageUrl: "https://cdn.bananaprompts.xyz/3330b9a2-ba1c-46b4-987b-3888173a1875/d8f4e8c1-2d84-4e26-94a7-a4ed5b86d7aa.jpeg?w=1920&q=75",
    prompt: "Create a hyper-realistic portrait of a man sitting in the driver's seat of a car, wearing a black shirt combined with a faded light gray jacket and light gray wide-leg pants. White shoes visible. Round sunglasses with dark lenses. Relaxed posture: one arm on the sports steering wheel, the other supporting the head, conveying a relaxed look.",
    platform: "nanobanana",
    aspectRatio: "landscape",
    title: "빈티지 카 포트레이트"
  },

  // ── Nanobanana (추가 수집) ──
  {
    id: "nb9",
    imageUrl: "https://cdn.bananaprompts.xyz/ea78a09f-a3bb-472b-a7c1-0e93c7661e8d/82f1edc2-5d9b-473b-918d-4b4183f7086d.png?w=1920&q=75",
    prompt: "Professional studio portrait, confident and determined expression, head slightly tilted down, wearing a black V-neck t-shirt. Low-key photography setup with butterfly lighting (key light from front above), hair rim light from behind, faint background light. Subtle haze or smoke. Shot on medium format camera, high contrast, cinematic, sharp focus, soft shadows.",
    platform: "nanobanana",
    aspectRatio: "portrait",
    title: "로우키 스튜디오 포트레이트"
  },
  {
    id: "nb10",
    imageUrl: "https://cdn.bananaprompts.xyz/aade4ced-0fca-4b62-b70e-fb82e654624f/f92efcf0-d1c6-4ab6-b720-0d0d30d40bcb.png?w=1920&q=75",
    prompt: "A man with a beard and short dark hair captured in a striking portrait, illuminated by dramatic dual-colored lighting. Face split with one half bathed in deep red glow and other in cool vibrant blue. High-contrast lighting emphasizes facial contours, sharp gaze, texture of facial hair. Solid dark background, making colors and intense expression the primary focus.",
    platform: "nanobanana",
    aspectRatio: "square",
    title: "듀얼 컬러 라이팅 포트레이트"
  },
  {
    id: "nb11",
    imageUrl: "https://cdn.bananaprompts.xyz/18973a18-e495-4d7c-b8aa-a7fc55767459/cb66879a-fcef-4010-ad28-5033521e664b.png?w=1920&q=75",
    prompt: "Dramatic, ultra-realistic close-up in black and white with high-contrast cinematic lighting from the side, highlighting contours of face and beard, casting deep shadows. Round reflective sunglasses reflecting a city's towering skyline. Confident upward gaze into a dark void.",
    platform: "nanobanana",
    aspectRatio: "square",
    title: "어반 리플렉션 모노크롬"
  },
  {
    id: "nb12",
    imageUrl: "https://cdn.bananaprompts.xyz/d7a105a2-5dde-4cd5-96bf-f5cb83690a1f/3fe244de-696e-4381-8d53-c494133a6a76.png?w=1920&q=75",
    prompt: "A cinematic close-up portrait of a stylish individual standing by a large glass window, gazing thoughtfully at their reflection. Professional and sleek dark-colored suit, navy or black, crisp tailored look that fits perfectly.",
    platform: "nanobanana",
    aspectRatio: "portrait",
    title: "코퍼레이트 시네마틱"
  },

  // ── Midjourney ──
  {
    id: "mj1",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    prompt: "abstract fluid art, iridescent metallic swirls, deep navy and gold palette, macro photography, soft studio lighting, 8k detail --v 6.1 --style raw --ar 1:1 --s 400",
    platform: "midjourney",
    aspectRatio: "square",
    title: "메탈릭 플루이드 아트"
  },
  {
    id: "mj2",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    prompt: "alpine mountain peak, golden hour, dramatic clouds, aerial drone view, warm amber light, snow-capped summit, cinematic landscape --v 6.1 --ar 16:9 --s 250",
    platform: "midjourney",
    aspectRatio: "landscape",
    title: "시네마틱 알파인 봉우리"
  },
  {
    id: "mj3",
    imageUrl: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800&q=80",
    prompt: "cyberpunk female warrior, neon magenta armor, volumetric fog, 85mm f/1.4, dark alley background, rain reflections, hyper-detailed --v 6.1 --style raw --s 300 --c 15",
    platform: "midjourney",
    aspectRatio: "portrait",
    title: "사이버펑크 워리어"
  },
  {
    id: "mj4",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    prompt: "luxury whiskey bottle, studio product photography, black background, soft rim lighting, Hasselblad quality, crystal glass, amber liquid, 4k detail --v 6.1 --ar 4:5 --s 200",
    platform: "midjourney",
    aspectRatio: "portrait",
    title: "럭셔리 위스키 프로덕트"
  },
  {
    id: "mj5",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    prompt: "futuristic city skyline, night, neon blue and purple, drone aerial view, rain-wet streets, reflections, cyberpunk atmosphere --v 6.1 --ar 16:9 --style raw --s 350",
    platform: "midjourney",
    aspectRatio: "landscape",
    title: "네온 시티 스카이라인"
  },
  {
    id: "mj6",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    prompt: "dramatic portrait of elderly man, deep wrinkles, silver beard, Rembrandt lighting, chiaroscuro, oil painting texture, 85mm lens, dark background --v 6.1 --style raw --s 500",
    platform: "midjourney",
    aspectRatio: "portrait",
    title: "렘브란트 라이팅 초상"
  }
];
