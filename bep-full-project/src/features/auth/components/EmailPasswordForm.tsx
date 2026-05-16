import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/auth.service'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validators'
import { ROUTES } from '@/lib/constants'

interface EmailPasswordFormProps {
  mode: 'login' | 'register'
  onForgotPassword?: () => void
}

export function EmailPasswordForm({ mode, onForgotPassword }: EmailPasswordFormProps) {
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const schema = mode === 'login' ? loginSchema : registerSchema
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginInput | RegisterInput>({ resolver: zodResolver(schema as any) })

  const onSubmit = async (data: LoginInput | RegisterInput) => {
    try {
      if (mode === 'login') {
        await authService.signInWithEmail(data as LoginInput)
        toast.success('স্বাগতম!')
      } else {
        await authService.registerWithEmail(data as RegisterInput)
        toast.success('অ্যাকাউন্ট তৈরি হয়েছে!')
      }
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/user-not-found': 'ইমেইল পাওয়া যায়নি',
        'auth/wrong-password': 'পাসওয়ার্ড ভুল',
        'auth/email-already-in-use': 'ইমেইলটি ইতোমধ্যে ব্যবহৃত',
        'auth/invalid-credential': 'ইমেইল বা পাসওয়ার্ড ভুল',
        'auth/too-many-requests': 'অনেকবার চেষ্টা করা হয়েছে',
      }
      toast.error(messages[err.code] ?? 'কিছু একটা ভুল হয়েছে')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === 'register' && (
        <Input
          label="পুরো নাম"
          placeholder="আপনার নাম লিখুন"
          leftIcon={<User size={16} />}
          error={(errors as any).displayName?.message}
          {...register('displayName')}
        />
      )}
      <Input
        label="ইমেইল"
        type="email"
        placeholder="your@email.com"
        leftIcon={<Mail size={16} />}
        error={(errors as any).email?.message}
        {...register('email')}
      />
      <Input
        label="পাসওয়ার্ড"
        type={showPass ? 'text' : 'password'}
        placeholder="••••••••"
        leftIcon={<Lock size={16} />}
        rightIcon={
          <button type="button" onClick={() => setShowPass((p) => !p)} className="hover:text-bep-text transition-colors">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        error={(errors as any).password?.message}
        {...register('password')}
      />
      {mode === 'register' && (
        <Input
          label="পাসওয়ার্ড নিশ্চিত করুন"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock size={16} />}
          error={(errors as any).confirmPassword?.message}
          {...register('confirmPassword')}
        />
      )}
      {mode === 'login' && onForgotPassword && (
        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-bep-primary hover:underline font-bengali"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </button>
        </div>
      )}
      <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
        {mode === 'login' ? 'লগইন করুন' : 'নিবন্ধন করুন'}
      </Button>
    </form>
  )
}
