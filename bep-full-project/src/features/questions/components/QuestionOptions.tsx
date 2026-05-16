// bep-full-project/src/features/questions/components/QuestionOptions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  GripVertical,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  isCorrect?: boolean;
}

export interface QuestionOptionsProps {
  options: QuestionOption[];
  type?: 'mcq' | 'sq' | 'cq';
  loading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  showCorrectToggle?: boolean;
  allowReorder?: boolean;
  allowAdd?: boolean;
  allowRemove?: boolean;
  onChange: (options: QuestionOption[]) => void;
  onAdd?: () => void;
  onRemove?: (optionId: string) => void;
  onSetCorrect?: (optionId: string, isCorrect: boolean) => void;
  className?: string;
}

function createOption(
  index: number,
): QuestionOption {
  return {
    id: `${Date.now()}-${index + 1}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    label: String.fromCharCode(65 + index),
    value: '',
    isCorrect: false,
  };
}

function normalizeLabels(
  options: QuestionOption[],
): QuestionOption[] {
  return options.map((option, index) => ({
    ...option,
    label: String.fromCharCode(65 + index),
  }));
}

export default function QuestionOptions({
  options,
  type = 'mcq',
  loading = false,
  disabled = false,
  readOnly = false,
  showCorrectToggle = true,
  allowReorder = false,
  allowAdd = true,
  allowRemove = true,
  onChange,
  onAdd,
  onRemove,
  onSetCorrect,
  className = '',
}: QuestionOptionsProps) {
  const editable = !loading && !disabled && !readOnly;
  const isMcq = type === 'mcq';

  const updateOption = (
    optionId: string,
    patch: Partial<QuestionOption>,
  ) => {
    if (!editable) return;

    onChange(
      options.map((option) =>
        option.id === optionId
          ? { ...option, ...patch }
          : option,
      ),
    );
  };

  const handleAdd = () => {
    if (!editable) return;

    const next = normalizeLabels([
      ...options,
      createOption(options.length),
    ]);

    onChange(next);
    onAdd?.();
  };

  const handleRemove = (
    optionId: string,
  ) => {
    if (!editable) return;

    const next = normalizeLabels(
      options.filter((option) => option.id !== optionId),
    );

    onChange(next);
    onRemove?.(optionId);
  };

  const handleMove = (
    fromIndex: number,
    toIndex: number,
  ) => {
    if (!editable) return;
    if (toIndex < 0 || toIndex >= options.length) return;
    if (fromIndex === toIndex) return;

    const next = [...options];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    onChange(normalizeLabels(next));
  };

  const handleSetCorrect = (
    optionId: string,
    isCorrect: boolean,
  ) => {
    if (!editable) return;

    const next = options.map((option) => ({
      ...option,
      isCorrect: option.id === optionId ? isCorrect : isMcq ? false : option.isCorrect,
    }));

    onChange(next);
    onSetCorrect?.(optionId, isCorrect);
  };

  const correctCount = options.filter(
    (option) => option.isCorrect,
  ).length;

  return (
    <div
      className={[
        'overflow-hidden rounded-[30px] border border-white/10',
        'bg-white/[0.04] shadow-[0_16px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="border-b border-white/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              <Copy className="h-3.5 w-3.5" />
              Question Options
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-white">
              {isMcq ? 'Multiple choice options' : 'Question options'}
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              {isMcq
                ? 'প্রতিটি option edit করুন, correct answer select করুন, এবং প্রয়োজন হলে option add বা remove করুন।'
                : 'এই প্রশ্নের জন্য structured options set করুন।'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="premium">
              {options.length} Options
            </Badge>

            {isMcq ? (
              <Badge variant={correctCount > 0 ? 'success' : 'warning'}>
                {correctCount} Correct
              </Badge>
            ) : null}

            {allowAdd && editable ? (
              <Button
                onClick={handleAdd}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Option
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-[24px] border border-white/10 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : options.length > 0 ? (
          <div className="space-y-4">
            {options.map((option, index) => {
              const isCorrect = Boolean(option.isCorrect);

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.03 }}
                  className={[
                    'group rounded-[26px] border p-4 backdrop-blur-xl transition-all duration-300',
                    isCorrect
                      ? 'border-emerald-400/15 bg-emerald-400/10'
                      : 'border-white/10 bg-[#08111F]/70',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2 pt-1">
                      {allowReorder && editable ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/45">
                          <GripVertical className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
                          {option.label}
                        </div>
                      )}

                      {allowReorder && editable ? (
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleMove(index, index - 1)
                            }
                            disabled={index === 0}
                            className="h-8 w-8 rounded-xl border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Move option up"
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleMove(index, index + 1)
                            }
                            disabled={
                              index ===
                              options.length - 1
                            }
                            className="h-8 w-8 rounded-xl border border-white/10 bg-white/[0.04] text-white/45 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Move option down"
                          >
                            ↓
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="grid gap-3 md:grid-cols-[120px_1fr]">
                        <Input
                          value={option.label}
                          onChange={(e) =>
                            updateOption(option.id, {
                              label: e.target.value,
                            })
                          }
                          placeholder="Label"
                          disabled={!editable}
                          className="rounded-2xl"
                        />

                        <Input
                          value={option.value}
                          onChange={(e) =>
                            updateOption(option.id, {
                              value: e.target.value,
                            })
                          }
                          placeholder="Option value"
                          disabled={!editable}
                          className="rounded-2xl"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {showCorrectToggle &&
                        isMcq ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleSetCorrect(
                                option.id,
                                !isCorrect,
                              )
                            }
                            disabled={!editable}
                            className={[
                              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                              isCorrect
                                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                                : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                              !editable
                                ? 'cursor-not-allowed opacity-50'
                                : '',
                            ].join(' ')}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {isCorrect ? 'Correct answer' : 'Mark correct'}
                          </button>
                        ) : null}

                        {isCorrect ? (
                          <Badge variant="success">
                            Correct
                          </Badge>
                        ) : null}

                        {option.value ? (
                          <Badge variant="secondary">
                            Filled
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            Empty
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {allowRemove && editable ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(option.id)
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-100"
                          aria-label="Remove option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}

                      {isMcq && isCorrect ? (
                        <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Selected
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.04] px-6 py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.05] text-cyan-100">
              <Copy className="h-9 w-9" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              No options added yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-7 text-white/55">
              প্রশ্নের জন্য options add করুন। MCQ হলে correct answer অবশ্যই mark করুন।
            </p>

            {allowAdd && editable ? (
              <div className="mt-5">
                <Button
                  onClick={handleAdd}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add first option
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {isMcq && options.length > 0 ? (
          <div className="mt-5 rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-100" />
              <p className="text-sm leading-7 text-white/75">
                MCQ mode এ একটিই correct option রাখুন। সব option final করার পর question save করুন।
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {readOnly ? (
        <div className="border-t border-white/10 px-5 py-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/55">
            <XCircle className="h-3.5 w-3.5" />
            Read-only mode
          </div>
        </div>
      ) : null}
    </div>
  );
}
