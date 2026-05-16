// bep-full-project/src/features/community/components/PostCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Sparkles,
  Tag,
  UserMinus,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export type CommunityPostCategory =
  | 'general'
  | 'question'
  | 'discussion'
  | 'study-tip'
  | 'announcement';

export interface PostAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  premium?: boolean;
}

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  category: CommunityPostCategory;
  author: PostAuthor;
  createdAt: string | Date;
  likes?: number;
  comments?: number;
  shares?: number;
  bookmarks?: number;
  tags?: string[];
  imageUrl?: string;
  linkUrl?: string;
  anonymous?: boolean;
  liked?: boolean;
  bookmarked?: boolean;
  trending?: boolean;
  featured?: boolean;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onOpen?: (id: string) => void;
  onAuthorClick?: (authorId: string) => void;
  className?: string;
}

const categoryStyles: Record<
  CommunityPostCategory,
  { label: string; className: string }
> = {
  general: {
    label: 'General',
    className: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
  },
  question: {
    label: 'Question',
    className: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
  },
  discussion: {
    label: 'Discussion',
    className: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  },
  'study-tip': {
    label: 'Study Tip',
    className: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
  },
  announcement: {
    label: 'Announcement',
    className: 'border-violet-400/15 bg-violet-400/10 text-violet-100',
  },
};

function formatTime(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PostCard({
  id,
  title,
  content,
  category,
  author,
  createdAt,
  likes = 0,
  comments = 0,
  shares = 0,
  bookmarks = 0,
  tags = [],
  imageUrl,
  linkUrl,
  anonymous = false,
  liked = false,
  bookmarked = false,
  trending = false,
  featured = false,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onOpen,
  onAuthorClick,
  className = '',
}: PostCardProps) {
  const categoryMeta = categoryStyles[category];

  const handleOpen = () => onOpen?.(id);
  const handleAuthorClick = () => onAuthorClick?.(author.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={[
        'group relative overflow-hidden rounded-[30px] border border-white/10',
        'bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl',
        'transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)] opacity-80" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={handleAuthorClick}
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:scale-[1.02]"
              aria-label={`${anonymous ? 'Anonymous' : author.name}`}
            >
              {anonymous ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 text-cyan-100">
                  <UserMinus className="h-5 w-5" />
                </div>
              ) : author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 text-cyan-100">
                  {author.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              )}
            </button>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAuthorClick}
                  className="text-left text-sm font-semibold text-white transition hover:text-cyan-100"
                >
                  {anonymous ? 'Anonymous' : author.name}
                </button>

                {author.premium ? (
                  <Badge variant="premium">Premium</Badge>
                ) : null}

                {trending ? (
                  <div className="inline-flex items-center gap-1 rounded-full border border-amber-400/15 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold text-amber-100">
                    <Sparkles className="h-3 w-3" />
                    Trending
                  </div>
                ) : null}

                {featured ? (
                  <div className="inline-flex items-center gap-1 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-2.5 py-1 text-[10px] font-semibold text-fuchsia-100">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </div>
                ) : null}
              </div>

              <p className="mt-1 text-xs text-white/45">
                {anonymous ? 'Posted anonymously' : author.role || 'Member'} • {formatTime(createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" dot className={categoryMeta.className}>
              {categoryMeta.label}
            </Badge>

            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/65"
              >
                <Tag className="h-3.5 w-3.5" />
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpen}
            className="block w-full text-left"
          >
            <h3 className="line-clamp-2 text-2xl font-bold tracking-tight text-white transition group-hover:text-cyan-100">
              {title}
            </h3>

            <p className="mt-3 line-clamp-4 text-sm leading-7 text-white/65">
              {content}
            </p>
          </button>

          {imageUrl ? (
            <button
              type="button"
              onClick={handleOpen}
              className="mt-5 block w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20"
            >
              <img
                src={imageUrl}
                alt={title}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </button>
          ) : null}

          {linkUrl ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
            >
              Open related link
            </a>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {tags.length > 4 ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/55">
                +{tags.length - 4} more
              </span>
            ) : null}
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onLike?.(id)}
                className={[
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                  liked
                    ? 'border-pink-400/20 bg-pink-400/10 text-pink-100'
                    : 'border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white',
                ].join(' ')}
              >
                <Heart className={['h-4 w-4', liked ? 'fill-current' : ''].join(' ')} />
                {likes}
              </button>

              <button
                type="button"
                onClick={() => onComment?.(id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                {comments}
              </button>

              <button
                type="button"
                onClick={() => onShare?.(id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Share2 className="h-4 w-4" />
                {shares}
              </button>

              <button
                type="button"
                onClick={() => onBookmark?.(id)}
                className={[
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                  bookmarked
                    ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                    : 'border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white',
                ].join(' ')}
              >
                <Bookmark className={['h-4 w-4', bookmarked ? 'fill-current' : ''].join(' ')} />
                {bookmarks}
              </button>
            </div>

            <Button
              variant="secondary"
              onClick={handleOpen}
              rightIcon={<MessageCircle className="h-4 w-4" />}
            >
              View post
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
