"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Zap,
  Settings,
  Layers,
  Video,
  Image as ImageIcon,
  Music,
  MessageCircle,
  PencilRuler,
  User,
  Compass,
  Palette,
  Film,
  BookOpen,
  Camera,
  Gauge,
  Target,
  Eye,
  Move3d,
} from "lucide-react";
import { useToast } from "./Toast";

/* ═══════════════════════════════════════════════════════════
   SECTION 2 DATA — 10대 메뉴 마스터
   ═══════════════════════════════════════════════════════════ */
const menuGroups = [
  {
    groupTitle: "생성 (Create)",
    groupColor: "from-emerald-500 to-emerald-700",
    groupBorder: "border-emerald-500/30",
    items: [
      {
        name: "Image",
        nameKo: "스틸컷 생성",
        icon: ImageIcon,
        color: "from-emerald-500 to-teal-600",
        description:
          "Higgsfield Soul, Flux Context 등 다양한 AI 모델을 선택하여 고품질 스틸컷을 생성합니다. Cinema Studio의 Hero Frame으로 활용할 시작 이미지를 만드는 첫 단계입니다.",
        features: [
          "멀티모델 선택: Higgsfield Soul / Flux Context 등 모델별 특성에 맞는 생성",
          "Hero Frame 제작: Cinema Studio의 시작 프레임으로 직결되는 고해상도 이미지",
          "스타일 레퍼런스: 참조 이미지를 업로드하여 톤앤매너 복제 가능",
        ],
      },
      {
        name: "Video",
        nameKo: "영상 생성",
        icon: Video,
        color: "from-blue-500 to-blue-700",
        description:
          "이미지 또는 텍스트 프롬프트를 기반으로 영상 클립을 생성합니다. Kling, Sora 2, Veo 3.1 등 최신 AI 엔진을 하나의 워크스페이스에서 선택할 수 있습니다.",
        features: [
          "멀티 엔진 통합: Sora 2, Veo 3.1, Kling 3.0 등을 동일 워크스페이스에서 전환",
          "Image-to-Video: 스틸컷을 업로드하면 자동으로 모션을 부여",
          "프롬프트 기반 액션: 텍스트로 피사체의 동작과 카메라 무빙을 동시 지시",
        ],
      },
      {
        name: "Audio",
        nameKo: "사운드 생성",
        icon: Music,
        color: "from-violet-500 to-violet-700",
        description:
          "SFX(효과음), BGM(배경음악), 대사를 생성하고 영상과 A/V 동기화를 수행합니다.",
        features: [
          "SFX 생성: 발걸음, 환경음, 충격음 등 상황별 효과음 자동 생성",
          "BGM 생성: 장르·무드 키워드 기반 배경음악 작곡",
          "A/V 싱크: 생성된 영상의 타임라인에 맞춰 오디오를 자동 정렬",
        ],
      },
    ],
  },
  {
    groupTitle: "지능형 제어 (Intelligent Control)",
    groupColor: "from-cyan-500 to-cyan-700",
    groupBorder: "border-cyan-500/30",
    items: [
      {
        name: "Chat (New)",
        nameKo: "대화형 수정",
        icon: MessageCircle,
        color: "from-cyan-500 to-cyan-700",
        description:
          "AI 어시스턴트와 대화하며 프로젝트를 수정합니다. 프롬프트 엔지니어링 팁, 워크플로우 가이드, 파라미터 추천까지 실시간 지원합니다.",
        features: [
          "자연어 수정: \"배경을 좀 더 따뜻하게 바꿔줘\" 같은 대화형 명령 지원",
          "프롬프트 코칭: 현재 프롬프트의 개선점을 AI가 자동으로 제안",
          "워크플로우 내비게이션: 다음 단계에 어떤 메뉴를 사용할지 안내",
        ],
      },
      {
        name: "Edit",
        nameKo: "정밀 편집",
        icon: PencilRuler,
        color: "from-orange-500 to-orange-700",
        description:
          "Lipsync Studio, Face Swap, Inpainting 등 전문 편집 도구 모음입니다. 영상의 특정 영역만 선택하여 재생성하거나 교체합니다.",
        features: [
          "Lipsync Studio: 음성 파일에 맞춰 립싱크 영상을 자동 생성",
          "Face Swap: 인물의 얼굴을 다른 레퍼런스로 교체",
          "Inpainting: 특정 영역을 선택하여 재생성 (배경 치환, 소품 추가 등)",
        ],
      },
      {
        name: "Character",
        nameKo: "인물 고정 관리",
        icon: User,
        color: "from-pink-500 to-pink-700",
        description:
          "Soul ID 시스템을 통해 AI 캐릭터의 외형을 완벽하게 고정합니다. 장르, 시대, 아키타입, 신체적 특징을 정의하여 다수의 장면에서 일관성을 보장합니다.",
        features: [
          "Soul Cast 통합: 캐릭터의 장르·시대·아키타입·외형을 정의하고 저장",
          "멀티 장면 일관성: 동일 캐릭터가 조명·앵글·의상이 바뀌어도 얼굴 유지",
          "캐스팅 라이브러리: 프로젝트별로 캐릭터 풀을 관리하고 재사용",
        ],
      },
    ],
  },
  {
    groupTitle: "워크플로우 (Workflow)",
    groupColor: "from-amber-500 to-amber-700",
    groupBorder: "border-amber-500/30",
    items: [
      {
        name: "Explore",
        nameKo: "프롬프트 탐색",
        icon: Compass,
        color: "from-amber-500 to-amber-700",
        description:
          "커뮤니티 크리에이터들의 작품과 프롬프트를 탐색합니다. 트렌드를 파악하고 영감을 얻을 수 있는 디스커버리 허브입니다.",
        features: [
          "트렌드 피드: 실시간 인기 스타일과 프롬프트 기법 확인",
          "프롬프트 복제: 마음에 드는 결과물의 프롬프트를 그대로 가져와 변형",
          "컬렉션 저장: 영감 자료를 폴더별로 분류하여 레퍼런스 관리",
        ],
      },
      {
        name: "Moodboard",
        nameKo: "톤 관리",
        icon: Palette,
        color: "from-rose-500 to-rose-700",
        description:
          "프로젝트의 시각적 방향을 기획하는 계획 공간입니다. 스토리보드, 컬러 팔레트, 무드 레퍼런스를 정리한 뒤 실제 생성으로 연결합니다.",
        features: [
          "비주얼 보드: 레퍼런스 이미지를 드래그 앤 드롭으로 배치",
          "컬러 팔레트 추출: 업로드 이미지에서 자동으로 주요 색상 추출",
          "프로덕션 연결: 무드보드에서 바로 Image/Video 생성으로 이동",
        ],
      },
      {
        name: "Cinema Studio 2.5",
        nameKo: "시네마틱 편집",
        icon: Film,
        color: "from-emerald-400 to-teal-600",
        description:
          "힉스필드의 핵심 프로 워크플로우입니다. 가상 카메라 장비(바디·렌즈·화각)를 선택하고, 20+개 카메라 무빙 프리셋을 적용하며, 멀티샷 시퀀싱과 색보정까지 수행합니다.",
        features: [
          "가상 시네마 장비: ARRI, Panavision 등 카메라 바디 / Anamorphic, Prime, Zoom 렌즈 선택",
          "20+ 카메라 프리셋: Dolly, Pan, Tilt, Orbit, FPV Drone, Bullet Time 등",
          "색보정 스위트: 멀티 클립에 통일된 Look을 적용하는 컬러 그레이딩 내장",
          "멀티샷 시퀀싱: 최대 6개 이상의 연속 샷을 하나의 타임라인에서 편집",
        ],
      },
      {
        name: "Original Series (New)",
        nameKo: "시리즈 기획",
        icon: BookOpen,
        color: "from-indigo-500 to-indigo-700",
        description:
          "에피소딕 AI 콘텐츠를 기획하고 제작하는 장편 프로젝트 모드입니다. 캐릭터, 세계관, 에피소드 아크를 관리합니다.",
        features: [
          "에피소드 아크: 캐릭터와 배경이 일관된 다화(多話) 시리즈 설계",
          "세계관 관리: 장소, 시간대, 소품 등 프로덕션 자산을 프로젝트 단위로 묶어 관리",
          "Soul Cast 연동: Character 메뉴에서 정의한 인물을 시리즈 전체에 캐스팅",
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   SECTION 3 DATA — 모션 제어 용어 사전
   ═══════════════════════════════════════════════════════════ */
interface TermEntry {
  term: string;
  termKo: string;
  description: string;
  values?: string;
}
interface TermCategory {
  category: string;
  categoryKo: string;
  icon: typeof Camera;
  color: string;
  entries: TermEntry[];
}

const motionDictionary: TermCategory[] = [
  {
    category: "Camera Movement",
    categoryKo: "카메라 무빙",
    icon: Camera,
    color: "text-emerald-400",
    entries: [
      {
        term: "Dolly In / Dolly Out",
        termKo: "전진 / 후퇴",
        description:
          "카메라가 피사체 방향으로 물리적으로 전진(In)하거나 후퇴(Out)합니다. Zoom과 달리 원근감이 변합니다.",
        values: "프리셋 선택",
      },
      {
        term: "Pan Left / Pan Right",
        termKo: "수평 회전",
        description:
          "카메라가 고정된 위치에서 수평으로 좌(Left) 또는 우(Right)로 회전합니다.",
        values: "프리셋 선택",
      },
      {
        term: "Tilt Up / Tilt Down",
        termKo: "수직 회전",
        description:
          "카메라가 고정된 위치에서 위(Up) 또는 아래(Down)로 수직 회전합니다.",
        values: "프리셋 선택",
      },
      {
        term: "Orbit / Arc",
        termKo: "궤도 회전",
        description:
          "피사체를 중심으로 카메라가 원형 궤도를 그리며 이동합니다. 3D 입체감 극대화.",
        values: "프리셋 선택",
      },
      {
        term: "Zoom In / Zoom Out",
        termKo: "확대 / 축소",
        description:
          "렌즈의 화각을 변경하여 피사체를 확대(In)하거나 축소(Out)합니다. Crash Zoom은 빠른 줌 효과.",
        values: "프리셋 선택",
      },
      {
        term: "Handheld",
        termKo: "핸드헬드",
        description:
          "의도적인 손 떨림을 시뮬레이션하여 다큐멘터리·리얼리즘 느낌을 부여합니다.",
        values: "프리셋 선택",
      },
      {
        term: "FPV Drone",
        termKo: "1인칭 드론",
        description:
          "FPV(First-Person View) 드론이 비행하는 듯한 역동적인 카메라 워킹입니다.",
        values: "프리셋 선택",
      },
      {
        term: "Bullet Time",
        termKo: "불릿 타임",
        description:
          "피사체 주변을 초고속으로 회전하며 슬로모션 효과를 부여합니다. 액션 씬에 최적.",
        values: "프리셋 선택",
      },
    ],
  },
  {
    category: "Motion Control",
    categoryKo: "모션 제어",
    icon: Gauge,
    color: "text-cyan-400",
    entries: [
      {
        term: "Start & End Frame",
        termKo: "시작/끝 프레임",
        description:
          "시작 이미지(Hero Frame)와 끝 이미지를 업로드하면 AI가 두 프레임 사이의 모션을 자동으로 보간합니다. Cinema Studio 2.5의 핵심 제어 방식.",
        values: "이미지 2장 업로드",
      },
      {
        term: "Speed Ramping",
        termKo: "속도 곡선 제어",
        description:
          "클립 내 특정 구간의 재생 속도를 가속하거나 감속합니다. 임팩트 순간의 슬로모션이나 전환 구간의 가속에 활용.",
        values: "속도 곡선 에디터",
      },
      {
        term: "Multi-Axis Stacking",
        termKo: "복합 축 중첩",
        description:
          "Dolly + Pan, Tilt + Zoom 등 복수의 카메라 무빙을 동시에 적용하여 복잡한 시네마틱 샷을 구현합니다.",
        values: "프리셋 조합",
      },
      {
        term: "Motion Strength",
        termKo: "움직임 강도",
        description:
          "영상 전체의 움직임 정도를 제어합니다. 낮은 값은 미세한 움직임(바람에 흔들리는 머리카락), 높은 값은 역동적 액션.",
        values: "0 (정적) ~ 10 (최대 역동)",
      },
    ],
  },
  {
    category: "Optics & Lens",
    categoryKo: "광학 · 렌즈",
    icon: Eye,
    color: "text-amber-400",
    entries: [
      {
        term: "Focal Length",
        termKo: "초점 거리",
        description:
          "가상 렌즈의 초점 거리를 시뮬레이션합니다. 광각(14~35mm)은 넓은 공간감, 망원(85~200mm)은 압축감.",
        values: "14mm / 35mm / 50mm / 85mm / 135mm / 200mm",
      },
      {
        term: "Aperture",
        termKo: "조리개",
        description:
          "조리개 값을 제어하여 피사계 심도(Depth of Field)를 조절합니다. 낮은 f값 = 얕은 심도(보케).",
        values: "f/1.4 ~ f/16",
      },
      {
        term: "Style Anchor",
        termKo: "카메라 프로파일",
        description:
          "ARRI Alexa, Panavision, RED 등 실제 시네마 카메라의 색감·다이내믹 레인지·질감을 시뮬레이션합니다.",
        values: "ARRI / Panavision / RED 등",
      },
      {
        term: "Anamorphic Lens",
        termKo: "아나모픽 렌즈",
        description:
          "시네마스코프 비율의 타원형 보케와 수평 렌즈 플레어를 재현하는 영화 전용 렌즈 시뮬레이션.",
        values: "On / Off",
      },
    ],
  },
  {
    category: "Negative Prompt",
    categoryKo: "네거티브 프롬프트",
    icon: Target,
    color: "text-rose-400",
    entries: [
      {
        term: "Glitch / Jitter",
        termKo: "글리치 / 흔들림",
        description:
          "영상에서 발생하는 디지털 노이즈, 깜빡임, 비정상적 흔들림을 제거합니다.",
        values: "no glitch, no jitter, no flicker",
      },
      {
        term: "Morphing Artifacts",
        termKo: "형태 왜곡",
        description:
          "모션 중 피사체의 형태가 부자연스럽게 변형되는 현상을 방지합니다.",
        values: "no morphing, no warping, no distortion",
      },
      {
        term: "Extra Limbs / Faces",
        termKo: "추가 사지 / 얼굴",
        description:
          "AI가 불필요한 손, 팔, 얼굴 등을 추가 생성하는 현상을 억제합니다.",
        values: "no extra limbs, no extra fingers, no duplicate faces",
      },
      {
        term: "Text / Watermark",
        termKo: "텍스트 / 워터마크",
        description:
          "결과물에 의도하지 않은 텍스트, 로고, 워터마크가 삽입되는 것을 방지합니다.",
        values: "no text, no watermark, no logo, no signature",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   SECTION 4 DATA — Cinema Studio 2.5 Deep Dive
   ═══════════════════════════════════════════════════════════ */
const cinemaFeatures = [
  {
    title: "Soul Cast 통합",
    emoji: "🎭",
    description:
      "장르, 시대, 아키타입, 외형을 정의한 AI 캐릭터를 저장하고, 어떤 장면에서도 동일한 얼굴과 체형을 유지합니다. Character 메뉴에서 정의 → Cinema Studio에서 캐스팅.",
    highlight: "핵심: Character 메뉴에서 Soul ID를 먼저 정의한 뒤 Studio에 불러오세요.",
  },
  {
    title: "Hero Frame 워크플로우",
    emoji: "🖼️",
    description:
      "Image 메뉴에서 생성하거나 외부에서 업로드한 고품질 스틸컷을 'Hero Frame(시작 프레임)'으로 지정합니다. 선택적으로 'End Frame(끝 프레임)'까지 설정하면 AI가 두 프레임 사이의 모션을 정밀 보간합니다.",
    highlight:
      "팁: End Frame 없이 Hero Frame만으로도 생성 가능하지만, End Frame을 지정하면 의도대로 결과가 나올 확률이 크게 높아집니다.",
  },
  {
    title: "색보정 스위트 (Color Grading)",
    emoji: "🎨",
    description:
      "생성된 멀티 클립에 통일된 색감(Look)을 적용합니다. 틸(Teal) & 오렌지, 뮤즈드 톤, 고대비 등 프리셋을 제공하며 커스텀 LUT도 적용 가능합니다.",
    highlight:
      "워크플로우: 모든 클립을 먼저 생성한 뒤 → 마지막에 일괄 색보정을 적용하는 것이 효율적입니다.",
  },
  {
    title: "멀티샷 시퀀싱",
    emoji: "🎬",
    description:
      "타임라인 위에 복수의 샷을 배치하여 하나의 시퀀스로 편집합니다. 각 샷마다 독립적인 카메라 무빙, 렌즈 설정, 프롬프트를 지정할 수 있습니다.",
    highlight:
      "구조: [와이드 샷 → 미디엄 샷 → 클로즈업] 순서로 3-Act 시퀀스를 구성하면 영화적 리듬이 생깁니다.",
  },
  {
    title: "장르 기반 로직",
    emoji: "🎞️",
    description:
      "Action, Horror, Drama, Romance 등 장르를 선택하면 시스템이 해당 장르의 조명, 색감, 페이싱 관례를 자동으로 반영합니다.",
    highlight:
      "예시: 'Horror'를 선택하면 저조도·청록 톤·느린 틸트업이 기본 적용됩니다.",
  },
  {
    title: "3D 장면 네비게이션",
    emoji: "🌐",
    description:
      "생성된 장면을 가상 3D 공간으로 렌더링하여 내부를 자유롭게 탐색합니다. 시점을 변경하고, 리프레이밍하고, 초점 거리를 실시간 조절하는 가상 촬영이 가능합니다.",
    highlight:
      "활용: 한 번의 생성으로 여러 앵글의 장면을 추출할 수 있어 리소스를 절약합니다.",
  },
];

/* ═══════════════════════════════════════════════════════════
   SECTION 5 DATA — 실전 프리셋
   ═══════════════════════════════════════════════════════════ */
const presets = [
  {
    name: "제품 광고 (Hero Shot)",
    prompt:
      "Hero Frame: luxury perfume bottle on marble surface, soft studio lighting\nCamera: Slow Dolly In\nLens: 85mm, f/2.0, shallow depth of field\nMotion: subtle light reflections on glass surface\nNegative: no text, no watermark, no glitch",
  },
  {
    name: "브랜드 필름 (시네마틱)",
    prompt:
      "Hero Frame: aerial view of mountain range at golden hour\nEnd Frame: close-up of hiker reaching summit\nCamera: FPV Drone → Orbit\nStyle Anchor: ARRI Alexa\nSpeed: ramp from fast to slow on final shot\nNegative: no jitter, no morphing",
  },
  {
    name: "뮤직비디오 (다이내믹)",
    prompt:
      "Hero Frame: dancer in neon-lit studio, dramatic pose\nCamera: Bullet Time rotation\nLens: Anamorphic, wide-angle\nMotion Strength: 8/10\nLighting: neon pink + cyan, high contrast strobes\nNegative: no extra limbs, no flicker",
  },
  {
    name: "SNS 릴스 (세로형)",
    prompt:
      "Hero Frame: flat lay of coffee and pastries, top-down\nCamera: Slow Zoom Out\nAspect: 9:16\nMotion: steam rising from cup, subtle\nLighting: warm natural light from side window\nNegative: no text, no watermark, no people",
  },
  {
    name: "건축 · 인테리어 워크스루",
    prompt:
      "Hero Frame: modern minimalist apartment entrance\nEnd Frame: floor-to-ceiling window overlooking city\nCamera: Steady Dolly In through hallway\nLens: 24mm wide-angle, f/8\nLighting: natural daylight, clean shadows\nNegative: no furniture clutter, no distortion",
  },
  {
    name: "패션 룩북 (캐릭터 일관성)",
    prompt:
      "Soul Cast: Female model, mid-20s, East Asian, athletic build\nHero Frame: full body shot in studio, white background\nCamera: Pan Right reveal\nOutfit: oversized blazer, structured silhouette\nLighting: softbox key light + rim light\nNegative: no extra faces, no morphing artifacts",
  },
];

const cheatSheet = {
  avoid: [
    "beautiful, nice, awesome (추상적 형용사)",
    "high quality, 4K, 8K (영상 모드에서 불필요)",
    "realistic (이미 기본값)",
    "very, really, extremely (강조 부사 남용)",
  ],
  mustInclude: [
    "카메라 무빙 유형 (Dolly / Pan / Orbit 등)",
    "렌즈 스펙 (초점거리 + 조리개)",
    "Motion Strength 수치",
    "네거티브 프롬프트 (glitch, morphing 등)",
  ],
  proTips: [
    "Hero Frame은 Image 메뉴에서 먼저 생성한 뒤 Video로 가져오세요.",
    "한 클립에 지시를 과다하게 넣지 말고, 먼저 단일 카메라 무빙으로 생성 → Edit에서 세부 보정하세요.",
    "Character 메뉴에서 Soul ID를 먼저 정의하면 멀티샷 시퀀싱 시 인물 일관성이 보장됩니다.",
    "색보정은 모든 클립 생성이 끝난 뒤 마지막에 일괄 적용하는 것이 효율적입니다.",
  ],
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function HigsfieldGuideClient() {
  const { toast } = useToast();
  const [expandedMenu, setExpandedMenu] = useState<string | null>("Image");
  const [expandedTermCat, setExpandedTermCat] = useState<string | null>(
    "Camera Movement"
  );

  const copyText = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      toast("프롬프트가 클립보드에 복사되었습니다!", "copy");
    },
    [toast]
  );

  return (
    <div className="space-y-24">
      {/* ───────── SECTION 1: 핵심 철학 ───────── */}
      <section>
        <div className="glass-card p-8 md:p-10 border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/8 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
              <Zap className="text-emerald-400" size={28} />
              힉스필드 핵심 철학
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  emoji: "🎬",
                  title: "감독 마인드셋",
                  desc: '힉스필드에서는 프롬프트를 "연출 지시서"로 접근합니다. 카메라 바디, 렌즈, 무빙 프리셋을 실제 촬영 현장처럼 선택하여 AI의 랜덤성을 최소화합니다.',
                },
                {
                  emoji: "🎯",
                  title: "시작/끝 프레임 전략",
                  desc: "Hero Frame(시작)과 End Frame(끝)을 정의하면 AI가 두 지점 사이의 모션을 보간합니다. 이것이 Cinema Studio 2.5의 가장 강력한 제어 방식입니다.",
                },
                {
                  emoji: "🧱",
                  title: "단계적 확장",
                  desc: "단일 클립 → 멀티샷 시퀀싱 → 시리즈 기획으로 점진적으로 확장하세요. 한 번에 모든 것을 넣으려 하지 말고, Edit 메뉴로 반복 정제하는 것이 핵심입니다.",
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50"
                >
                  <span className="text-3xl mb-3 block">{p.emoji}</span>
                  <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── SECTION 2: 10대 메뉴 마스터 ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <Layers className="text-emerald-400" size={28} />
          10대 메뉴 마스터
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          힉스필드 상단 바의 핵심 메뉴 10가지를 완벽히 이해하세요. 각 항목을
          클릭하면 기능 상세와 활용법이 표시됩니다.
        </p>

        <div className="space-y-10">
          {menuGroups.map((group) => (
            <div key={group.groupTitle}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span
                  className={`w-1 h-6 rounded-full bg-gradient-to-b ${group.groupColor}`}
                />
                {group.groupTitle}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isOpen = expandedMenu === item.name;
                  return (
                    <div
                      key={item.name}
                      className={`glass-card border ${isOpen ? group.groupBorder : "border-slate-800"} overflow-hidden transition-all`}
                    >
                      <button
                        onClick={() =>
                          setExpandedMenu(isOpen ? null : item.name)
                        }
                        className="w-full flex items-center gap-4 px-5 py-4 text-left group"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-lg`}
                        >
                          <Icon size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-base text-white">
                              {item.name}
                            </h4>
                            <span className="text-xs text-slate-500">—</span>
                            <span className="text-sm text-slate-400 font-medium">
                              {item.nameKo}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-slate-600 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-slate-800/50">
                              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                {item.description}
                              </p>
                              <ul className="space-y-2">
                                {item.features.map((feature, fi) => (
                                  <li
                                    key={fi}
                                    className="text-xs text-slate-400 flex items-start gap-2"
                                  >
                                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">
                                      ✓
                                    </span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── SECTION 3: 모션 제어 용어 사전 ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <Move3d className="text-emerald-400" size={28} />
          모션 제어 용어 사전
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          힉스필드 영상 생성의 핵심 파라미터를 카테고리별로 정리했습니다. 각
          용어를 클릭하면 상세 설명과 사용 값이 표시됩니다.
        </p>

        <div className="space-y-6">
          {motionDictionary.map((cat) => {
            const CatIcon = cat.icon;
            const isOpen = expandedTermCat === cat.category;
            return (
              <div
                key={cat.category}
                className="glass-card border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedTermCat(isOpen ? null : cat.category)
                  }
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  <CatIcon size={22} className={cat.color} />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{cat.categoryKo}</h3>
                    <p className="text-xs text-slate-500">{cat.category}</p>
                  </div>
                  <span className="text-xs text-slate-600 font-bold">
                    {cat.entries.length}개 항목
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-800/50">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-900/50 text-xs font-black uppercase tracking-widest text-slate-500">
                          <div className="col-span-3">용어</div>
                          <div className="col-span-6">설명</div>
                          <div className="col-span-3">사용 값</div>
                        </div>

                        {/* Table Rows */}
                        {cat.entries.map((entry, ei) => (
                          <div
                            key={ei}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                          >
                            <div className="md:col-span-3">
                              <code className="text-sm text-emerald-400 font-mono font-bold">
                                {entry.term}
                              </code>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {entry.termKo}
                              </div>
                            </div>
                            <div className="md:col-span-6 text-sm text-slate-300 leading-relaxed">
                              {entry.description}
                            </div>
                            <div className="md:col-span-3">
                              {entry.values && (
                                <span className="text-xs font-medium text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/40 inline-block">
                                  {entry.values}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── SECTION 4: Cinema Studio 2.5 Deep Dive ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <Film className="text-emerald-400" size={28} />
          Cinema Studio 2.5 Deep Dive
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          힉스필드의 핵심 프로 워크플로우인 Cinema Studio 2.5의 고급 기능을
          심층 분석합니다.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cinemaFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="glass-card p-6 border-slate-800 hover:border-emerald-500/30 transition-all"
            >
              <span className="text-2xl mb-3 block">{feature.emoji}</span>
              <h3 className="font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {feature.description}
              </p>
              <div className="bg-emerald-950/20 rounded-lg px-3 py-2.5 border border-emerald-800/20">
                <p className="text-xs text-emerald-300 leading-relaxed">
                  💡 {feature.highlight}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── SECTION 5: 실전 프리셋 & 치트 시트 ───────── */}
      <section>
        <div className="glass-card p-8 md:p-10 border-brand-yellow/30">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Presets */}
            <div className="flex-1">
              <h2 className="text-2xl font-black tracking-tight mb-2 flex items-center gap-3">
                <Settings className="text-brand-yellow" size={24} />
                상황별 실전 프리셋
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                브랜드 디자인팀이 즉시 활용 가능한 힉스필드 프롬프트 템플릿입니다.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {presets.map((preset, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-slate-900/80 rounded-xl p-5 border border-slate-700 hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {preset.name}
                      </h4>
                      <button
                        onClick={() => copyText(preset.prompt)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <Copy size={12} />
                        복사
                      </button>
                    </div>
                    <code className="text-[11px] text-slate-400 font-mono leading-relaxed block whitespace-pre-line">
                      {preset.prompt}
                    </code>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Cheat Sheet */}
            <div className="w-full lg:w-[320px] bg-slate-800/40 rounded-2xl p-6 border border-slate-700 shrink-0">
              <h3 className="font-bold text-white mb-5">
                힉스필드 치트 시트
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    🚫 절대 피해야 할 표현
                  </div>
                  <ul className="space-y-1.5">
                    {cheatSheet.avoid.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-rose-400 font-medium"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    ✅ 반드시 포함할 요소
                  </div>
                  <ul className="space-y-1.5">
                    {cheatSheet.mustInclude.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-emerald-400 font-medium"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    💡 프로 팁
                  </div>
                  <ul className="space-y-2">
                    {cheatSheet.proTips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 leading-relaxed"
                      >
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
