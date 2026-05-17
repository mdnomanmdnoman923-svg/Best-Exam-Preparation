// bep-full-project/src/pages/protected/CommunityPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Clock3,
  Crown,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
  Users,
  Wand2,
  X,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type PostCategory =
  | 'discussion'
  | 'question'
  | 'announcement'
  | 'study-tip';

interface CommunityReply {
  id: string;
  author: string;
  role?: string;
  content: string;
  createdAt: string;
  likes: number;
}

interface CommunityPost {
  id: string;
  author: string;
  role?: string;
  avatar?: string;
  category: PostCategory;
  title: string;
  content: string;
  subject?: string;
  tags: string[];
  createdAt: string;
  likes: number;
  replies: CommunityReply[];
  premium?: boolean;
  pinned?: boolean;
  verified?: boolean;
  bookmarked?: boolean;
}

const seedPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Arafat Hossain',
    role: 'Student',
    avatar: 'https://i.pravatar.cc/200?img=12',
    category: 'question',
    title: 'Physics motion problem help needed',
    content:
      'একটি বস্তু 5s এ 20m distance cover করলে speed কত হবে? আমি formula বুঝি, কিন্তু answer step-by-step চাই।',
    subject: 'Physics',
    tags: ['motion', 'speed', 'hsc'],
    createdAt: new Date().toISOString(),
    likes: 24,
    replies: [
      {
        id: 'reply-1',
        author: 'BEP AI Helper',
        role: 'AI',
        content:
          'Speed = distance / time = 20 / 5 = 4 m/s. Formula বসানোর আগে unit check করতে ভুলবে না।',
        createdAt: new Date().toISOString(),
        likes: 12,
      },
      {
        id: 'reply-2',
        author: 'Nusrat Jahan',
        role: 'Student',
        content:
          'আরও সহজে মনে রাখার জন্য distance ÷ time = speed, এই mnemonic use করতে পারো।',
        createdAt: new Date().toISOString(),
        likes: 6,
      },
    ],
    verified: true,
    bookmarked: true,
  },
  {
    id: 'post-2',
    author: 'BEP Team',
    role: 'Official',
    avatar: 'https://i.pravatar.cc/200?img=5',
    category: 'announcement',
    title: 'Weekly challenge is live',
    content:
      'এ সপ্তাহে top accuracy এবং longest streak ধরে রাখার challenge live আছে। Practice করতে থাকো, leaderboard climb করো!',
    subject: 'Leaderboard',
    tags: ['challenge', 'leaderboard', 'premium'],
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    likes: 148,
    replies: [],
    premium: true,
    pinned: true,
    verified: true,
  },
  {
    id: 'post-3',
    author: 'Mim Akter',
    role: 'Moderator',
    avatar: 'https://i.pravatar.cc/200?img=32',
    category: 'study-tip',
    title: 'My 20-minute revision routine before exams',
    content:
      'আমি exam এর আগে 20 minute এ 3 ভাগে revision করি: 10 min formula, 5 min solved examples, 5 min mistake log review. এটা surprisingly effective.',
    subject: 'Study Tips',
    tags: ['revision', 'routine', 'exam'],
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likes: 89,
    replies: [
      {
        id: 'reply-3',
        author: 'Sabbir Rahman',
        role: 'Moderator',
        content:
          'This is solid. Mistake log review genuinely saves marks on repeat questions.',
        createdAt: new Date().toISOString(),
        likes: 18,
      },
    ],
    verified: true,
    bookmarked: false,
  },
];

const categories: Array<{ id: 'all' | PostCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'question', label: 'Questions' },
  { id: 'announcement', label: 'Announcements' },
  { id: 'study-tip', label: 'Study Tips' },
];

function categoryLabel(category: PostCategory) {
  switch (category) {
    case 'discussion':
      return 'Discussion';
    case 'question':
      return 'Question';
    case 'announcement':
      return 'Announcement';
    case 'study-tip':
      return 'Study Tip';
    default:
      return 'Post';
  }
}

