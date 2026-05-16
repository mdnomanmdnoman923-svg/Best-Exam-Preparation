// src/components/forms/SubjectForm.tsx

import React, { useState } from 'react';
import {
  BookMarked,
  Layers3,
  Palette,
} from 'lucide-react';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface SubjectFormValues {
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

interface SubjectFormProps {
  loading?: boolean;
  defaultValues?: Partial<SubjectFormValues>;
  onSubmit: (
    values: SubjectFormValues,
  ) => Promise<void> | void;
}

export default function SubjectForm({
  loading = false,
  defaultValues,
  onSubmit,
}: SubjectFormProps) {
  const [values, setValues] =
    useState<SubjectFormValues>({
      name: defaultValues?.name || '',
      slug: defaultValues?.slug || '',
      icon: defaultValues?.icon || '',
      color:
        defaultValues?.color || '#06B6D4',
      description:
        defaultValues?.description || '',
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
        <h2 className="text-2xl font-bold text-white">
          Subject তৈরি করুন
        </h2>

        <p className="mt-2 text-sm text-white/60">
          নতুন subject এবং learning category যোগ করুন
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Subject Name"
          placeholder="Physics"
          value={values.name}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          leftIcon={<BookMarked className="h-4 w-4" />}
        />

        <Input
          label="Slug"
          placeholder="physics"
          value={values.slug}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              slug: e.target.value,
            }))
          }
          leftIcon={<Layers3 className="h-4 w-4" />}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Icon"
            placeholder="BookOpen"
            value={values.icon}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                icon: e.target.value,
              }))
            }
          />

          <Input
            type="color"
            label="Theme Color"
            value={values.color}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                color: e.target.value,
              }))
            }
            leftIcon={<Palette className="h-4 w-4" />}
            className="h-12 cursor-pointer"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/85">
            Description
          </label>

          <textarea
            rows={5}
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Subject সম্পর্কে বিস্তারিত লিখুন..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
        >
          Subject সংরক্ষণ করুন
        </Button>
      </div>
    </form>
  );
}
