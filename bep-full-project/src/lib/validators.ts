import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('বৈধ ইমেইল দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'),
})

export const registerSchema = z.object({
  displayName: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর').max(50),
  email: z.string().email('বৈধ ইমেইল দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'পাসওয়ার্ড মিলছে না',
  path: ['confirmPassword'],
})

export const profileSchema = z.object({
  displayName: z.string().min(2).max(50),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  phoneNumber: z.string().regex(/^(\+880|0)1[3-9]\d{8}$/, 'বৈধ বাংলাদেশি নম্বর দিন').optional().nullable(),
  institution: z.string().optional().nullable(),
})

export const educationSchema = z.object({
  level: z.enum(['ssc', 'hsc', 'university', 'job_prep', 'other']),
  classYear: z.string().optional().nullable(),
  group: z.string().optional().nullable(),
  examYear: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  batchId: z.string().optional().nullable(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'),
  confirmNewPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmNewPassword, {
  message: 'পাসওয়ার্ড মিলছে না',
  path: ['confirmNewPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type EducationInput = z.infer<typeof educationSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
