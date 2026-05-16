// src/components/forms/ProfileForm.tsx

import React, { useState } from 'react';
import {
  Facebook,
  Globe,
  Phone,
  User,
} from 'lucide-react';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface ProfileFormValues {
  name: string;
  phone: string;
  bio: string;
  institution: string;
  facebook: string;
  website: string;
}

interface ProfileFormProps {
  loading?: boolean;
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit: (
    values: ProfileFormValues,
  ) => Promise<void> | void;
}

export default function ProfileForm({
  loading = false,
  defaultValues,
  onSubmit,
}: ProfileFormProps) {
  const [values, setValues] =
    useState<ProfileFormValues>({
      name: defaultValues?.name || '',
      phone: defaultValues?.phone || '',
      bio: defaultValues?.bio || '',
      institution:
        defaultValues?.institution || '',
      facebook: defaultValues?.facebook || '',
      website: defaultValues?.website || '',
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
          প্রোফাইল আপডেট
        </h2>

        <p className="mt-2 text-sm text-white/60">
          আপনার BEP profile তথ্য আপডেট করুন
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="পূর্ণ নাম"
          value={values.name}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          leftIcon={<User className="h-4 w-4" />}
        />

        <Input
          label="ফোন নাম্বার"
          value={values.phone}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
          leftIcon={<Phone className="h-4 w-4" />}
        />

        <Input
          label="প্রতিষ্ঠান"
          value={values.institution}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              institution: e.target.value,
            }))
          }
        />

        <Input
          label="Facebook"
          value={values.facebook}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              facebook: e.target.value,
            }))
          }
          leftIcon={<Facebook className="h-4 w-4" />}
        />

        <div className="md:col-span-2">
          <Input
            label="Website"
            value={values.website}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                website: e.target.value,
              }))
            }
            leftIcon={<Globe className="h-4 w-4" />}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/85">
            Bio
          </label>

          <textarea
            rows={5}
            value={values.bio}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                bio: e.target.value,
              }))
            }
            placeholder="নিজের সম্পর্কে কিছু লিখুন..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/15"
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          loading={loading}
        >
          প্রোফাইল সংরক্ষণ করুন
        </Button>
      </div>
    </form>
  );
}
