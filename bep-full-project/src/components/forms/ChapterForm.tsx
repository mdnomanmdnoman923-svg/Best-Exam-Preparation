// src/components/forms/ChapterForm.tsx

import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Layers3,
} from 'lucide-react';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface ChapterFormValues {
  title: string;
  slug: string;
  description: string;
  order: number;
}

interface ChapterFormProps {
  loading?: boolean;
  defaultValues?: Partial<ChapterFormValues>;
  onSubmit: (
    values: ChapterFormValues,
  ) => Promise<void> | void;
}

export default function ChapterForm({
  loading = false,
  defaultValues,
  onSubmit,
}: ChapterFormProps) {
  const [values, setValues] = useState<ChapterFormValues>({
    title: defaultValues?.title || '',
    slug: defaultValues?.slug || '',
    description: defaultValues?.description || '',
    order: defaultValues?.order || 1,
  });

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          অধ্যায় তৈরি করুন
        </h2>

        <p className="mt-2 text-sm text-white/60">
          Subject এর জন্য নতুন chapter যোগ করুন
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="অধ্যায়ের নাম"
          placeholder="যেমন: ভৌত রাশি"
          value={values.title}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          leftIcon={<BookOpen className="h-4 w-4" />}
        />

        <Input
          label="Slug"
          placeholder="physical-quantities"
          value={values.slug}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              slug: e.target.value,
            }))
          }
          leftIcon={<Layers3 className="h-4 w-4" />}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-white/85">
            বর্ণনা
          </label>

          <div className="relative">
            <FileText className="absolute left-4 top-4 h-4 w-4 text-white/40" />

            <textarea
              rows={5}
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="অধ্যায়ের বিস্তারিত লিখুন..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-3 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
            />
          </div>
        </div>

        <Input
          type="number"
          label="সিরিয়াল"
          value={values.order}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              order: Number(e.target.value),
            }))
          }
        />

        <Button
          type="submit"
          loading={loading}
          fullWidth
        >
          অধ্যায় সংরক্ষণ করুন
        </Button>
      </div>
    </form>
  );
}
