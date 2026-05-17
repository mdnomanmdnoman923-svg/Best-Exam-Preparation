// bep-full-project/src/pages/protected/AiAssistantPage.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  ClipboardCopy,
  Clock3,
  Copy,
  Flame,
  Lightbulb,
  Loader2,
  MessageCircle,
  Mic,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  Target,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

type ChatRole = 'user' | 'assistant' | 'system';

type AiModel = 'smart' | 'premium' | 'study';

interface ChatMessageItem {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  tokens?: number;
  subject?: string;
  chapter?: string;
}

interface PromptSuggestion {
  id: string;
  label: string;
  prompt: string;
  icon: React.ReactNode;
}

const initialMessages: ChatMessageItem[] = [
  {
    id: 'msg-1',
    role: 'system',
    content:
      'BEP AI Assistant ready. Ask anything about subjects, chapters, practice, exams, or weak topics.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content:
      'স্বাগতম! আমি তোমার study assistant. তুমি চাইলে chapter explain, MCQ solve, or exam strategy বানিয়ে দিতে পারি।',
    createdAt: new Date().toISOString(),
    tokens: 64,
  },
];

const suggestions: PromptSuggestion[] = [
  {
    id: 's-1',
    label: 'Explain a chapter',
    prompt: 'Physics chapter on motion and force সহজভাবে explain করো এবং 5 point summary দাও।',
    icon: <BookIcon />,
  },
  {
    id: 's-2',
    label: 'Solve a question',
    prompt: '2x + 5 = 17 equation solve করে step-by-step দেখাও।',
    icon: <Target className="h-4 w-4" />,
  },
  {
    id: 's-3',
    label: 'Make a quiz',
    prompt: 'Photosynthesis topic নিয়ে 10 MCQ quiz বানাও with answers.',
    icon: <Wand2 className="h-4 w-4" />,
  },
  {
    id: 's-4',
    label: 'Study plan',
    prompt: 'HSC exam এর জন্য 7-day study plan বানাও for Math, Physics, and English.',
    icon: <Flame className="h-4 w-4" />,
  },
];

function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatTime(value: string) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '--';
  }
}

function mockAiReply(prompt: string): string {
  const normalized = prompt.toLowerCase();

  if (normalized.includes('physics') || normalized.includes('motion') || normalized.includes('force')) {
    return [
      'Absolutely — let’s break it down simply:',
      '',
      '1. Motion means a body changes its position with time.',
      '2. Speed = distance / time.',
      '3. Velocity = speed with direction.',
      '4. Force can change motion, stop motion, or change direction.',
      '5. If net force is zero, motion stays uniform.',
      '',
      'Quick exam tip: always write formula first, then substitute values carefully.',
    ].join('\n');
  }

  if (normalized.includes('mcq') || normalized.includes('quiz')) {
    return [
      'Nice — I can turn that into a quick practice set.',
      '',
      'Here’s a compact pattern:',
      '• 4 easy questions to warm up',
      '• 3 medium questions for concept depth',
      '• 3 hard questions for exam readiness',
      '',
      'If you want, I can also give you answer explanations and difficulty tags.',
    ].join('\n');
  }

  if (normalized.includes('study plan') || normalized.includes('routine')) {
    return [
      'Got it. A strong study plan should keep review and practice balanced.',
      '',
      'Suggested structure:',
      '• Morning: new concept learning',
      '• Afternoon: solved examples + notes',
      '• Evening: MCQ practice + ভুল correction',
      '• Night: quick revision and recall',
      '',
      'Tip: keep 20–30% of your time for revision, not just new reading.',
    ].join('\n');
  }

  return [
    'I’ve got you.',
    '',
    'Here’s a clear, exam-friendly answer:',
    '• Start with the core idea',
    '• Break it into steps',
    '• Add 1–2 examples',
    '• End with a short revision note',
    '',
    'If you want, I can also turn this into a quiz, summary, or flashcards.',
  ].join('\n');
}

