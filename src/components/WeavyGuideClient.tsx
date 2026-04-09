"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Zap,
  Settings,
  Layers,
  GitBranch,
  Box,
  Cpu,
  ScanLine,
  ArrowUpCircle,
  PencilRuler,
  ImageIcon,
  Sliders,
  Network,
  BookOpen,
  Workflow,
} from "lucide-react";
import { useToast } from "./Toast";

/* ═══════════════════════════════════════════════════════════
   SECTION 2 DATA — 필수 메뉴 및 기능 설명
   ═══════════════════════════════════════════════════════════ */
const menuGroups = [
  {
    groupTitle: "캔버스 & 노드 (Canvas & Nodes)",
    groupColor: "from-amber-500 to-amber-700",
    groupBorder: "border-amber-500/30",
    items: [
      {
        name: "Node Canvas",
        nameKo: "노드 캔버스",
        icon: Network,
        color: "from-amber-500 to-orange-600",
        description:
          "위비의 핵심 작업 공간입니다. 로드 이미지, 모델 로더, 프롬프트, 샘플러 등 각 기능을 '노드'로 캔버스 위에 배치하고, 선(Wire)으로 연결하여 이미지 생성 파이프라인을 구축합니다.",
        features: [
          "노드 팔레트: 좌측 패널에서 필요한 노드를 드래그 앤 드롭으로 배치",
          "와이어 연결: 출력(Output) 포트와 입력(Input) 포트를 선으로 연결하여 데이터 흐름(Flow) 설정",
          "그룹 노드: 자주 쓰는 조합을 하나의 그룹으로 묶어 재사용 가능",
          "워크플로우 저장: 완성된 파이프라인을 파일로 저장하고 팀원과 공유",
        ],
      },
      {
        name: "Load Checkpoint",
        nameKo: "체크포인트 로더",
        icon: Box,
        color: "from-amber-600 to-yellow-700",
        description:
          "이미지 생성의 기반이 되는 학습된 대형 AI 모델(Checkpoint)을 불러옵니다. SD 1.5, SDXL, SD3 등 베이스 모델을 선택하는 첫 번째 노드입니다.",
        features: [
          "모델 선택: Stable Diffusion 1.5 / SDXL / SD3 등 목적에 맞는 베이스 모델 지정",
          "VAE 통합: 일부 체크포인트는 VAE(이미지 디코더)가 내장되어 별도 VAE 노드 불필요",
          "커스텀 모델: 로컬 또는 클라우드에 업로드한 사용자 체크포인트도 즉시 로드 가능",
        ],
      },
      {
        name: "Load LoRA",
        nameKo: "로라 로더",
        icon: Sliders,
        color: "from-orange-500 to-red-600",
        description:
          "LoRA(Low-Rank Adaptation)는 체크포인트에 특정 화풍, 캐릭터, 사물 스타일을 미세하게 추가하는 보조 모델입니다. 체크포인트와 함께 사용합니다.",
        features: [
          "스타일 특화: 특정 아티스트 화풍, 렌더링 엔진 스타일 등을 적용",
          "강도 조절(Model Strength): 0.0 ~ 1.0 사이에서 LoRA 적용 강도를 수치로 제어",
          "멀티 LoRA: 여러 LoRA를 체인으로 연결하여 복합 스타일 조합 가능",
        ],
      },
    ],
  },
  {
    groupTitle: "구조 통제 & ControlNet",
    groupColor: "from-cyan-500 to-cyan-700",
    groupBorder: "border-cyan-500/30",
    items: [
      {
        name: "ControlNet",
        nameKo: "컨트롤넷 (구조 통제)",
        icon: ScanLine,
        color: "from-cyan-500 to-teal-600",
        description:
          "이미지의 뼈대(포즈), 윤곽선(엣지), 깊이(뎁스) 정보를 추출하여 생성 결과물의 구조를 고정하는 핵심 기능입니다. 프롬프트만으로는 제어할 수 없는 정확한 레이아웃을 보장합니다.",
        features: [
          "Canny (윤곽선): 참조 이미지의 선과 엣지를 추출하여 형태를 고정",
          "Depth (깊이): 원근감과 공간 배치를 유지한 채 스타일만 변경",
          "OpenPose (포즈): 인체의 관절 위치를 인식하여 포즈를 정확히 재현",
          "Reference (참조): 전체적인 분위기와 색감을 참조 이미지에서 가져옴",
          "Tile (타일): 고해상도 업스케일 시 디테일을 보존하며 재생성",
        ],
      },
      {
        name: "IP-Adapter",
        nameKo: "이미지 프롬프트 어댑터",
        icon: ImageIcon,
        color: "from-teal-500 to-cyan-700",
        description:
          "텍스트 프롬프트 대신 참조 이미지를 '시각적 프롬프트'로 사용합니다. 이미지의 구도, 색감, 스타일 요소를 새 생성에 자동으로 반영합니다.",
        features: [
          "스타일 전이: 참조 이미지의 시각적 분위기를 새 이미지에 전달",
          "강도 제어: ControlNet과 마찬가지로 영향력을 0.0 ~ 1.0으로 조절",
          "페이스 전이: 얼굴 특징을 참조 이미지에서 가져오는 특수 모드",
        ],
      },
    ],
  },
  {
    groupTitle: "후처리 & 업스케일 (Post-Processing)",
    groupColor: "from-violet-500 to-violet-700",
    groupBorder: "border-violet-500/30",
    items: [
      {
        name: "Upscaler",
        nameKo: "업스케일러 (해상도 확대)",
        icon: ArrowUpCircle,
        color: "from-violet-500 to-purple-700",
        description:
          "생성된 이미지의 해상도를 높이고 디테일을 보강하는 후처리 노드입니다. 기본 512×512 또는 1024×1024 이미지를 인쇄/광고 가능한 고해상도로 변환합니다.",
        features: [
          "AI 업스케일: RealESRGAN, ESRGAN 4x 등 AI 모델을 활용한 지능형 확대",
          "Hires Fix: 업스케일 후 재생성(Re-denoise)하여 디테일을 추가 보강",
          "타일 업스케일: ControlNet Tile과 연동하여 큰 이미지를 부분별로 정밀 확대",
          "배율 선택: 2x / 4x / 8x 등 목적에 맞는 배율 지정",
        ],
      },
      {
        name: "Inpaint / Outpaint",
        nameKo: "인페인트 / 아웃페인트",
        icon: PencilRuler,
        color: "from-purple-500 to-fuchsia-600",
        description:
          "이미지의 특정 영역을 선택(마스크)하여 재생성(Inpaint)하거나, 이미지의 외곽을 확장(Outpaint)합니다.",
        features: [
          "마스크 편집: 브러시로 수정 영역을 직접 그려서 지정",
          "프롬프트 지정: 마스크 영역에만 적용될 별도의 프롬프트 입력",
          "아웃페인트: 화면 밖 영역을 AI가 자연스럽게 확장",
        ],
      },
      {
        name: "Layer Compositing",
        nameKo: "레이어 합성",
        icon: Layers,
        color: "from-fuchsia-500 to-pink-600",
        description:
          "여러 생성 결과를 레이어로 관리하고 합성합니다. 배경 제거, 마스크 합성, 블렌딩 모드 적용 등 포토샵 수준의 후처리가 가능합니다.",
        features: [
          "배경 제거: 자동 배경 분리 및 알파 채널 추출",
          "블렌딩 모드: Multiply, Screen, Overlay 등 합성 모드 지원",
          "컬러 그레이딩: 밝기, 대비, 채도, 색조를 노드 단위로 미세 조정",
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   SECTION 3 DATA — 실전 용어 사전 (Glossary)
   ═══════════════════════════════════════════════════════════ */
interface GlossaryEntry {
  termKo: string;
  termEn: string;
  description: string;
  example?: string;
}
interface GlossaryCategory {
  category: string;
  icon: typeof Cpu;
  color: string;
  entries: GlossaryEntry[];
}

const glossary: GlossaryCategory[] = [
  {
    category: "모델 & 학습",
    icon: Cpu,
    color: "text-amber-400",
    entries: [
      {
        termKo: "체크포인트",
        termEn: "Checkpoint",
        description:
          "이미지 생성의 기반이 되는 학습된 대형 AI 모델입니다. 수십억 개의 이미지-텍스트 쌍으로 학습되어 특정 스타일의 이미지를 생성합니다. SD 1.5, SDXL, SD3 등이 대표적입니다.",
        example: "realistic_vision_v5.safetensors, dreamshaper_xl.safetensors",
      },
      {
        termKo: "로라",
        termEn: "LoRA (Low-Rank Adaptation)",
        description:
          "체크포인트에 특정 화풍, 캐릭터, 사물 스타일을 미세하게 추가하는 보조 모델입니다. 체크포인트를 통째로 바꾸지 않고도 원하는 스타일을 덧입힐 수 있어 효율적입니다.",
        example:
          "film_grain_lora.safetensors (영화 그레인), anime_style_lora.safetensors",
      },
      {
        termKo: "VAE",
        termEn: "Variational Auto-Encoder",
        description:
          "잠재 공간(Latent Space)의 데이터를 실제 이미지 픽셀로 디코딩하는 모델입니다. VAE 품질에 따라 색상 정확도와 이미지 선명도가 크게 달라집니다.",
        example:
          "vae-ft-mse-840000 (SD 1.5 표준), sdxl_vae (SDXL 표준)",
      },
      {
        termKo: "임베딩",
        termEn: "Embedding (Textual Inversion)",
        description:
          "특정 개념(스타일, 인물, 사물)을 소수의 토큰으로 학습한 경량 파일입니다. 프롬프트에 토큰 이름을 넣으면 해당 개념이 반영됩니다.",
        example:
          "negative_hand 프롬프트에 사용하여 손 형태 오류 억제",
      },
    ],
  },
  {
    category: "프롬프트 & 샘플링",
    icon: BookOpen,
    color: "text-cyan-400",
    entries: [
      {
        termKo: "프롬프트 가중치",
        termEn: "Prompt Weight",
        description:
          "특정 키워드의 AI 영향력을 수치로 조절하는 기법입니다. 괄호와 숫자를 사용하여 강조하거나 약화합니다.",
        example:
          "(high detail:1.4) → 1.4배 강조 | (blur:0.5) → 50% 약화",
      },
      {
        termKo: "네거티브 프롬프트",
        termEn: "Negative Prompt",
        description:
          "생성 결과에서 제외할 요소를 명시합니다. 원치 않는 아티팩트, 스타일, 구성 요소를 억제하는 데 필수적입니다.",
        example:
          "ugly, blurry, extra fingers, bad anatomy, watermark, text",
      },
      {
        termKo: "샘플러",
        termEn: "Sampler",
        description:
          "노이즈에서 이미지를 점진적으로 생성하는 알고리즘입니다. 샘플러 종류에 따라 생성 속도, 디테일 수준, 스타일 느낌이 달라집니다.",
        example:
          "Euler a (빠름/다양) | DPM++ 2M Karras (고품질) | UniPC (균형)",
      },
      {
        termKo: "스텝 수",
        termEn: "Steps",
        description:
          "이미지를 생성하기 위한 노이즈 제거 반복 횟수입니다. 높을수록 정밀하지만 생성 시간이 증가합니다.",
        example:
          "20~30 (표준) | 40~50 (고정밀) | 10~15 (초안/미리보기)",
      },
      {
        termKo: "CFG 스케일",
        termEn: "CFG Scale (Classifier-Free Guidance)",
        description:
          "프롬프트를 얼마나 충실히 따를지 결정하는 값입니다. 낮으면 창의적이고, 높으면 프롬프트에 충실하지만 과포화될 수 있습니다.",
        example:
          "5~7 (자연스러움) | 7~10 (표준) | 12+ (과포화 주의)",
      },
      {
        termKo: "시드",
        termEn: "Seed",
        description:
          "이미지 생성의 시작 노이즈를 결정하는 난수값입니다. 동일 시드 + 동일 파라미터 = 동일 결과를 보장하여 재현성에 필수적입니다.",
        example:
          "-1 (랜덤) | 12345 (고정값으로 일관된 결과 재현)",
      },
    ],
  },
  {
    category: "ControlNet & 구조 제어",
    icon: ScanLine,
    color: "text-teal-400",
    entries: [
      {
        termKo: "캐니 엣지",
        termEn: "Canny Edge",
        description:
          "참조 이미지의 윤곽선(Edge)을 추출합니다. 사물의 형태와 테두리를 정확하게 유지하면서 텍스처와 색상만 변경할 때 사용합니다.",
        example:
          "제품 사진의 형태를 유지한 채 배경이나 재질만 변경",
      },
      {
        termKo: "뎁스 맵",
        termEn: "Depth Map",
        description:
          "참조 이미지의 원근감과 깊이 정보를 추출합니다. 전경/배경의 공간 배치를 보존하면서 전체 스타일을 변환합니다.",
        example:
          "인테리어 사진의 공간감을 유지하며 다른 인테리어 스타일로 변환",
      },
      {
        termKo: "오픈포즈",
        termEn: "OpenPose",
        description:
          "인체의 관절 위치(스켈레톤)를 인식하여 포즈를 정확히 재현합니다. 패션, 광고, 캐릭터 디자인에서 필수적입니다.",
        example:
          "모델의 포즈를 고정한 채 의상, 배경, 조명만 교체",
      },
      {
        termKo: "세그멘테이션",
        termEn: "Segmentation",
        description:
          "이미지를 의미 있는 영역(인물, 배경, 하늘, 건물 등)으로 분割하여 각 영역에 독립적인 조건을 적용합니다.",
        example:
          "배경은 해변, 인물은 정장 차림으로 영역별 스타일 분리 적용",
      },
    ],
  },
  {
    category: "후처리 & 출력",
    icon: ArrowUpCircle,
    color: "text-violet-400",
    entries: [
      {
        termKo: "업스케일",
        termEn: "Upscale",
        description:
          "AI 알고리즘을 활용하여 이미지 해상도를 2배, 4배, 8배로 확대합니다. 단순 보간이 아닌 디테일을 추가하는 지능형 확대입니다.",
        example:
          "512×512 → 2048×2048 (4x 업스케일)",
      },
      {
        termKo: "하이어스 픽스",
        termEn: "Hires Fix",
        description:
          "업스케일 후 낮은 Denoise 강도(0.3~0.5)로 재생성하여 확대 시 발생하는 흐릿함을 보정하고 디테일을 강화합니다.",
        example:
          "Denoise: 0.4 | Upscale: 2x | Steps: 15",
      },
      {
        termKo: "잠재 공간",
        termEn: "Latent Space",
        description:
          "이미지 데이터를 압축한 수학적 표현 공간으로, AI 모델은 이 공간에서 이미지를 처리합니다. VAE가 잠재 공간 ↔ 픽셀 공간을 변환합니다.",
        example:
          "Latent Image → KSampler → VAE Decode → 최종 이미지",
      },
      {
        termKo: "배치 처리",
        termEn: "Batch Processing",
        description:
          "동일 파라미터로 여러 장의 이미지를 한 번에 생성하는 기능입니다. 시드를 순차적으로 변경하여 빠르게 다양한 결과를 비교합니다.",
        example: "Batch Size: 4 → 동시에 4장 생성하여 최적 결과 선택",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   SECTION 4 DATA — 단계별 워크플로우 가이드
   ═══════════════════════════════════════════════════════════ */
const workflowSteps = [
  {
    step: 1,
    title: "입력 노드 설정",
    subtitle: "베이스 모델 & 프롬프트 정의",
    emoji: "📥",
    nodes: ["Load Checkpoint", "CLIP Text Encode (Prompt)", "CLIP Text Encode (Negative)", "Empty Latent Image"],
    description:
      "워크플로우의 시작점입니다. 체크포인트(베이스 모델)를 로드하고, 텍스트 프롬프트와 네거티브 프롬프트를 입력합니다. Empty Latent Image 노드에서 출력 해상도(512×512, 1024×1024 등)를 설정합니다.",
    tips: [
      "체크포인트는 작업 목적에 맞게 선택 — 사실적: Realistic Vision, 일러스트: DreamShaper",
      "LoRA를 사용할 경우 Checkpoint → LoRA Loader → CLIP 순서로 연결",
      "해상도는 체크포인트 학습 해상도와 맞추는 것이 최적 (SD 1.5: 512, SDXL: 1024)",
    ],
    flow: "Checkpoint → LoRA (선택) → CLIP Encode → KSampler ← Empty Latent",
  },
  {
    step: 2,
    title: "구조 통제 (ControlNet)",
    subtitle: "레이아웃 & 포즈 고정",
    emoji: "🎯",
    nodes: ["ControlNet Loader", "Apply ControlNet", "Preprocessor (Canny/Depth/Pose)"],
    description:
      "참조 이미지를 전처리(Preprocess)하여 Canny Edge, Depth Map, OpenPose 등의 조건맵을 생성합니다. 이 조건맵을 ControlNet 노드에 연결하면 구조가 고정된 상태에서 스타일만 변경됩니다.",
    tips: [
      "ControlNet 강도(Strength)는 0.5~0.8이 안정적 — 1.0은 과적합 위험",
      "Canny + Depth를 동시 적용하면 형태와 공간감을 모두 고정 가능",
      "Start/End Percent로 ControlNet이 적용되는 디노이즈 구간을 제어",
    ],
    flow: "참조 이미지 → Preprocessor → ControlNet Apply → KSampler",
  },
  {
    step: 3,
    title: "생성 & 샘플링",
    subtitle: "KSampler 핵심 파라미터",
    emoji: "⚡",
    nodes: ["KSampler", "KSampler (Advanced)"],
    description:
      "KSampler는 모든 입력(모델, 프롬프트, 잠재 이미지, ControlNet)을 받아 실제 이미지를 생성하는 핵심 노드입니다. Steps, CFG Scale, Sampler, Seed를 여기서 설정합니다.",
    tips: [
      "초안 단계: Steps 15, CFG 7, Euler a — 빠른 반복 탐색",
      "최종 렌더: Steps 30~40, CFG 8, DPM++ 2M Karras — 고품질 출력",
      "Seed를 고정한 뒤 프롬프트만 변경하면 구도를 유지하며 스타일 반복 가능",
    ],
    flow: "Model + Positive/Negative + Latent + ControlNet → KSampler → VAE Decode",
  },
  {
    step: 4,
    title: "출력 & 업스케일",
    subtitle: "고해상도 변환 & 최종 저장",
    emoji: "📤",
    nodes: ["VAE Decode", "Upscale Model Loader", "Image Scale", "Save Image"],
    description:
      "KSampler의 출력(Latent)을 VAE Decode로 픽셀 이미지로 변환한 뒤, 업스케일 모델로 해상도를 확대합니다. 필요시 Hires Fix(낮은 Denoise로 재생성)를 추가하여 디테일을 보강합니다.",
    tips: [
      "VAE Decode → Upscale(2x) → KSampler(Denoise 0.35) 순서가 Hires Fix 표준 워크플로우",
      "인쇄물이라면 최소 300 DPI(4096px 이상)까지 업스케일 필요",
      "Save Image 노드에서 파일명 패턴을 설정하면 자동 넘버링으로 관리 편리",
    ],
    flow: "KSampler → VAE Decode → Upscale → (Hires Fix) → Save Image",
  },
];

/* ═══════════════════════════════════════════════════════════
   SECTION 5 DATA — 실전 프리셋
   ═══════════════════════════════════════════════════════════ */
const presets = [
  {
    name: "브랜드 제품 사진 (사실적)",
    prompt:
      "Checkpoint: Realistic Vision v5.1\nPrompt: luxury watch on marble surface, studio lighting, 50mm macro, sharp focus, commercial photography\nNegative: blur, noise, cartoon, illustration, watermark\nSteps: 30 | CFG: 7 | Sampler: DPM++ 2M Karras\nUpscale: 4x RealESRGAN → Hires Fix (Denoise 0.35)",
  },
  {
    name: "일러스트 · 캐릭터 디자인",
    prompt:
      "Checkpoint: DreamShaper XL\nLoRA: anime_style (Strength: 0.7)\nPrompt: character design sheet, warrior in armor, multiple angles, white background, concept art\nNegative: photo, realistic, low quality, text\nSteps: 25 | CFG: 8 | Sampler: Euler a",
  },
  {
    name: "건축 인테리어 (ControlNet Depth)",
    prompt:
      "Checkpoint: SDXL Base\nControlNet: Depth (Strength: 0.7)\nPrompt: modern minimalist living room, Scandinavian design, natural light, wooden floor, clean lines\nNegative: cluttered, old, dark, cartoon\nSteps: 30 | CFG: 7 | Sampler: DPM++ SDE Karras",
  },
  {
    name: "패션 룩북 (ControlNet OpenPose)",
    prompt:
      "Checkpoint: Realistic Vision v5.1\nControlNet: OpenPose (Strength: 0.65)\nPrompt: fashion editorial, model wearing oversized blazer, studio shot, softbox lighting, full body\nNegative: extra fingers, bad hands, distorted face, watermark\nSteps: 35 | CFG: 7.5 | Sampler: DPM++ 2M Karras",
  },
  {
    name: "소셜 미디어 배너 (멀티 LoRA)",
    prompt:
      "Checkpoint: SDXL Base\nLoRA 1: film_grain (0.4) + LoRA 2: vibrant_colors (0.6)\nPrompt: seasonal promotion banner, spring flowers, pastel gradients, modern typography space\nNegative: text, watermark, low quality, blurry\nSteps: 25 | CFG: 8 | Resolution: 1216×832 (3:2)",
  },
  {
    name: "고해상도 인쇄물 (4x 업스케일 파이프라인)",
    prompt:
      "Checkpoint: SDXL Base\nStep 1: 1024×1024 생성 (Steps 30, CFG 7)\nStep 2: Upscale 4x (RealESRGAN)\nStep 3: Hires Fix KSampler (Denoise 0.3, Steps 15)\nFinal: 4096×4096 → Save PNG\nNegative: blur, noise, compression artifacts",
  },
];

const cheatSheet = {
  avoid: [
    "체크포인트 해상도 무시 (SD1.5에 1024px → 구도 깨짐)",
    "CFG 15 이상 (과포화 · 인공적 결과)",
    "ControlNet Strength 1.0 (과적합 · 유연성 상실)",
    "네거티브 프롬프트 생략 (품질 저하의 주범)",
  ],
  mustInclude: [
    "체크포인트 + 목적에 맞는 LoRA 조합",
    "프롬프트 가중치로 핵심 요소 강조",
    "ControlNet으로 구조 고정 (특히 상업 작업)",
    "업스케일 + Hires Fix 후처리 파이프라인",
  ],
  proTips: [
    "초안 단계에서는 Steps 15, 512px로 빠르게 반복 → 확정 후 30 Steps + 업스케일",
    "LoRA Strength은 0.5~0.7이 안전 범위. 1.0은 스타일이 과하게 적용됩니다.",
    "Seed를 고정하면 프롬프트 한 단어 변경의 효과를 정확히 비교 가능합니다.",
    "워크플로우를 JSON으로 저장해 두면 팀원들과 동일한 결과를 재현할 수 있습니다.",
  ],
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function WeavyGuideClient() {
  const { toast } = useToast();
  const [expandedMenu, setExpandedMenu] = useState<string | null>("Node Canvas");
  const [expandedGlossaryCat, setExpandedGlossaryCat] = useState<string | null>(
    "모델 & 학습"
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
        <div className="glass-card p-8 md:p-10 border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/8 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6 flex items-center gap-3">
              <Zap className="text-amber-400" size={28} />
              위비 핵심 철학
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  emoji: "🔗",
                  title: "노드 간의 연결 (Flow)",
                  desc: "위비에서는 단일 프롬프트가 아니라 '노드 간의 연결(Flow)'을 통해 이미지를 생성하고 제어합니다. 각 기능을 독립적인 모듈로 분리하여 원하는 순서로 조합하는 것이 핵심입니다.",
                },
                {
                  emoji: "🎨",
                  title: "예술적 지능 (Artistic Intelligence)",
                  desc: "AI 생성 능력과 인간의 크래프트(편집, 합성, 색보정)를 하나의 캔버스에서 결합합니다. 자동화와 수동 제어의 완벽한 균형을 추구합니다.",
                },
                {
                  emoji: "♻️",
                  title: "반복 가능한 디자인 머신",
                  desc: "완성된 워크플로우를 저장하면 '디자인 머신'이 됩니다. 동일한 파이프라인에 다른 입력만 바꿔 넣으면 일관된 품질의 결과물을 반복 생산할 수 있습니다.",
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

      {/* ───────── SECTION 2: 필수 메뉴 & 기능 ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <GitBranch className="text-amber-400" size={28} />
          필수 메뉴 및 기능 설명
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          위비의 핵심 노드와 기능을 그룹별로 정리했습니다. 각 항목을 클릭하면
          상세 설명과 활용법이 표시됩니다.
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
                                    <span className="text-amber-400 font-bold shrink-0 mt-0.5">
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

      {/* ───────── SECTION 3: 실전 용어 사전 ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <BookOpen className="text-amber-400" size={28} />
          실전 용어 사전 (Glossary)
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          위비 노드 워크플로우에서 반드시 알아야 할 전문 용어를 [한국어 (영어
          원어)] 형태로 정리했습니다.
        </p>

        <div className="space-y-6">
          {glossary.map((cat) => {
            const CatIcon = cat.icon;
            const isOpen = expandedGlossaryCat === cat.category;
            return (
              <div
                key={cat.category}
                className="glass-card border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedGlossaryCat(isOpen ? null : cat.category)
                  }
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  <CatIcon size={22} className={cat.color} />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{cat.category}</h3>
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
                          <div className="col-span-3">사용 예시</div>
                        </div>

                        {/* Table Rows */}
                        {cat.entries.map((entry, ei) => (
                          <div
                            key={ei}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                          >
                            <div className="md:col-span-3">
                              <code className="text-sm text-amber-400 font-mono font-bold">
                                {entry.termKo}
                              </code>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {entry.termEn}
                              </div>
                            </div>
                            <div className="md:col-span-6 text-sm text-slate-300 leading-relaxed">
                              {entry.description}
                            </div>
                            <div className="md:col-span-3">
                              {entry.example && (
                                <span className="text-xs font-medium text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/40 inline-block leading-relaxed">
                                  {entry.example}
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

      {/* ───────── SECTION 4: 단계별 워크플로우 가이드 ───────── */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
          <Workflow className="text-amber-400" size={28} />
          단계별 워크플로우 가이드
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          위비의 표준 이미지 생성 파이프라인 4단계를 순서대로 따라가세요.
        </p>

        <div className="space-y-6">
          {workflowSteps.map((ws, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card p-6 md:p-8 border-slate-800 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start gap-5">
                {/* Step Number */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-2xl">{ws.emoji}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Step {ws.step}
                    </span>
                    <h3 className="font-bold text-lg">{ws.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{ws.subtitle}</p>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {ws.description}
                  </p>

                  {/* Nodes Used */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ws.nodes.map((node, ni) => (
                      <span
                        key={ni}
                        className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20"
                      >
                        {node}
                      </span>
                    ))}
                  </div>

                  {/* Flow Diagram */}
                  <div className="bg-slate-900/80 rounded-lg px-4 py-2.5 border border-slate-700 mb-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      노드 연결 순서
                    </p>
                    <code className="text-xs text-amber-400 font-mono">
                      {ws.flow}
                    </code>
                  </div>

                  {/* Tips */}
                  <ul className="space-y-1.5">
                    {ws.tips.map((tip, ti) => (
                      <li
                        key={ti}
                        className="text-xs text-slate-400 flex items-start gap-2"
                      >
                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">
                          💡
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
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
                브랜드 디자인팀이 즉시 활용 가능한 위비 워크플로우 프리셋입니다.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {presets.map((preset, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-slate-900/80 rounded-xl p-5 border border-slate-700 hover:border-amber-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        {preset.name}
                      </h4>
                      <button
                        onClick={() => copyText(preset.prompt)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
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
              <h3 className="font-bold text-white mb-5">위비 치트 시트</h3>

              <div className="space-y-5">
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    🚫 절대 피해야 할 실수
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
                        className="text-sm text-amber-400 font-medium"
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
