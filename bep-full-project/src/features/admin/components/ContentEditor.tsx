// bep-full-project/src/features/admin/components/ContentEditor.tsx

import React, { useState } from 'react';
import {
  Eye,
  Image as ImageIcon,
  Save,
  Sparkles,
  Type,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ContentEditorProps {
  title?: string;
  initialTitle?: string;
  initialContent?: string;
  initialThumbnail?: string;
  onSave?: (data: {
    title: string;
    content: string;
    thumbnail: string;
  }) => Promise<void> | void;
}

export default function ContentEditor({
  title = 'Content Editor',
  initialTitle = '',
  initialContent = '',
  initialThumbnail = '',
  onSave,
}: ContentEditorProps) {
  const [pageTitle, setPageTitle] =
    useState(initialTitle);

  const [content, setContent] =
    useState(initialContent);

  const [thumbnail, setThumbnail] =
    useState(initialThumbnail);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      await onSave?.({
        title: pageTitle,
        content,
        thumbnail,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
      <div className="border-b border-white/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              AI Ready CMS
            </div>

            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Smart content editing এবং Bengali-first publishing workflow
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              leftIcon={<Eye className="h-4 w-4" />}
            >
              Preview
            </Button>

            <Button
              loading={saving}
              onClick={handleSave}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Content
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Input
            label="Content Title"
            placeholder="Enter page title..."
            value={pageTitle}
            onChange={(e) =>
              setPageTitle(e.target.value)
            }
            leftIcon={<Type className="h-4 w-4" />}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Main Content
            </label>

            <textarea
              rows={18}
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write premium Bengali educational content..."
              className="w-full rounded-3xl border border-white/10 bg-[#08111F]/70 px-5 py-4 text-sm leading-7 text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-[#08111F]/60 p-5">
            <h3 className="text-lg font-semibold text-white">
              Thumbnail
            </h3>

            <p className="mt-2 text-sm text-white/55">
              Cover image অথবা banner URL দিন
            </p>

            <div className="mt-5">
              <Input
                placeholder="https://example.com/image.png"
                value={thumbnail}
                onChange={(e) =>
                  setThumbnail(e.target.value)
                }
                leftIcon={<ImageIcon className="h-4 w-4" />}
              />
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Thumbnail preview"
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 flex-col items-center justify-center gap-3 text-white/35">
                  <ImageIcon className="h-10 w-10" />

                  <p className="text-sm">
                    Thumbnail Preview
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-5">
            <h3 className="text-lg font-semibold text-cyan-100">
              Publishing Tips
            </h3>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-cyan-50/80">
              <li>
                • বাংলা এবং English mixed premium tone ব্যবহার করুন
              </li>

              <li>
                • Structured heading এবং bullet points যোগ করুন
              </li>

              <li>
                • SEO-friendly title ব্যবহার করুন
              </li>

              <li>
                • AI-generated explanation section যোগ করতে পারেন
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
