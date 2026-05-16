// src/components/common/PageHeader.tsx

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Sparkles,
} from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  centered?: boolean;
  className?: string;
};

export default function PageHeader({
  title,
  subtitle,
  badge,
  icon,
  actions,
  breadcrumbs = [],
  centered = false,
  className = '',
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={[
        'relative overflow-hidden rounded-3xl border border-white/10',
        'bg-white/[0.04] p-6 backdrop-blur-2xl',
        'shadow-[0_10px_50px_rgba(0,0,0,0.35)]',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_left,rgba(168,85,247,0.10),transparent_28%)]" />

      <div className="relative z-10">
        {breadcrumbs.length > 0 && (
          <div
            className={[
              'mb-4 flex flex-wrap items-center gap-1 text-xs text-white/45',
              centered ? 'justify-center' : 'justify-start',
            ].join(' ')}
          >
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={`${item.label}-${index}`}>
                <span className="transition-colors hover:text-white/80">
                  {item.label}
                </span>

                {index !== breadcrumbs.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-white/30" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div
          className={[
            'flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between',
            centered ? 'items-center text-center' : '',
          ].join(' ')}
        >
          <div className="flex items-start gap-4">
            {icon && (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
                {icon}
              </div>
            )}

            <div>
              {badge && (
                <div
                  className={[
                    'mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20',
                    'bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-200',
                  ].join(' ')}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {badge}
                </div>
              )}

              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {actions && (
            <div
              className={[
                'flex flex-wrap items-center gap-3',
                centered ? 'justify-center' : 'justify-start lg:justify-end',
              ].join(' ')}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
