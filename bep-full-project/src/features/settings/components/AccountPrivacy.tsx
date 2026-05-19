// bep-full-project/src/features/settings/components/AccountPrivacy.tsx

import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';

import {
  Eye,
  EyeOff,
  Globe,
  Lock,
  Shield,
  Users,
} from 'lucide-react';

interface PrivacySetting {
  id: string;

  title: string;
  description: string;

  enabled: boolean;

  icon: React.ReactNode;
}

interface AccountPrivacyProps {
  title?: string;
  subtitle?: string;

  loading?: boolean;
  saving?: boolean;

  compact?: boolean;

  initialSettings?: {
    publicProfile?: boolean;
    showProgress?: boolean;
    leaderboardVisible?: boolean;
    allowMessages?: boolean;
    showEmail?: boolean;
  };

  onSave?: (settings: {
    publicProfile: boolean;
    showProgress: boolean;
    leaderboardVisible: boolean;
    allowMessages: boolean;
    showEmail: boolean;
  }) => Promise<void> | void;
}

export default function AccountPrivacy({
  title = 'Account Privacy',
  subtitle = 'আপনার profile visibility এবং privacy controls manage করুন',

  loading = false,
  saving = false,

  compact = false,

  initialSettings,

  onSave,
}: AccountPrivacyProps) {
  const [publicProfile, setPublicProfile] = useState(
    initialSettings?.publicProfile ?? true,
  );

  const [showProgress, setShowProgress] = useState(
    initialSettings?.showProgress ?? true,
  );

  const [leaderboardVisible, setLeaderboardVisible] =
    useState(
      initialSettings?.leaderboardVisible ?? true,
    );

  const [allowMessages, setAllowMessages] =
    useState(
      initialSettings?.allowMessages ?? true,
    );

  const [showEmail, setShowEmail] = useState(
    initialSettings?.showEmail ?? false,
  );

  const settings = useMemo<PrivacySetting[]>(
    () => [
      {
        id: 'public-profile',
        title: 'Public Profile',
        description:
          'অন্য users আপনার profile দেখতে পারবে',

        enabled: publicProfile,

        icon: publicProfile ? (
          <Globe size={18} />
        ) : (
          <Lock size={18} />
        ),
      },

      {
        id: 'show-progress',
        title: 'Show Study Progress',
        description:
          'Leaderboard এবং profile এ progress দেখাবে',

        enabled: showProgress,

        icon: showProgress ? (
          <Eye size={18} />
        ) : (
          <EyeOff size={18} />
        ),
      },

      {
        id: 'leaderboard-visible',
        title: 'Leaderboard Visibility',
        description:
          'Leaderboard ranking public থাকবে',

        enabled: leaderboardVisible,

        icon: <Users size={18} />,
      },

      {
        id: 'allow-messages',
        title: 'Allow Messages',
        description:
          'Community users আপনাকে message করতে পারবে',

        enabled: allowMessages,

        icon: <Shield size={18} />,
      },

      {
        id: 'show-email',
        title: 'Show Email',
        description:
          'আপনার email public profile এ visible থাকবে',

        enabled: showEmail,

        icon: showEmail ? (
          <Eye size={18} />
        ) : (
          <EyeOff size={18} />
        ),
      },
    ],
    [
      publicProfile,
      showProgress,
      leaderboardVisible,
      allowMessages,
      showEmail,
    ],
  );

  const handleToggle = (id: string) => {
    switch (id) {
      case 'public-profile':
        setPublicProfile((prev) => !prev);
        break;

      case 'show-progress':
        setShowProgress((prev) => !prev);
        break;

      case 'leaderboard-visible':
        setLeaderboardVisible((prev) => !prev);
        break;

      case 'allow-messages':
        setAllowMessages((prev) => !prev);
        break;

      case 'show-email':
        setShowEmail((prev) => !prev);
        break;

      default:
        break;
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    await onSave({
      publicProfile,
      showProgress,
      leaderboardVisible,
      allowMessages,
      showEmail,
    });
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-white/10" />

          <div className="h-4 w-72 rounded bg-white/5" />

          <div className="space-y-3 pt-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 rounded-2xl bg-white/[0.03]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
    >
      {/* Header */}

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>

        <p className="max-w-2xl text-sm text-white/60">
          {subtitle}
        </p>
      </div>

      {/* Settings */}

      <div
        className={`mt-6 grid gap-4 ${
          compact
            ? 'grid-cols-1'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {settings.map((setting) => (
          <motion.div
            key={setting.id}
            whileHover={{
              y: -2,
            }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    setting.enabled
                      ? 'bg-cyan-400/15 text-cyan-300'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {setting.icon}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">
                    {setting.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-white/55">
                    {setting.description}
                  </p>
                </div>
              </div>

              {/* Toggle */}

              <button
                type="button"
                onClick={() =>
                  handleToggle(setting.id)
                }
                className={`relative h-7 w-14 rounded-full transition-all duration-300 ${
                  setting.enabled
                    ? 'bg-cyan-400'
                    : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                    setting.enabled
                      ? 'left-8'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <div>
          <h4 className="text-sm font-medium text-white">
            Privacy Status
          </h4>

          <p className="mt-1 text-xs text-white/50">
            আপনার privacy settings securely encrypted
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </div>
    </motion.section>
  );
}
