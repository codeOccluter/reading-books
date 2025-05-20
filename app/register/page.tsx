"use client"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import api from "@/utils/axios/axios"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { ko } from "date-fns/locale"
import { format } from "date-fns"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import styles from "@/css/register/register.module.css"

const schema = z.object({
    email: z.string().email("올바른 이메일을 입력하세요."),
    password: z.string().min(6, "6자 이상 입력하세요."),
    name: z.string().min(1, "이름을 입력하세요."),
    nickname: z.string().optional(),
    birthday: z.string().optional().refine(
        (value) => !value || /^\d{4}\.\d{2}\.\d{2}$/.test(value),
        { message: "YYYY.MM.DD 형식으로 입력하세요." }
    ),
    avatarUrl: z.string().url("유효한 이미지 URL을 입력하세요").optional()
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<FormData>({ resolver: zodResolver(schema) })

    const [result, setResult] = useState("")

    const [emailSent, setEmailSent] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [authCode, setAuthCode] = useState("")
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        if(file) {
            setSelectedImage(file)
            setImagePreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleImageDelete = () => {

        setSelectedImage(null)
        setImagePreviewUrl(null)

        const input = document.getElementById("avatar-upload") as HTMLInputElement
        if(input) input.value = "";
    }

    const handleSendEmailAuth = async () => {

        const email = watch("email")

        if(!email) {
            alert("이메일을 먼저 입력해주세요.")
            return
        }

        try {

            const res = await api.post("/send-email-code", { email })
            setEmailSent(true)
            alert("인증 메일이 발송되었습니다.")
        }catch(error) {
            alert("이메일 발송 실패")
        }
    }

    const handleVerifyCode = async () => {
        
        try{

            const res = await api.post("/verify-email-code", {
                email: watch("email"),
                code: authCode
            })

            setEmailVerified(true)
            alert("이메일 인증 성공")
        }catch(error) {
            alert("인증코드가 올바르지 않습니다.")
        }
    }

    const onSubmit = async (data: FormData) => {

        try{
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const resJson = await res.json()
            if(res.ok) {
                setResult("회원가입 성공!")
            }else {
                setResult(`오류: ${resJson.error} || "알 수 없는 오류"`)
            }
        }catch(e) {
            setResult("서버 오류 발생")
        }
    }

    return (
        <>
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formRow}>
                        <div className={styles.formLeft}>
                            <Input 
                                type="email"
                                placeholder="E-mail"
                                {...register("email")}
                                className={styles.input}
                            />
                            {errors.email && <p className={styles.inputError}>{errors.email.message}</p>}

                            <Input 
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className={styles.input}
                            />
                            {errors.password && <p className={styles.inputError}>{errors.password?.message}</p>}

                            <Input 
                                type="text"
                                {...register("name")} 
                                placeholder="Name"
                                className={styles.input}
                            />
                            <Input  
                                type="text"
                                {...register("nickname")} 
                                placeholder="Nickname"
                                className={styles.input}
                            />
                            <Input
                                type="text"
                                placeholder="생년월일 (YYYY.MM.DD)"
                                {...register("birthday")}
                                className={styles.input}
                            />
                            {errors.birthday && (<p className={styles.inputError}>{errors.birthday.message}</p>)}    
                        </div>

                        <div className={styles.formRight}>
                            <div className={styles.profileImageBox}>
                                { imagePreviewUrl ? (
                                    <img 
                                        src={imagePreviewUrl}
                                        alt="Avatar Preview"
                                        className={styles.avatarPreview}
                                    />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        <span className={styles.avatarIcon}>📷</span>
                                    </div>
                                )}
                                <p className={styles.uploadLabel}>프로필 사진</p>
                                <div className={styles.uploadControls}>
                                    <label htmlFor="avatar-upload" className={styles.uploadButton}
                                    ><span className={styles.uploadText}>{imagePreviewUrl ? "이미지 변경" : "이미지 업로드"}</span></label>
                                    {imagePreviewUrl && (
                                        <button
                                            type="button"
                                            onClick={handleImageDelete}
                                            className={styles.deleteButton}
                                        >삭제</button>
                                    )}
                                </div>

                                <input 
                                    type="file"
                                    accept="image/"
                                    id="avatar-upload"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}