function categoryVariant(category: PostCategory) {
  switch (category) {
    case 'discussion':
      return 'secondary' as const;
    case 'question':
      return 'warning' as const;
    case 'announcement':
      return 'premium' as const;
    case 'study-tip':
      return 'success' as const;
    default:
      return 'secondary' as const;
  }
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
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

function Avatar({
  name,
  avatar,
}: {
  name: string;
  avatar?: string;
}) {
  return (
    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      {avatar ? (
        <img src={avatar} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm font-bold text-cyan-100">
          {name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </span>
      )}
    </div>
  );
}

function CategoryBadge({
  category,
}: {
  category: PostCategory;
}) {
  return (
    <Badge variant={categoryVariant(category)}>
      {categoryLabel(category)}
    </Badge>
  );
}

function ReplyItem({ reply }: { reply: CommunityReply }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#08111F]/70 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <MessageCircle className="h-4 w-4 text-cyan-100" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{reply.author}</h4>
            {reply.role ? (
              <Badge variant={reply.role === 'AI' ? 'premium' : 'secondary'}>
                {reply.role}
              </Badge>
            ) : null}
            <span className="text-xs text-white/40">
              {formatRelativeTime(reply.createdAt)}
            </span>
          </div>

          <p className="mt-2 text-sm leading-7 text-white/65">{reply.content}</p>

          <div className="mt-3 flex items-center gap-3 text-xs text-white/45">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {reply.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({
  post,
  onLike,
  onBookmark,
  onReply,
}: {
  post: CommunityPost;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onReply: (id: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar name={post.author} avatar={post.avatar} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-xl font-bold text-white">
                  {post.author}
                </h3>

                {post.verified ? (
                  <Badge variant="success">
                    <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                    Verified
                  </Badge>
                ) : null}

                {post.role ? <Badge variant="secondary">{post.role}</Badge> : null}

                {post.premium ? (
                  <Badge variant="premium">
                    <Crown className="mr-1 h-3.5 w-3.5" />
                    Premium
                  </Badge>
                ) : null}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/45">
                <span>{formatRelativeTime(post.createdAt)}</span>
                <span>•</span>
                <span>{post.subject || 'Community'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-white/55 transition hover:bg-white/[0.08] hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <CategoryBadge category={post.category} />
          {post.pinned ? <Badge variant="premium">Pinned</Badge> : null}
          {post.bookmarked ? <Badge variant="success">Saved</Badge> : null}
        </div>

        <h4 className="mt-4 text-2xl font-bold tracking-tight text-white">
          {post.title}
        </h4>

        <p className="mt-3 text-sm leading-7 text-white/65">
          {post.content}
        </p>

        {post.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#08111F]/70 px-4 py-3">
          <div className="flex items-center gap-4 text-sm text-white/55">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likes}
            </span>

            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.replies.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onLike(post.id)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Like
            </button>

            <button
              type="button"
              onClick={() => onBookmark(post.id)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            >
              <Star className="h-3.5 w-3.5" />
              {post.bookmarked ? 'Saved' : 'Save'}
            </button>

            <button
              type="button"
              onClick={() => onReply(post.id)}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
            >
              <Send className="h-3.5 w-3.5" />
              Reply
            </button>
          </div>
        </div>
      </div>

      {post.replies.length > 0 ? (
        <div className="space-y-3 border-t border-white/10 bg-[#08111F]/50 p-5">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold text-white/75">
              Replies
            </h5>
            <Badge variant="secondary">{post.replies.length}</Badge>
          </div>

          {post.replies.slice(0, 3).map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </div>
      ) : null}
    </motion.article>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(seedPosts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | PostCategory>('all');
  const [showComposer, setShowComposer] = useState(false);
  const [composerTitle, setComposerTitle] = useState('');
  const [composerContent, setComposerContent] = useState('');
  const [composerSubject, setComposerSubject] = useState('General');
  const [composerCategory, setComposerCategory] = useState<PostCategory>('discussion');
  const [composerTags, setComposerTags] = useState('');
  const [selectedSort, setSelectedSort] = useState<'top' | 'recent'>('top');
  const [sending, setSending] = useState(false);

  const stats = useMemo(() => {
    const totalReplies = posts.reduce((sum, post) => sum + post.replies.length, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const premiumPosts = posts.filter((post) => post.premium).length;
    const pinnedPosts = posts.filter((post) => post.pinned).length;

    return {
      posts: posts.length,
      replies: totalReplies,
      likes: totalLikes,
      premiumPosts,
      pinnedPosts,
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = posts.filter((post) => {
      const matchesSearch =
        !query ||
        [
          post.author,
          post.role,
          post.subject,
          post.title,
          post.content,
          post.tags.join(' '),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesCategory = category === 'all' || post.category === category;

      return matchesSearch && matchesCategory;
    });

    return [...list].sort((a, b) => {
      if (selectedSort === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      const scoreA = a.likes + a.replies.length * 3 + (a.pinned ? 20 : 0) + (a.premium ? 10 : 0);
      const scoreB = b.likes + b.replies.length * 3 + (b.pinned ? 20 : 0) + (b.premium ? 10 : 0);
      return scoreB - scoreA;
    });
  }, [category, posts, search, selectedSort]);

  const handleLike = (id: string) => {
    setPosts((previous) =>
      previous.map((post) =>
        post.id === id
          ? { ...post, likes: post.likes + 1 }
          : post,
      ),
    );
  };

  const handleBookmark = (id: string) => {
    setPosts((previous) =>
      previous.map((post) =>
        post.id === id
          ? { ...post, bookmarked: !post.bookmarked }
          : post,
      ),
    );
  };

  const handleReply = (id: string) => {
    const text = window.prompt('Write your reply:');
    if (!text?.trim()) return;

    setPosts((previous) =>
      previous.map((post) =>
        post.id === id
          ? {
              ...post,
              replies: [
                {
                  id: `reply-${Date.now()}`,
                  author: 'You',
                  role: 'Student',
                  content: text.trim(),
                  createdAt: new Date().toISOString(),
                  likes: 0,
                },
                ...post.replies,
              ],
            }
          : post,
      ),
    );
  };

  const createPost = async () => {
    if (!composerTitle.trim() || !composerContent.trim()) return;

    try {
      setSending(true);

      const nextPost: CommunityPost = {
        id: `post-${Date.now()}`,
        author: 'You',
        role: 'Student',
        avatar: 'https://i.pravatar.cc/200?img=8',
        category: composerCategory,
        title: composerTitle.trim(),
        content: composerContent.trim(),
        subject: composerSubject.trim() || 'General',
        tags: composerTags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
        premium: false,
        pinned: false,
        verified: false,
        bookmarked: false,
      };

      setPosts((previous) => [nextPost, ...previous]);
      setComposerTitle('');
      setComposerContent('');
      setComposerSubject('General');
      setComposerCategory('discussion');
      setComposerTags('');
      setShowComposer(false);
    } finally {
      setSending(false);
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
                  BEP Community
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Community
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  প্রশ্ন, study tips, announcements, and peer-to-peer discussion এক জায়গায়।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Moderated
                </Badge>
                <Badge variant="premium">
                  <Star className="mr-1 h-3.5 w-3.5" />
                  Active Feed
                </Badge>
                <Button onClick={() => setShowComposer(true)} leftIcon={<Plus className="h-4 w-4" />}>
                  New Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Posts"
            value={stats.posts}
            icon={<MessageCircle className="h-5 w-5" />}
            accent="cyan"
            note="Community discussions"
          />
          <StatCard
            title="Replies"
            value={stats.replies}
            icon={<Send className="h-5 w-5" />}
            accent="emerald"
            note="Conversation activity"
          />
          <StatCard
            title="Likes"
            value={stats.likes}
            icon={<Heart className="h-5 w-5" />}
            accent="fuchsia"
            note="Appreciation across posts"
          />
          <StatCard
            title="Pinned"
            value={stats.pinnedPosts}
            icon={<Star className="h-5 w-5" />}
            accent="amber"
            note="Official highlighted posts"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Search className="h-4 w-4" />
                <span className="text-sm font-semibold">Search & filters</span>
              </div>

              <div className="space-y-4">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts, users, subjects..."
                  leftIcon={<Search className="h-4 w-4" />}
                />

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                    Category
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id)}
                        className={[
                          'rounded-full border px-4 py-2 text-sm font-semibold transition',
                          category === item.id
                            ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                            : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                        ].join(' ')}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSort('top')}
                    className={[
                      'rounded-full border px-4 py-2 text-sm font-semibold transition',
                      selectedSort === 'top'
                        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                        : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                    ].join(' ')}
                  >
                    Top
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSort('recent')}
                    className={[
                      'rounded-full border px-4 py-2 text-sm font-semibold transition',
                      selectedSort === 'recent'
                        ? 'border-amber-400/20 bg-amber-400/10 text-amber-100'
                        : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                    ].join(' ')}
                  >
                    Recent
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  Community is designed for student collaboration, quick doubts, and study motivation.
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">Trending topics</span>
              </div>

              <div className="space-y-3">
                {[
                  'HSC exam strategy',
                  'Physics motion formulas',
                  'Math problem solving',
                  'Bangla writing tips',
                  'AI study assistant prompts',
                ].map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between rounded-[22px] border border-white/10 bg-[#08111F]/70 px-4 py-3"
                  >
                    <span className="text-sm text-white/65">{topic}</span>
                    <ChevronRight className="h-4 w-4 text-white/30" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-emerald-100">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-semibold">Community rules</span>
              </div>

              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>Respectful language ব্যবহার করুন।</p>
                <p>Academic help share করুন, spam বা duplicate post avoid করুন।</p>
                <p>Official announcements and pinned posts follow করুন।</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onReply={handleReply}
                />
              ))
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[30px] border border-dashed border-white/10 bg-white/[0.04] p-6 text-center">
                <X className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-2xl font-bold text-white">
                  No posts found
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-white/55">
                  Search বা category filter পরিবর্তন করুন, অথবা নতুন discussion শুরু করুন।
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Premium Posts"
            value={stats.premiumPosts}
            icon={<Crown className="h-5 w-5" />}
            accent="fuchsia"
            note="Premium announcements and tips"
          />
          <StatCard
            title="Community Health"
            value="98%"
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="emerald"
            note="Healthy moderation signal"
          />
          <StatCard
            title="Active Members"
            value="8.4K"
            icon={<Users className="h-5 w-5" />}
            accent="cyan"
            note="Monthly active contributors"
          />
          <StatCard
            title="Engagement"
            value="73%"
            icon={<ThumbsUp className="h-5 w-5" />}
            accent="amber"
            note="Likes + replies ratio"
          />
        </div>

        {showComposer ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black">Create Post</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Share a question, announcement, or study tip with the community.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={composerTitle}
                    onChange={(e) => setComposerTitle(e.target.value)}
                    placeholder="Post title"
                  />

                  <Input
                    value={composerSubject}
                    onChange={(e) => setComposerSubject(e.target.value)}
                    placeholder="Subject / topic"
                  />
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                    Category
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(['discussion', 'question', 'announcement', 'study-tip'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setComposerCategory(item)}
                        className={[
                          'rounded-full border px-4 py-2 text-sm font-semibold transition',
                          composerCategory === item
                            ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                            : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                        ].join(' ')}
                      >
                        {categoryLabel(item)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    value={composerContent}
                    onChange={(e) => setComposerContent(e.target.value)}
                    rows={6}
                    placeholder="Write your post..."
                    className="w-full rounded-[26px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <Input
                  value={composerTags}
                  onChange={(e) => setComposerTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                  leftIcon={<Wand2 className="h-4 w-4" />}
                />

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={createPost}
                    disabled={sending}
                    leftIcon={sending ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
                  >
                    {sending ? 'Posting...' : 'Publish Post'}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => setShowComposer(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
