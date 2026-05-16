// bep-full-project/src/features/admin/components/AdminSidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookCopy,
  BookOpen,
  ChevronRight,
  Crown,
  FileQuestion,
  Home,
  Layers3,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

type SidebarItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
};

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'Subjects',
    path: '/admin/subjects',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    label: 'Chapters',
    path: '/admin/chapters',
    icon: <Layers3 className="h-5 w-5" />,
  },
  {
    label: 'Question Bank',
    path: '/admin/questions',
    icon: <FileQuestion className="h-5 w-5" />,
  },
  {
    label: 'Exams',
    path: '/admin/exams',
    icon: <BookCopy className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Community',
    path: '/admin/community',
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[290px] flex-col overflow-hidden border-r border-white/10 bg-[#07101F]/90 backdrop-blur-2xl">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                BEP Admin
              </h2>

              <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-100">
                CMS
              </div>
            </div>

            <p className="mt-1 text-xs text-white/45">
              Smart Education Control Panel
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-100">
              <Crown className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  Premium Admin
                </h3>

                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              </div>

              <p className="mt-1 text-xs leading-5 text-white/60">
                Question Bank, AI Learning এবং Content Management
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                [
                  'group flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-200',
                  isActive
                    ? 'border-cyan-400/20 bg-cyan-400/10 text-white shadow-lg shadow-cyan-500/10'
                    : 'border-transparent text-white/65 hover:border-white/10 hover:bg-white/[0.04] hover:text-white',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        'transition-colors',
                        isActive
                          ? 'text-cyan-200'
                          : 'text-white/45 group-hover:text-white/80',
                      ].join(' ')}
                    >
                      {item.icon}
                    </div>

                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </div>

                  <ChevronRight
                    className={[
                      'h-4 w-4 transition-all',
                      isActive
                        ? 'translate-x-0 text-cyan-200'
                        : '-translate-x-1 text-white/25 group-hover:translate-x-0 group-hover:text-white/60',
                    ].join(' ')}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Admin"
              className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
            />

            <div>
              <h4 className="text-sm font-semibold text-white">
                Super Admin
              </h4>

              <p className="text-xs text-white/45">
                admin@bep.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
