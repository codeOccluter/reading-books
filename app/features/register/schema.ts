import { z } from "zod"

export const registerSchema = z.object({
    email: z.string(),
    password: z.string(),
    passwordConfirm: z.string(),
    name: z.string(),
    nickname: z.string(),
    birthday: z.string().optional().refine(
        (value) => !value || /^\d{4}\.\d{2}\.\d{2}$/.test(value),
        { message: "YYYY.MM.DD 형식으로 입력하세요." }
    ),
    avatarUrl: z.string().url("유효한 이미지 URL을 입력하세요").optional()
})

export type RegisterFormData = z.infer<typeof registerSchema>