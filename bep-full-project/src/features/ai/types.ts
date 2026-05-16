// bep-full-project/src/features/ai/types.ts

export type AIRole =
  | 'system'
  | 'user'
  | 'assistant';

export type AIModel =
  | 'BEP-AI-v1'
  | 'BEP-AI-v2'
  | 'BEP-AI-Pro'
  | 'GPT-4'
  | 'Gemini'
  | 'Claude';

export type AIMessageStatus =
  | 'sending'
  | 'sent'
  | 'failed'
  | 'typing';

export type AIConversationVisibility =
  | 'private'
  | 'shared';

export interface AIMessageAttachment {
  id: string;
  type:
    | 'image'
    | 'pdf'
    | 'document'
    | 'audio';
  name: string;
  url: string;
  size?: number;
}

export interface AIChatMessage {
  id: string;
  role: AIRole;
  content: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  status?: AIMessageStatus;
  model?: AIModel;
  tokens?: number;
  bookmarked?: boolean;
  attachments?: AIMessageAttachment[];
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  visibility: AIConversationVisibility;
  lastMessage: string;
  lastMessageAt: string | Date;
  totalMessages: number;
  totalTokens?: number;
  pinned?: boolean;
  archived?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface AIQuickPrompt {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  category:
    | 'study'
    | 'mcq'
    | 'math'
    | 'science'
    | 'admission'
    | 'productivity';
  icon?: string;
}

export interface AIResponse {
  success: boolean;
  message: string;
  model: AIModel;
  tokensUsed?: number;
  responseTime?: number;
  suggestions?: string[];
  error?: string | null;
}

export interface AIGeneratePayload {
  prompt: string;
  userId?: string;
  subject?: string;
  chapter?: string;
  history?: AIChatMessage[];
  model?: AIModel;
}

export interface AIUsageStats {
  totalMessages: number;
  totalTokens: number;
  averageResponseTime: number;
  studyHoursSaved: number;
  mostUsedSubject?: string;
}

export interface AIStudyRecommendation {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority:
    | 'low'
    | 'medium'
    | 'high';
  estimatedTime: string;
}

export interface AIMCQPractice {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty:
    | 'easy'
    | 'medium'
    | 'hard';
  topic?: string;
}

export interface AILeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  streak: number;
  rank: number;
}

export interface AIContextState {
  activeConversationId?: string | null;
  selectedModel: AIModel;
  typing: boolean;
  generating: boolean;
  messages: AIChatMessage[];
  conversations: AIConversation[];
  quickPrompts: AIQuickPrompt[];
}

export interface AISettings {
  autoSave: boolean;
  enableSuggestions: boolean;
  preferredModel: AIModel;
  language: 'bn' | 'en';
  voiceEnabled: boolean;
}

export interface AITopicAnalysis {
  topic: string;
  strength: number;
  weakness: number;
  recommendedPractice: number;
}

export interface AIExamPrediction {
  subject: string;
  predictedScore: number;
  confidence: number;
  weakTopics: string[];
  suggestedActions: string[];
}
