import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không quá 50 ký tự'),
  email: z.string()
    .email('Email không hợp lệ')
    .min(5, 'Email quá ngắn')
    .max(100, 'Email quá dài'),
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không quá 50 ký tự')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export const todoSchema = z.object({
  text: z.string().min(1, 'Nội dung không được để trống'),
  deadline: z.string().datetime(),
  status: z.enum(['pending', 'done']).optional(),
})