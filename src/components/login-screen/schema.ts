import { z } from 'zod'
export const LoginSchema = z.object({
  email: z.string().email().min(2),
  password: z.string().min(3),
})

export type LoginSchemaType = z.infer<typeof LoginSchema>
