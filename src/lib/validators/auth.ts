import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Введите email')
    .email('Неверный формат email'),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(6, 'Пароль должен быть не менее 6 символов'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Введите email')
    .email('Неверный формат email'),
  password: z
    .string()
    .min(8, 'Пароль должен быть не менее 8 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать заглавную букву')
    .regex(/[0-9]/, 'Пароль должен содержать цифру'),
  confirmPassword: z
    .string()
    .min(1, 'Подтвердите пароль'),
  fullName: z
    .string()
    .min(2, 'Введите ФИО')
    .max(100, 'ФИО слишком длинное'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
