import { z } from "zod"

export const loginSchema = z.object({
    email: z.string()
        .min(1, "이메일을 입력하세요."),
    password: z.string().min(6, "6자 이상 입력하세요."),
})

export type loginFormData = z.infer<typeof loginSchema>