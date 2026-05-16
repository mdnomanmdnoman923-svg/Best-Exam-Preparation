// bep-full-project/src/features/community/components/ReplyList.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Reply,
  Sparkles,
  UserMinus,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export type ReplyAuthor = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  premium?: boolean;
};

export interface ReplyItem {
  id: string;
  author: ReplyAuthor;
  content: string;
  createdAt: string | Date;
  likes?: number;
  liked?: boolean;
  anonymous?: boolean;
  depth?: number;
  highlighted?: boolean;
  children?: ReplyItem[];
}

export interface ReplyListProps {
  replies: ReplyItem[];
  loading?: boolean;
  collapsedByDefault?: boolean;
  maxVisible?: number;
  onLike?: (replyId: string) => void;
  onReply?: (replyId: string) => void;
  onAuthorClick?: (authorId: string) => void;
  onLoadMore?: () => void;
  className?: string;
}

function formatTime(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function flattenReplies(replies: ReplyItem[], depth = 0): ReplyItem[] {
  return replies.flatMap((reply) => [
    { ...reply, depth },
    ...(reply.children?.length ? flattenReplies(reply.children, depth + 1) : []),
  ]);
}

function ReplyRow({
  reply,
  onLike,
  onReply,
  onAuthorClick,
}: {
  reply: ReplyItem;
  onLike?: (replyId: string) => void;
  onReply?: (replyId: string) => void;
  onAuthorClick?: (authorId: string) => void;
}) {
  const marginLeft = useMemo(() => {
    const depth = Math.max(0, reply.depth || 0);
    return `ml-${Math.min(depth * 6, 18)}`;
  }, [reply.depth]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={[
        'group relative rounded-3xl border border-white/10 bg-white/[0.04] p-5',
        'shadow-[0_12px_45px_rgba(0,0,0,0.22)] backdrop-blur-2xl',
        reply.highlighted ? 'border-cyan-400/20 bg-cyan-400/10' : '',
        marginLeft,
      ].join(' ')}
      style={{
        marginLeft: reply.depth ? Math.min(reply.depth * 24, 72) : 0,
      }}
    >
      <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onAuthorClick?.(reply.author.id)}
              className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] transition hover:scale-[1.02]"
              aria-label={reply.anonymous ? 'Anonymous' : reply.author.name}
            >
              {reply.anonymous ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 text-cyan-100">
                  <UserMinus className="h-5 w-5" />
                </div>
              ) : reply.author.avatar ? (
                <img
                  src={reply.author.avatar}
                  alt={reply.author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 text-cyan-100 text-xs font-bold">
                  {reply.author.name
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
                  onClick={() => onAuthorClick?.(reply.author.id)}
                  className="text-left text-sm font-semibold text-white transition hover:text-cyan-100"
                >
                  {reply.anonymous ? 'Anonymous' : reply.author.name}
                </button>

                {reply.author.premium ? (
                  <Badge variant="premium">Premium</Badge>
                ) : null}

                {reply.highlighted ? (
                  <div className="inline-flex items-center gap-1 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-2.5 py-1 text-[10px] font-semibold text-fuchsia-100">
                    <Sparkles className="h-3 w-3" />
                    Highlighted
                  </div>
                ) : null}
              </div>

              <p className="mt-1 text-xs text-white/45">
                {reply.anonymous ? 'Posted anonymously' : reply.author.role || 'Member'} •{' '}
                {formatTime(reply.createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 pl-14">
          <p className="text-sm leading-7 text-white/70">
            {reply.content}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onLike?.(reply.id)}
              className={[
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                reply.liked
                  ? 'border-pink-400/20 bg-pink-400/10 text-pink-100'
                  : 'border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white',
              ].join(' ')}
            >
              <Heart className={['h-4 w-4', reply.liked ? 'fill-current' : ''].join(' ')} />
              {reply.likes || 0}
            </button>

            <button
              type="button"
              onClick={() => onReply?.(reply.id)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
            >
              <Reply className="h-4 w-4" />
              Reply
            </button>

            {reply.children?.length ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100">
                <MessageCircle className="h-4 w-4" />
                {reply.children.length} nested reply{reply.children.length > 1 ? 'ies' : ''}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReplyList({
  replies,
  loading = false,
  collapsedByDefault = false,
  maxVisible = 5,
  onLike,
  onReply,
  onAuthorClick,
  onLoadMore,
  className = '',
}: ReplyListProps) {
  const [collapsed, setCollapsed] = useState(collapsedByDefault);

  const flattened = useMemo(() => flattenReplies(replies), [replies]);
  const visibleReplies = collapsed ? flattened.slice(0, maxVisible) : flattened;

  return (
    <div className={['space-y-4', className].join(' ')}>
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
          <MessageCircle className="h-3.5 w-3.5" />
          Replies
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
          disabled={loading || flattened.length <= maxVisible}
        >
          {collapsed ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Show more
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Show less
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
            />
          ))}
        </div>
      ) : visibleReplies.length > 0 ? (
        <div className="space-y-4">
          {visibleReplies.map((reply) => (
            <ReplyRow
              key={reply.id}
              reply={reply}
              onLike={onLike}
              onReply={onReply}
              onAuthorClick={onAuthorClick}
            />
          ))}

          {collapsed && flattened.length > maxVisible ? (
            <div className="flex justify-center pt-2">
              <Button
                variant="secondary"
                onClick={() => setCollapsed(false)}
                rightIcon={<ChevronDown className="h-4 w-4" />}
              >
                আরো reply দেখুন
              </Button>
            </div>
          ) : null}

          {onLoadMore ? (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                onClick={onLoadMore}
              >
                Load more replies
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-10 text-center backdrop-blur-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-cyan-100">
            <MessageCircle className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
            No replies yet
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Be the first one to jump in and help the community.
          </p>
        </div>
      )}
    </div>
  );
}
