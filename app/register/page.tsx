"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import styles from "@/css/register/register.module.css"

const schema = z.object({
    email: z.string().email("올바른 이메일을 입력하세요."),
    password: z.string().min(6, "6자 이상 입력하세요."),
    name: z.string().min(1, "이름을 입력하세요."),
    nickname: z.string().optional(),
    birthday: z.string().optional(),
    avatarUrl: z.string().url("유효한 이미지 URL을 입력하세요").optional()
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<FormData>({ resolver: zodResolver(schema) })

    const avaterUrl = watch("avatarUrl")

    const [result, setResult] = useState("")
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
    const [imageError, setImageError] = useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        if(file) {
            setSelectedImage(file)
            setImagePreviewUrl(URL.createObjectURL(file))
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
                    <h1 className={styles.title}>회원가입</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <div>
                            {/* <Label className={styles.label}>이메일</Label> */}
                            <Input 
                                type="email" 
                                placeholder="E-mail"
                                {...register("email")} 
                                className={styles.input} 
                            />
                            {errors.email && <p className={styles.inputError}>{errors.email.message}</p>}
                        </div>
                        <div>
                            <Input 
                                type="password" 
                                placeholder="Password"
                                {...register("password")}
                            />
                            {errors.email && <p className={styles.inputError}>{errors.password?.message}</p>}
                        </div>
                        <div>
                            <Input 
                                {...register("name")} 
                                placeholder="Name"
                                className={styles.input}
                            />
                        </div>
                        <div>
                            <Input 
                                {...register("nickname")} 
                                placeholder="Nickname"
                                className={styles.input}
                            />
                        </div>
                        <div>
                            <Input 
                                {...register("birthday")} 
                                placeholder="Birthday"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.avatarRow}>
                            <label
                                htmlFor="avatar-upload" className={styles.uploadWrapper}
                            ><span className={styles.uploadText}>Image Upload</span></label>
                            {imagePreviewUrl && (
                                <img
                                    src={imagePreviewUrl}
                                    alt="Avatar Preview"
                                    className={styles.avatarPreview}
                                />
                            )}
                        </div>
                        <input 
                            type="file"
                            accept="image/"
                            className="hidden"
                            id="avatar-upload"
                            onChange={handleImageChange}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.submitButton}
                        >{isSubmitting ? "가입 중..." : "회원가입"}</Button>
                    </form>

                    {result && <p className="mt-4 text-center font-semibold">{result}</p>}
                </div>
            </div>
        </>
    )
}