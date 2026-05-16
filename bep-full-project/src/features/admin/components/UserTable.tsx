// bep-full-project/src/features/admin/components/UserTable.tsx

import React, { useMemo, useState } from 'react';
import {
  Crown,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
} from 'lucide-react';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

import type {
  AdminUser,
  UserRole,
} from '@/features/admin/types';

interface UserTableProps {
  users?: AdminUser[];
  loading?: boolean;
  onDelete?: (user: AdminUser) => void;
  onRoleChange?: (
    user: AdminUser,
    role: UserRole,
  ) => void;
}

const demoUsers: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Rakib Hasan',
    email: 'rakib@example.com',
    avatar:
      'https://i.pravatar.cc/200?img=12',
    role: 'student',
    premium: true,
    institution: 'Rajshahi College',
    examsCompleted: 145,
    joinedAt: '2026-01-10',
    status: 'active',
  },

  {
    id: 'user-2',
    name: 'Nusrat Jahan',
    email: 'nusrat@example.com',
    avatar:
      'https://i.pravatar.cc/200?img=32',
    role: 'moderator',
    premium: true,
    institution:
      'Viqarunnisa Noon School',
    examsCompleted: 212,
    joinedAt: '2026-02-18',
    status: 'active',
  },

  {
    id: 'user-3',
    name: 'Tanvir Ahmed',
    email: 'tanvir@example.com',
    avatar:
      'https://i.pravatar.cc/200?img=22',
    role: 'admin',
    premium: true,
    institution: 'Dhaka College',
    examsCompleted: 330,
    joinedAt: '2025-12-02',
    status: 'active',
  },

  {
    id: 'user-4',
    name: 'Sadia Islam',
    email: 'sadia@example.com',
    avatar:
      'https://i.pravatar.cc/200?img=48',
    role: 'student',
    premium: false,
    institution: 'Holy Cross College',
    examsCompleted: 41,
    joinedAt: '2026-04-01',
    status: 'inactive',
  },
];

const roleOptions: UserRole[] = [
  'student',
  'moderator',
  'admin',
];

export default function UserTable({
  users = demoUsers,
  loading = false,
  onDelete,
  onRoleChange,
}: UserTableProps) {
  const [search, setSearch] =
    useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, users]);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
      <div className="border-b border-white/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              <Users className="h-3.5 w-3.5" />
              User Management
            </div>

            <h2 className="text-2xl font-bold text-white">
              BEP Users
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Students, moderators এবং admins manage করুন
            </p>
          </div>

          <div className="w-full max-w-sm">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              leftIcon={
                <Search className="h-4 w-4" />
              }
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                User
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Role
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Institution
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Exams
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className="border-t border-white/5"
                >
                  <td
                    colSpan={6}
                    className="px-6 py-5"
                  >
                    <div className="h-14 animate-pulse rounded-2xl bg-white/[0.05]" />
                  </td>
                </tr>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">
                            {user.name}
                          </h3>

                          {user.premium && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/15 text-yellow-200">
                              <Crown className="h-3 w-3" />
                            </div>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-white/45">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          Joined: {user.joinedAt}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                        <ShieldCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            onRoleChange?.(
                              user,
                              e.target
                                .value as UserRole,
                            )
                          }
                          className="rounded-xl border border-white/10 bg-[#0B1526] px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400/30"
                        >
                          {roleOptions.map(
                            (role) => (
                              <option
                                key={role}
                                value={role}
                              >
                                {role}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-white/75">
                    {user.institution}
                  </td>

                  <td className="px-6 py-5">
                    <div className="inline-flex rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-sm font-semibold text-fuchsia-100">
                      {user.examsCompleted}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <Badge
                      variant={
                        user.status ===
                        'active'
                          ? 'success'
                          : 'secondary'
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          onDelete?.(user)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center"
                >
                  <div className="mx-auto flex max-w-md flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
                      <Users className="h-9 w-9 text-white/35" />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-white">
                      কোনো user পাওয়া যায়নি
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Search পরিবর্তন করে আবার চেষ্টা করুন
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
