export type Platform = "nanobanana" | "midjourney" | "higsfield" | "weavy";

export interface KnowledgeItem {
  id: string;
  title: string;
  category: "lens" | "angle" | "lighting" | "style" | "parameters" | "workflow_node";
  description: string;
  platforms: Platform[];
  thumbnailUrl?: string;
  videoUrl?: string; // used for platforms like higsfield
  tags: string[];
  examplePrompt?: string;
  // For node-based like Weavy
  nodeGraphImage?: string;
  workflowAutomationGuide?: string;
}

export interface WeavyParams {
  prompt: string;
  workflowNodes: Record<string, unknown>; // JSON mapping of nodes like Style, Composition
  modelType: string;
  nodeGraphImage?: string;
  nodeMappingGuide: string; // Explains how the analysis results map to Weavy nodes
}

export interface PromptAnalysisResult {
  subject: string;
  composition: string;
  lighting: string;
  style: string;
  platformPrompts: {
    nanobanana: string;
    midjourney: string;
    higsfield: {
      prompt: string;
      motionStrength: number;
    };
    weavy: WeavyParams;
  };
}
