// bep-full-project/src/features/community/components/CreatePostForm.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Link2,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  Tag,
  UserMinus,
  X,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

export type CommunityPostCategory =
  | 'general'
  | 'question'
  | 'discussion'
  | 'study-tip'
  | 'announcement';

export interface CreatePostFormValues {
  title: string;
  content: string;
  category: CommunityPostCategory;
  tags: string[];
  anonymous: boolean;
  imageUrl?: string;
  linkUrl?: string;
}

export interface CreatePostFormProps {
  loading?: boolean;
  disabled?: boolean;
  defaultValues?: Partial<CreatePostFormValues>;
  categories?: Array<{
    value: CommunityPostCategory;
    label: string;
  }>;
  onSubmit: (values: CreatePostFormValues) => Promise<void> | void;
  onCancel?: () => void;
  className?: string;
}

const defaultCategories: Array<{
  value: CommunityPostCategory;
  label: string;
}> = [
  { value: 'general', label: 'General' },
  { value: 'question', label: 'Question' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'study-tip', label: 'Study Tip' },
  { value: 'announcement', label: 'Announcement' },
];

function normalizeTag(value: string) {
  return value
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export default function CreatePostForm({
  loading = false,
  disabled = false,
  defaultValues,
  categories = defaultCategories,
  onSubmit,
  onCancel,
  className = '',
}: CreatePostFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '');
  const [content, setContent] = useState(defaultValues?.content ?? '');
  const [category, setCategory] = useState<CommunityPostCategory>(
    defaultValues?.category ?? 'general',
  );
  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
  const [anonymous, setAnonymous] = useState(defaultValues?.anonymous ?? false);
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl ?? '');
  const [linkUrl, setLinkUrl] = useState(defaultValues?.linkUrl ?? '');
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      !disabled &&
      !loading &&
      title.trim().length > 0 &&
      content.trim().length > 0
    );
  }, [disabled, loading, title, content]);

  const addTag = () => {
    const normalized = normalizeTag(tagInput);
    if (!normalized) return;

    setTags((prev) =>
      prev.includes(normalized) ? prev : [...prev, normalized],
    );
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }

    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError('Please add a post title.');
      return;
    }

    if (!trimmedContent) {
      setError('Please add some content.');
      return;
    }

    setError(null);

    await onSubmit({
      title: trimmedTitle,
      content: trimmedContent,
      category,
      tags,
      anonymous,
      imageUrl: imageUrl.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={[
        'relative overflow-hidden rounded-3xl border border-white/10',
        'bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              Community Post
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              Create a new post
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/60">
              Ask questions, share study tips, or start a discussion with the BEP community.
            </p>
          </div>

          <Badge variant="premium">BEP</Badge>
        </div>

        <div className="space-y-5">
          <Input
            label="Post title"
            placeholder="Type a clear and catchy title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled || loading}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Content
            </label>
            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..."
              disabled={disabled || loading}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Category
            </label>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = category === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCategory(item.value)}
                    disabled={disabled || loading}
                    className={[
                      'rounded-full border px-4 py-2 text-sm font-medium transition',
                      active
                        ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                        : 'border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.07] hover:text-white',
                      'disabled:cursor-not-allowed disabled:opacity-60',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Image URL"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              leftIcon={<ImageIcon className="h-4 w-4" />}
              disabled={disabled || loading}
            />

            <Input
              label="Link URL"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              leftIcon={<Link2 className="h-4 w-4" />}
              disabled={disabled || loading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Tags
            </label>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-cyan-100/80 transition hover:bg-white/10 hover:text-white"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <div className="flex flex-1 items-center gap-2 min-w-[220px]">
                  <Tag className="h-4 w-4 text-white/35" />
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={addTag}
                    placeholder="Type tag and press Enter"
                    disabled={disabled || loading}
                    className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <p className="mt-2 text-xs text-white/45">
              Use tags like <span className="font-semibold text-white/60">ssc</span>,{' '}
              <span className="font-semibold text-white/60">physics</span>,{' '}
              <span className="font-semibold text-white/60">admission</span>.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              disabled={disabled || loading}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/30"
            />
            <span className="flex items-center gap-2 text-sm text-white/75">
              <UserMinus className="h-4 w-4" />
              Post anonymously
            </span>
          </label>

          {error ? (
            <div className="rounded-2xl border border-red-400/15 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {onCancel ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={disabled || loading}
                >
                  Cancel
                </Button>
              ) : null}

              <Button
                type="button"
                variant="ghost"
                leftIcon={<Paperclip className="h-4 w-4" />}
                disabled={disabled || loading}
              >
                Attach
              </Button>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!canSubmit}
              rightIcon={<Send className="h-4 w-4" />}
            >
              Publish post
            </Button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
