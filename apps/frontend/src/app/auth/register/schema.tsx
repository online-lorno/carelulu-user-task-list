import * as z from 'zod'

export const registerSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm Password is required.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type TRegister = z.infer<typeof registerSchema>
