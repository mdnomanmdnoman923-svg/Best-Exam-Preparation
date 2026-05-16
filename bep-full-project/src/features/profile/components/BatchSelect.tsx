// bep-full-project/src/features/profile/components/BatchSelect.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export interface BatchOption {
  id: string;
  label: string;
  year?: string;
  institution?: string;
  description?: string;
  totalStudents?: number;
  premium?: boolean;
  featured?: boolean;
  icon?: React.ReactNode;
}

export interface BatchSelectProps {
  batches: BatchOption[];
  value?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  searchable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  showStats?: boolean;
  onChange: (batchId: string) => void;
  onClear?: () => void;
  className?: string;
}

export default function BatchSelect({
  batches,
  value,
  title = 'Batch Select',
  subtitle = 'আপনার class, year, বা study group select করুন',
  placeholder = 'Batch search করুন...',
  searchable = true,
  loading = false,
  disabled = false,
  allowClear = true,
  showStats = true,
  onChange,
  onClear,
  className = '',
}: BatchSelectProps) {
  const [search, setSearch] = useState('');

  const selectedBatch = useMemo(
    () => batches.find((batch) => batch.id === value) || null,
    [batches, value],
  );

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return batches;

    return batches.filter((batch) =>
      [
        batch.label,
        batch.year,
        batch.institution,
        batch.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [batches, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={[
        'overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]',
        'shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Profile
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="premium">{batches.length} Batches</Badge>

            {selectedBatch ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <GraduationCap className="h-4 w-4" />
                Selected
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/60">
                <BookOpen className="h-4 w-4 text-cyan-100" />
                No batch selected
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            {searchable ? (
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                leftIcon={<Search className="h-4 w-4" />}
                disabled={disabled || loading}
              />
            ) : null}

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Selected batch details
                </span>
              </div>

              {selectedBatch ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    {selectedBatch.premium ? (
                      <Badge variant="premium">Premium</Badge>
                    ) : null}
                    {selectedBatch.featured ? (
                      <Badge variant="secondary">Featured</Badge>
                    ) : null}
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {selectedBatch.label}
                  </h3>

                  {selectedBatch.year || selectedBatch.institution ? (
                    <p className="text-sm leading-7 text-white/60">
                      {[selectedBatch.year, selectedBatch.institution]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>
                  ) : null}

                  {selectedBatch.description ? (
                    <p className="text-sm leading-7 text-white/65">
                      {selectedBatch.description}
                    </p>
                  ) : null}

                  {showStats &&
                  typeof selectedBatch.totalStudents === 'number' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                        <div className="flex items-center gap-2 text-cyan-100">
                          <Users className="h-4 w-4" />
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            Students
                          </span>
                        </div>
                        <h4 className="mt-2 text-2xl font-bold text-white">
                          {selectedBatch.totalStudents}
                        </h4>
                        <p className="mt-1 text-xs text-white/45">
                          Batch members
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                        <div className="flex items-center gap-2 text-emerald-100">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            Status
                          </span>
                        </div>
                        <h4 className="mt-2 text-2xl font-bold text-white">
                          Live
                        </h4>
                        <p className="mt-1 text-xs text-white/45">
                          Active batch
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                      <p className="text-sm leading-7 text-white/75">
                        আপনার profile এ এই batch টি এখন active আছে। আপনি চাইলে অন্য batch select করতে পারেন।
                      </p>
                    </div>
                  )}

                  {allowClear ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        onClear?.();
                      }}
                      leftIcon={<X className="h-4 w-4" />}
                      disabled={disabled || loading}
                    >
                      Clear selection
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.04] text-cyan-100">
                    <GraduationCap className="h-9 w-9" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-white">
                    কোনো batch selected হয়নি
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-7 text-white/55">
                    Right side থেকে আপনার batch choose করুন।
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-semibold">Available batches</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-3xl border border-white/10 bg-white/[0.05]"
                  />
                ))}
              </div>
            ) : filteredBatches.length > 0 ? (
              <div className="space-y-3">
                {filteredBatches.map((batch) => {
                  const active = batch.id === value;

                  return (
                    <button
                      key={batch.id}
                      type="button"
                      onClick={() => onChange(batch.id)}
                      disabled={disabled}
                      className={[
                        'group w-full rounded-3xl border p-4 text-left transition-all duration-300',
                        active
                          ? 'border-cyan-400/20 bg-cyan-400/10 shadow-[0_10px_35px_rgba(6,182,212,0.15)]'
                          : 'border-white/10 bg-white/[0.04] hover:border-cyan-400/15 hover:bg-white/[0.06]',
                        disabled ? 'cursor-not-allowed opacity-60' : '',
                      ].join(' ')}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-white transition group-hover:text-cyan-100">
                              {batch.label}
                            </h3>

                            {batch.premium ? (
                              <Badge variant="premium">Premium</Badge>
                            ) : null}

                            {batch.featured ? (
                              <Badge variant="secondary">Featured</Badge>
                            ) : null}

                            {active ? (
                              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Active
                              </div>
                            ) : null}
                          </div>

                          <p className="mt-1 text-sm text-white/55">
                            {[batch.year, batch.institution]
                              .filter(Boolean)
                              .join(' • ') || 'No additional details'}
                          </p>

                          {batch.description ? (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
                              {batch.description}
                            </p>
                          ) : null}
                        </div>

                        {showStats &&
                        typeof batch.totalStudents === 'number' ? (
                          <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-right">
                            <div className="text-xs font-semibold uppercase tracking-wider text-white/40">
                              Students
                            </div>
                            <div className="mt-1 text-lg font-bold text-white">
                              {batch.totalStudents}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.04] text-white/35">
                  <Search className="h-9 w-9" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  কোনো batch পাওয়া যায়নি
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-7 text-white/55">
                  আপনার search অনুযায়ী কোনো batch মেলেনি।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
