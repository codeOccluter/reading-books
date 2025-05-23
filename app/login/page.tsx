"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormData, loginSchema } from "@/app/features/login/schema"
import { useLoginForm } from "@/app/features/login/useLoginForm"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import styles from "@/css/login/login.module.css"

export default function LoginPage() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue
    } = useForm<loginFormData>({ resolver: zodResolver(loginSchema) })

    const { loginStatus, loginFunction } = useLoginForm(watch, setValue)

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <h1 className={styles.title}>로그인</h1>
                    <form onSubmit={handleSubmit(loginFunction.onSubmit)} className={styles.form}>
                        <Input 
                            type="email"
                            placeholder="example@example.ex"
                            className={styles.loginInput}
                            {...register}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            className={styles.loginInput}
                            {...register}
                        />
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >로그인</button>

                        <div className={styles.linkContainer}>
                            <div className={styles.findLinks}>
                                <button
                                    type="button"
                                    className={styles.linkButton}
                                >이메일 찾기</button>
                                <button
                                    type="button"
                                    className={styles.linkButton}
                                >비밀번호 찾기</button>
                            </div>
                        </div>
                    </form>            

                    <div className={styles.divider} />

                    <div className={styles.socialButtons}>
                        <button
                            onClick={() => signIn("google")}
                            className={styles.socialButton + " " + styles.google}
                        >
                            <img 
                                src="/images/social-login/google.svg"
                                className={styles.socialLoginLogo}
                            />
                            Google 로그인</button>
                        <button
                            onClick={() => signIn("naver")}
                            className={styles.socialButton + " " + styles.naver}
                        >
                            <img 
                                src="/images/social-login/naver.svg"
                                className={styles.socialLoginLogo}
                            />
                            네이버 로그인</button>
                    </div>
                </div>
            </div>
        </>
    )
}