function ChatBubble({
  message,
  onCopy,
}: {
  message: ChatMessageItem;
  onCopy: (content: string) => void;
}) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const bubbleClasses = isSystem
    ? 'border-cyan-400/15 bg-cyan-400/10 text-cyan-50'
    : isUser
      ? 'ml-auto border-fuchsia-400/15 bg-fuchsia-400/10 text-white'
      : 'border-white/10 bg-white/[0.04] text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={['max-w-[92%] rounded-[28px] border p-4 sm:max-w-[80%]', bubbleClasses].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
          {isSystem ? (
            <Sparkles className="h-4 w-4 text-cyan-100" />
          ) : isUser ? (
            <MessageCircle className="h-4 w-4 text-fuchsia-100" />
          ) : (
            <Bot className="h-4 w-4 text-emerald-100" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">
              {isSystem ? 'System' : isUser ? 'You' : 'BEP AI'}
            </span>

            {!isSystem ? (
              <Badge variant={isUser ? 'premium' : 'success'}>
                {isUser ? 'Input' : 'Assistant'}
              </Badge>
            ) : null}

            <span className="text-xs text-white/40">{formatTime(message.createdAt)}</span>
          </div>

          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
            {message.content}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {typeof message.tokens === 'number' ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/50">
                <Brain className="h-3.5 w-3.5" />
                {message.tokens} tokens
              </span>
            ) : null}

            {!isSystem ? (
              <button
                type="button"
                onClick={() => onCopy(message.content)}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/55 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60">
      <Loader2 className="h-4 w-4 animate-spin text-cyan-100" />
      <span>AI is thinking</span>
      <span className="inline-flex items-center gap-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white/50" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-white/40 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-white/30 [animation-delay:300ms]" />
      </span>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  accent = 'cyan',
  note,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
  note?: string;
}) {
  const accentMap = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  } as const;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/55">{title}</p>
          <h3 className="mt-2 text-4xl font-black tracking-tight text-white">{value}</h3>
          {note ? <p className="mt-2 text-sm text-white/45">{note}</p> : null}
        </div>

        <div className={['flex h-14 w-14 items-center justify-center rounded-2xl border', accentMap[accent]].join(' ')}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function BookIcon() {
  return <BookOpen className="h-4 w-4" />;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages);
  const [prompt, setPrompt] = useState('');
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState<AiModel>('smart');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Motion');
  const [tone, setTone] = useState<'clear' | 'friendly' | 'exam'>('clear');

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stats = useMemo(() => {
    const userCount = messages.filter((message) => message.role === 'user').length;
    const assistantCount = messages.filter((message) => message.role === 'assistant').length;
    const tokenCount = messages.reduce((sum, message) => sum + (message.tokens || 0), 0);

    return {
      messages: messages.length,
      prompts: userCount,
      replies: assistantCount,
      tokens: tokenCount,
    };
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const pushMessage = (message: ChatMessageItem) => {
    setMessages((previous) => [...previous, message]);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // noop
    }
  };

  const clearChat = () => {
    setMessages(initialMessages);
    setPrompt('');
    setSending(false);
  };

  const handleSuggestion = (suggestion: PromptSuggestion) => {
    setPrompt(suggestion.prompt);
    inputRef.current?.focus();
  };

  const sendMessage = async () => {
    const value = prompt.trim();
    if (!value || sending) return;

    const userMessage: ChatMessageItem = {
      id: uid('user'),
      role: 'user',
      content: value,
      createdAt: new Date().toISOString(),
      subject,
      chapter,
    };

    pushMessage(userMessage);
    setPrompt('');
    setSending(true);

    const replyDelay = model === 'premium' ? 900 : model === 'study' ? 1100 : 800;

    timeoutRef.current = setTimeout(() => {
      const aiText = mockAiReply(value);

      const assistantMessage: ChatMessageItem = {
        id: uid('assistant'),
        role: 'assistant',
        content:
          model === 'premium'
            ? `${aiText}\n\nPremium mode note: আমি আরও structured explanation, examples, and revision bullets দিতে পারি।`
            : model === 'study'
              ? `${aiText}\n\nStudy mode note: আমি concept clarity, memory cues, and practice focus prioritize করছি।`
              : aiText,
        createdAt: new Date().toISOString(),
        tokens: Math.max(48, Math.round(value.length * 1.8)),
        subject,
        chapter,
      };

      pushMessage(assistantMessage);
      setSending(false);
    }, replyDelay);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  BEP AI Workspace
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  AI Assistant
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Bengali-first learning help, quiz generation, quick explanations, and exam-ready study support.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Live
                </Badge>
                <Badge variant="premium">
                  <Star className="mr-1 h-3.5 w-3.5" />
                  Smart Reply
                </Badge>
                <Badge variant="secondary">
                  {model === 'smart' ? 'Smart' : model === 'premium' ? 'Premium' : 'Study'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Messages"
            value={stats.messages}
            icon={<MessageCircle className="h-5 w-5" />}
            accent="cyan"
            note="Conversation turns"
          />
          <StatCard
            title="Prompts"
            value={stats.prompts}
            icon={<Send className="h-5 w-5" />}
            accent="emerald"
            note="User submitted prompts"
          />
          <StatCard
            title="Replies"
            value={stats.replies}
            icon={<Bot className="h-5 w-5" />}
            accent="fuchsia"
            note="Assistant responses"
          />
          <StatCard
            title="Tokens"
            value={stats.tokens}
            icon={<Brain className="h-5 w-5" />}
            accent="amber"
            note="Estimated total used"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-semibold">Conversation</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/55">
                    Ask a question, generate practice content, or request a summary.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="premium">Model: {model}</Badge>
                  <Badge variant="secondary">
                    <Clock3 className="mr-1 h-3.5 w-3.5" />
                    Fast response
                  </Badge>
                </div>
              </div>
            </div>

            <div className="max-h-[620px] space-y-4 overflow-y-auto p-5">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} onCopy={handleCopy} />
              ))}

              {sending ? <TypingIndicator /> : null}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  Subject: {subject}
                </Badge>
                <Badge variant="secondary">
                  Chapter: {chapter}
                </Badge>
                <Badge variant="secondary">
                  Tone: {tone}
                </Badge>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
                    Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as AiModel)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="smart">Smart</option>
                    <option value="premium">Premium</option>
                    <option value="study">Study</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
                    Subject
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    placeholder="Subject"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
                    Chapter
                  </label>
                  <input
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    placeholder="Chapter"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(['clear', 'friendly', 'exam'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTone(item)}
                    className={[
                      'rounded-full border px-4 py-2 text-sm font-semibold transition',
                      tone === item
                        ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                        : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[28px] border border-white/10 bg-[#08111F]/75 p-4">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
                  rows={4}
                  className="w-full resize-none bg-transparent text-sm leading-7 text-white outline-none placeholder:text-white/30"
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPrompt((prev) => `${prev}${prev ? '\n' : ''}Explain this in simple Bengali.`)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/55 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Quick add
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrompt('')}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/55 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear
                    </button>

                    <button
                      type="button"
                      onClick={clearChat}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/55 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Reset chat
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                      title="Voice input"
                    >
                      <Mic className="h-4 w-4" />
                    </button>

                    <Button
                      onClick={sendMessage}
                      disabled={sending || !prompt.trim()}
                      leftIcon={
                        sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )
                      }
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-semibold">Prompt suggestions</span>
              </div>

              <div className="space-y-3">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSuggestion(item)}
                    className="group w-full rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                          <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-cyan-100" />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/55">
                          {item.prompt}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
                <Wand2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Assistant modes</span>
              </div>

              <div className="space-y-3">
                <ModeCard
                  title="Smart mode"
                  description="Balanced explanation, quick reply, and concise study guidance."
                  active={model === 'smart'}
                  icon={<Bot className="h-4 w-4" />}
                />
                <ModeCard
                  title="Premium mode"
                  description="More structured answer, richer breakdown, and better examples."
                  active={model === 'premium'}
                  icon={<Star className="h-4 w-4" />}
                />
                <ModeCard
                  title="Study mode"
                  description="Focus on concept clarity, revision cues, and practice prompts."
                  active={model === 'study'}
                  icon={<Brain className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#08111F]/75 p-5 shadow-[0_16px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 text-emerald-100">
                <Target className="h-4 w-4" />
                <span className="text-sm font-semibold">Usage tips</span>
              </div>

              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>Short, direct prompt দিলে AI faster and cleaner output দেবে।</p>
                <p>Subject + chapter দিলে response আরও context-aware হয়।</p>
                <p>Exam mode ব্যবহার করলে concise revision bullets পাওয়া যায়।</p>
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  Best results for BEP: ask for summary, quiz, explanation, or step-by-step solving.
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 text-amber-100">
                <Loader2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Quick tools</span>
              </div>

              <div className="grid gap-3">
                <ToolRow label="Regenerate answer" icon={<RefreshCw className="h-4 w-4" />} />
                <ToolRow label="Copy latest reply" icon={<ClipboardCopy className="h-4 w-4" />} />
                <ToolRow label="Generate quiz" icon={<Plus className="h-4 w-4" />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  title,
  description,
  active,
  icon,
}: {
  title: string;
  description: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={[
        'rounded-[24px] border p-4 transition',
        active
          ? 'border-cyan-400/20 bg-cyan-400/10'
          : 'border-white/10 bg-[#08111F]/75',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            {active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Available</Badge>}
          </div>
          <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ToolRow({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-between rounded-[22px] border border-white/10 bg-[#08111F]/75 px-4 py-3 text-left text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white"
    >
      <span>{label}</span>
      <span className="text-cyan-100">{icon}</span>
    </button>
  );
}
