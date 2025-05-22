import { z } from "zod"

export const registerSchema = z.object({
    email: z.string()
        .min(1, "이메일을 입력하세요."),
    password: z.string().min(6, "6자 이상 입력하세요."),
    name: z.string().min(1, "이름을 입력하세요."),
    nickname: z.string().optional(),
    birthday: z.string().optional().refine(
        (value) => !value || /^\d{4}\.\d{2}\.\d{2}$/.test(value),
        { message: "YYYY.MM.DD 형식으로 입력하세요." }
    ),
    avatarUrl: z.string().url("유효한 이미지 URL을 입력하세요").optional()
})

export type RegisterFormData = z.infer<typeof registerSchema>