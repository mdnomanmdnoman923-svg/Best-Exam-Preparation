// bep-full-project/src/features/profile/components/ClassSelect.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export interface ClassOption {
  id: string;
  label: string;
  level?: string;
  institutionType?: string;
  description?: string;
  totalStudents?: number;
  premium?: boolean;
  featured?: boolean;
  icon?: React.ReactNode;
}

export interface ClassSelectProps {
  classes: ClassOption[];
  value?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  searchable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  showStats?: boolean;
  onChange: (classId: string) => void;
  onClear?: () => void;
  className?: string;
}

export default function ClassSelect({
  classes,
  value,
  title = 'Class Select',
  subtitle = 'আপনার class level select করুন',
  placeholder = 'Class search করুন...',
  searchable = true,
  loading = false,
  disabled = false,
  allowClear = true,
  showStats = true,
  onChange,
  onClear,
  className = '',
}: ClassSelectProps) {
  const [search, setSearch] = useState('');

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === value) || null,
    [classes, value],
  );

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return classes;

    return classes.filter((item) =>
      [item.label, item.level, item.institutionType, item.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [classes, search]);

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
            <Badge variant="premium">{classes.length} Classes</Badge>

            {selectedClass ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <GraduationCap className="h-4 w-4" />
                Selected
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/60">
                <BookOpen className="h-4 w-4 text-cyan-100" />
                No class selected
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
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm font-semibold">Selected class details</span>
              </div>

              {selectedClass ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    {selectedClass.premium ? <Badge variant="premium">Premium</Badge> : null}
                    {selectedClass.featured ? <Badge variant="secondary">Featured</Badge> : null}
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {selectedClass.label}
                  </h3>

                  {selectedClass.level || selectedClass.institutionType ? (
                    <p className="text-sm leading-7 text-white/60">
                      {[selectedClass.level, selectedClass.institutionType]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>
                  ) : null}

                  {selectedClass.description ? (
                    <p className="text-sm leading-7 text-white/65">
                      {selectedClass.description}
                    </p>
                  ) : null}

                  {showStats && typeof selectedClass.totalStudents === 'number' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                        <div className="flex items-center gap-2 text-cyan-100">
                          <Users className="h-4 w-4" />
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            Students
                          </span>
                        </div>
                        <h4 className="mt-2 text-2xl font-bold text-white">
                          {selectedClass.totalStudents}
                        </h4>
                        <p className="mt-1 text-xs text-white/45">
                          Class members
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
                          Active class
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                      <p className="text-sm leading-7 text-white/75">
                        আপনার profile এ এই class টি active আছে। আপনি চাইলে অন্য class select করতে পারেন।
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
                    কোনো class selected হয়নি
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-7 text-white/55">
                    Right side থেকে আপনার class choose করুন।
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-semibold">Available classes</span>
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
            ) : filteredClasses.length > 0 ? (
              <div className="space-y-3">
                {filteredClasses.map((item) => {
                  const active = item.id === value;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChange(item.id)}
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
                              {item.label}
                            </h3>

                            {item.premium ? <Badge variant="premium">Premium</Badge> : null}
                            {item.featured ? <Badge variant="secondary">Featured</Badge> : null}

                            {active ? (
                              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Active
                              </div>
                            ) : null}
                          </div>

                          <p className="mt-1 text-sm text-white/55">
                            {[item.level, item.institutionType].filter(Boolean).join(' • ') ||
                              'No additional details'}
                          </p>

                          {item.description ? (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
                              {item.description}
                            </p>
                          ) : null}
                        </div>

                        {showStats && typeof item.totalStudents === 'number' ? (
                          <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-right">
                            <div className="text-xs font-semibold uppercase tracking-wider text-white/40">
                              Students
                            </div>
                            <div className="mt-1 text-lg font-bold text-white">
                              {item.totalStudents}
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
                  কোনো class পাওয়া যায়নি
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-7 text-white/55">
                  আপনার search অনুযায়ী কোনো class মেলেনি।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
