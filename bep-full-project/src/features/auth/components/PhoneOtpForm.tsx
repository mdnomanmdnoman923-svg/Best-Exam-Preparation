// bep-full-project/src/features/auth/components/PhoneOtpForm.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Phone, ShieldCheck, Sparkles } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

export interface PhoneOtpFormValues {
  phoneNumber: string;
  otp: string;
}

export interface PhoneOtpFormProps {
  loading?: boolean;
  sendingOtp?: boolean;
  verifyingOtp?: boolean;
  defaultPhoneNumber?: string;
  title?: string;
  subtitle?: string;
  countryCode?: string;
  otpLength?: number;
  resendCooldownSeconds?: number;
  submitLabel?: string;
  sendOtpLabel?: string;
  resendOtpLabel?: string;
  onSendOtp: (phoneNumber: string) => Promise<void> | void;
  onVerifyOtp: (phoneNumber: string, otp: string) => Promise<void> | void;
  onChange?: (values: PhoneOtpFormValues) => void;
  className?: string;
}

function normalizePhoneNumber(value: string) {
  return value
    .replace(/[^\d+]/g, '')
    .replace(/(?!^)\+/g, '')
    .trim();
}

function isValidOtp(value: string, length: number) {
  const regex = new RegExp(`^\\d{${length}}$`);
  return regex.test(value);
}

export default function PhoneOtpForm({
  loading = false,
  sendingOtp = false,
  verifyingOtp = false,
  defaultPhoneNumber = '',
  title = 'ফোন নম্বর দিয়ে চালিয়ে যান',
  subtitle = 'OTP ব্যবহার করে নিরাপদে লগইন করুন',
  countryCode = '+880',
  otpLength = 6,
  resendCooldownSeconds = 60,
  submitLabel = 'Verify OTP',
  sendOtpLabel = 'OTP পাঠান',
  resendOtpLabel = 'আবার পাঠান',
  onSendOtp,
  onVerifyOtp,
  onChange,
  className = '',
}: PhoneOtpFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>(
    defaultPhoneNumber ? 'otp' : 'phone',
  );
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const busy = loading || sendingOtp || verifyingOtp;

  const values = useMemo<PhoneOtpFormValues>(
    () => ({
      phoneNumber,
      otp,
    }),
    [phoneNumber, otp],
  );

  const emitChange = (next: PhoneOtpFormValues) => {
    onChange?.(next);
  };

  const startCooldown = () => {
    setCooldown(resendCooldownSeconds);

    const timer = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const normalized = normalizePhoneNumber(phoneNumber);
    if (!normalized) {
      setError('ফোন নম্বর দিন');
      return;
    }

    setError(null);
    await onSendOtp(`${countryCode}${normalized.replace(/^0+/, '')}`);
    setStep('otp');
    startCooldown();
  };

  const handleVerifyOtp = async () => {
    const normalized = normalizePhoneNumber(phoneNumber);
    const finalPhone = `${countryCode}${normalized.replace(/^0+/, '')}`;

    if (!normalized) {
      setError('ফোন নম্বর দিন');
      return;
    }

    if (!isValidOtp(otp, otpLength)) {
      setError(`${otpLength} সংখ্যার OTP দিন`);
      return;
    }

    setError(null);
    await onVerifyOtp(finalPhone, otp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'phone') {
      await handleSendOtp();
      return;
    }

    await handleVerifyOtp();
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    emitChange({ phoneNumber: value, otp });
    if (error) setError(null);
  };

  const handleOtpChange = (value: string) => {
    const numeric = value.replace(/[^\d]/g, '').slice(0, otpLength);
    setOtp(numeric);
    emitChange({ phoneNumber, otp: numeric });
    if (error) setError(null);
  };

  const canResend = cooldown === 0 && !busy;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={[
        'relative overflow-hidden rounded-3xl border border-white/10',
        'bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Secure OTP Login
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/60">
              {subtitle}
            </p>
          </div>

          <Badge variant="premium">BEP</Badge>
        </div>

        <div className="space-y-5">
          <div>
            <Input
              label="ফোন নম্বর"
              placeholder="01XXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              leftIcon={<Phone className="h-4 w-4" />}
              disabled={busy || step === 'otp'}
              helperText={`দেশ কোড: ${countryCode}`}
              inputMode="tel"
              autoComplete="tel"
            />

            {step === 'phone' ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  loading={sendingOtp}
                  disabled={busy}
                  leftIcon={<ShieldCheck className="h-4 w-4" />}
                >
                  {sendOtpLabel}
                </Button>

                <p className="text-xs text-white/45">
                  OTP পাঠানোর পর আপনি verification step এ যাবেন
                </p>
              </div>
            ) : null}
          </div>

          {step === 'otp' ? (
            <div>
              <Input
                label={`OTP (${otpLength} digits)`}
                placeholder="••••••"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                disabled={busy}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={otpLength}
              />

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  loading={verifyingOtp}
                  disabled={busy || !isValidOtp(otp, otpLength)}
                >
                  {submitLabel}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSendOtp}
                  loading={sendingOtp}
                  disabled={!canResend || busy}
                >
                  {cooldown > 0
                    ? `আবার পাঠান (${cooldown}s)`
                    : resendOtpLabel}
                </Button>
              </div>

              <p className="mt-3 text-xs leading-5 text-white/45">
                SMS না এলে ফোন নম্বর ঠিক আছে কিনা যাচাই করুন, তারপর resend করুন।
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-400/15 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-100">
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  নিরাপদ authentication
                </h3>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  Phone OTP login ব্যবহার করে দ্রুত sign in করুন। আপনার mobile
                  number secure থাকবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
