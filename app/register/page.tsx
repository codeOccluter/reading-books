"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRegisterForm } from "../features/register/useRegisterForm" 
import { RegisterFormData, registerSchema } from "../features/register/schema"

import { Input } from "@/components/ui/input"
import styles from "@/css/register/register.module.css"

export default function RegisterPage() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

    const { registerStatus, registerFunction } = useRegisterForm(watch, setValue)

    return (
        <>
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit(registerFunction.onSubmit)}>
                    <div className={styles.formRow}>
                        <div className={styles.formLeft}>
                            <div className={styles.email}>
                                <Input 
                                    type="email"
                                    placeholder="example@example.exam"
                                    {...register("email")}
                                    onFocus={registerFunction.handleEmailInputFocusOn}
                                    className={`
                                        ${styles.emailInput}
                                        ${registerStatus.emailError ? styles.inputErrorBorder : ""}
                                        ${registerStatus.emailInputShake ? styles.shake : ""}   
                                    `}
                                />
                                <button
                                    type="button"
                                    onClick={registerFunction.handleSendEmailAuth}
                                    className={styles.authButton}
                                >인증코드 받기</button>
                            </div>
                            {registerStatus.emailError && (<p className={styles.emailErrorText}>{registerStatus.emailError}</p>)}
                            <div className={styles.email}>
                                <Input 
                                    type="text"
                                    placeholder="인증코드"
                                    value={registerStatus.authCode}
                                    onChange={(e) => registerStatus.setAuthCode(e.target.value)}
                                    className={styles.emailInput}
                                />
                                <button
                                    type="button"
                                    onClick={registerFunction.handleVerifyCode}
                                    className={styles.authButton}
                                >인증하기</button>
                            </div>
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
                                { registerStatus.imagePreviewUrl ? (
                                    <img 
                                        src={registerStatus.imagePreviewUrl}
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
                                    ><span className={styles.uploadText}>{registerStatus.imagePreviewUrl ? "이미지 변경" : "이미지 업로드"}</span></label>
                                    {registerStatus.imagePreviewUrl && (
                                        <button
                                            type="button"
                                            onClick={registerFunction.handleImageDelete}
                                            className={styles.deleteButton}
                                        >삭제</button>
                                    )}
                                </div>

                                <input 
                                    type="file"
                                    accept="image/"
                                    id="avatar-upload"
                                    className="hidden"
                                    onChange={registerFunction.handleImageChange}
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