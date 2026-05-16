// src/components/forms/QuestionForm.tsx

import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  FileQuestion,
} from 'lucide-react';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface QuestionFormValues {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}

interface QuestionFormProps {
  loading?: boolean;
  defaultValues?: Partial<QuestionFormValues>;
  onSubmit: (
    values: QuestionFormValues,
  ) => Promise<void> | void;
}

export default function QuestionForm({
  loading = false,
  defaultValues,
  onSubmit,
}: QuestionFormProps) {
  const [values, setValues] =
    useState<QuestionFormValues>({
      question:
        defaultValues?.question || '',
      optionA:
        defaultValues?.optionA || '',
      optionB:
        defaultValues?.optionB || '',
      optionC:
        defaultValues?.optionC || '',
      optionD:
        defaultValues?.optionD || '',
      correctAnswer:
        defaultValues?.correctAnswer || 'A',
      explanation:
        defaultValues?.explanation || '',
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
          প্রশ্ন তৈরি করুন
        </h2>

        <p className="mt-2 text-sm text-white/60">
          MCQ question bank এ নতুন প্রশ্ন যোগ করুন
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-white/85">
            প্রশ্ন
          </label>

          <div className="relative">
            <FileQuestion className="absolute left-4 top-4 h-4 w-4 text-white/40" />

            <textarea
              rows={4}
              value={values.question}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
              placeholder="প্রশ্ন লিখুন..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-3 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Option A"
            value={values.optionA}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                optionA: e.target.value,
              }))
            }
          />

          <Input
            label="Option B"
            value={values.optionB}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                optionB: e.target.value,
              }))
            }
          />

          <Input
            label="Option C"
            value={values.optionC}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                optionC: e.target.value,
              }))
            }
          />

          <Input
            label="Option D"
            value={values.optionD}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                optionD: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/85">
            সঠিক উত্তর
          </label>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {['A', 'B', 'C', 'D'].map((option) => {
              const active =
                values.correctAnswer === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setValues((prev) => ({
                      ...prev,
                      correctAnswer: option,
                    }))
                  }
                  className={[
                    'flex h-12 items-center justify-center rounded-2xl border text-sm font-semibold transition',
                    active
                      ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100'
                      : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.06]',
                  ].join(' ')}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/85">
            ব্যাখ্যা
          </label>

          <div className="relative">
            <Brain className="absolute left-4 top-4 h-4 w-4 text-white/40" />

            <textarea
              rows={5}
              value={values.explanation}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  explanation: e.target.value,
                }))
              }
              placeholder="AI explanation বা solution লিখুন..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-3 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
            />
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
        >
          প্রশ্ন সংরক্ষণ করুন
        </Button>
      </div>
    </form>
  );
}
