// bep-full-project/src/features/ai/services/ai.service.ts

import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

export type AIRole =
  | 'system'
  | 'user'
  | 'assistant';

export interface AIChatMessage {
  id?: string;
  role: AIRole;
  content: string;
  createdAt?: string | Date;
}

export interface AIConversation {
  id?: string;
  userId: string;
  title: string;
  lastMessage: string;
  totalMessages: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AIResponse {
  success: boolean;
  message: string;
  suggestions?: string[];
  tokensUsed?: number;
  model?: string;
}

export interface GenerateResponsePayload {
  prompt: string;
  history?: AIChatMessage[];
  userId?: string;
  subject?: string;
  chapter?: string;
}

const AI_COLLECTIONS = {
  conversations: 'ai_conversations',
  messages: 'ai_messages',
};

class AIService {
  async generateResponse(
    payload: GenerateResponsePayload,
  ): Promise<AIResponse> {
    try {
      const cleanPrompt =
        payload.prompt.trim();

      if (!cleanPrompt) {
        return {
          success: false,
          message:
            'প্রশ্ন পাওয়া যায়নি। আবার চেষ্টা করুন।',
        };
      }

      const generated =
        this.generateMockResponse(
          cleanPrompt,
          payload.subject,
        );

      return {
        success: true,
        message: generated,
        suggestions: [
          'আরও সহজভাবে explain করো',
          'MCQ practice দাও',
          'Shortcut technique দেখাও',
        ],
        tokensUsed:
          Math.floor(
            cleanPrompt.length * 1.4,
          ) + 80,
        model: 'BEP-AI-v2',
      };
    } catch (error) {
      console.error(
        'AI generateResponse error:',
        error,
      );

      return {
        success: false,
        message:
          'AI response generate করা যায়নি।',
      };
    }
  }

  async createConversation(
    data: Omit<
      AIConversation,
      'id'
    >,
  ) {
    try {
      const docRef = await addDoc(
        collection(
          db,
          AI_COLLECTIONS.conversations,
        ),
        {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      );

      return {
        success: true,
        id: docRef.id,
      };
    } catch (error) {
      console.error(
        'createConversation error:',
        error,
      );

      return {
        success: false,
        id: null,
      };
    }
  }

  async saveMessage(
    conversationId: string,
    message: AIChatMessage,
  ) {
    try {
      const docRef = await addDoc(
        collection(
          db,
          AI_COLLECTIONS.messages,
        ),
        {
          conversationId,
          ...message,
          createdAt: serverTimestamp(),
        },
      );

      return {
        success: true,
        id: docRef.id,
      };
    } catch (error) {
      console.error(
        'saveMessage error:',
        error,
      );

      return {
        success: false,
        id: null,
      };
    }
  }

  async getConversationMessages(
    conversationId: string,
  ): Promise<AIChatMessage[]> {
    try {
      const q = query(
        collection(
          db,
          AI_COLLECTIONS.messages,
        ),
        where(
          'conversationId',
          '==',
          conversationId,
        ),
        orderBy('createdAt', 'asc'),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as AIChatMessage),
      }));
    } catch (error) {
      console.error(
        'getConversationMessages error:',
        error,
      );

      return [];
    }
  }

  async getUserConversations(
    userId: string,
  ): Promise<AIConversation[]> {
    try {
      const q = query(
        collection(
          db,
          AI_COLLECTIONS.conversations,
        ),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc'),
        limit(20),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as AIConversation),
      }));
    } catch (error) {
      console.error(
        'getUserConversations error:',
        error,
      );

      return [];
    }
  }

  async createStudySummary(
    topic: string,
  ): Promise<string> {
    return `
📘 Topic: ${topic}

• মূল concept আগে বুঝতে হবে
• গুরুত্বপূর্ণ formula আলাদা note করুন
• প্রতিদিন practice MCQ solve করুন
• ভুল প্রশ্নগুলো revise করুন
• Mock exam দিয়ে performance analyze করুন

BEP AI Suggestion:
Concept → Practice → Revision → Mock Test
`;
  }

  async generateMCQPractice(
    topic: string,
    amount = 5,
  ) {
    return Array.from({
      length: amount,
    }).map((_, index) => ({
      id: `${topic}-${index + 1}`,
      question: `${topic} related practice question ${
        index + 1
      }`,
      options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D',
      ],
      correctAnswer: 0,
      explanation:
        'এই প্রশ্নের ব্যাখ্যা এখানে দেখানো হবে।',
    }));
  }

  private generateMockResponse(
    prompt: string,
    subject?: string,
  ) {
    const lower =
      prompt.toLowerCase();

    if (
      lower.includes('math') ||
      lower.includes('সমীকরণ')
    ) {
      return `
📘 গণিত সমাধান:

প্রথমে সমস্যাটি step-by-step analyze করতে হবে।

✅ গুরুত্বপূর্ণ ধাপ:
1. প্রদত্ত তথ্য identify করুন
2. সঠিক formula apply করুন
3. Calculation simplify করুন
4. Final answer verify করুন

BEP AI Tip:
Practice বেশি করলে solving speed অনেক improve হবে।
`;
    }

    if (
      lower.includes('physics') ||
      lower.includes('বল')
    ) {
      return `
⚡ Physics Explanation:

Physics concept বোঝার জন্য real-life example খুব গুরুত্বপূর্ণ।

✅ Example:
নিউটনের দ্বিতীয় সূত্র অনুযায়ী:
Force = Mass × Acceleration

মানে ভর বেশি হলে একই acceleration দিতে বেশি বল প্রয়োজন হয়।

📌 Exam Tip:
Formula মুখস্থ না করে concept বুঝে practice করুন।
`;
    }

    if (
      lower.includes('chemistry') ||
      lower.includes('রাসায়নিক')
    ) {
      return `
🧪 Chemistry Concept:

রাসায়নিক বিক্রিয়ায় reactant product এ পরিবর্তিত হয়।

✅ মনে রাখুন:
• Equation balance করতে হবে
• Valency বুঝতে হবে
• Periodic table practice জরুরি

BEP Smart Tip:
Reaction mechanism diagram আকারে পড়লে দ্রুত মনে থাকে।
`;
    }

    return `
🤖 BEP AI Assistant

আপনার প্রশ্ন বিশ্লেষণ করা হয়েছে।

📚 Smart Guidance:
• Concept clear করার চেষ্টা করুন
• নিয়মিত practice দিন
• Mock exam participate করুন
• Weak topic revise করুন

${subject ? `📖 Subject: ${subject}` : ''}

আরও specific question করলে আমি আরো detailed explanation দিতে পারব।
`;
  }
}

export const aiService =
  new AIService();

export default aiService;
