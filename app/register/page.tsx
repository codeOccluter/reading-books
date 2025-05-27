"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { useRegisterForm } from "../features/register/useRegisterForm" 
import { RegisterFormData, registerSchema } from "../features/register/schema"

import { Input } from "@/components/ui/input"
import styles from "@/css/register/register.module.css"
import { PasswordStrength } from "../features/register/useRegisterForm"

export default function RegisterPage() {

    const {
        register,
        handleSubmit,
        watch,
        setValue,
    } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

    const { registerStatus, registerFunction } = useRegisterForm(watch, setValue)

    const password = watch("password")
    const passwordConfirm = watch("passwordConfirm")
    const isMatch = password === passwordConfirm

    useEffect(() => {
        if(password) {
            registerStatus.setPasswordStrength(registerFunction.checkPasswordStrength(password))
        }else {
            registerStatus.setPasswordStrength(PasswordStrength.None)
        }
    }, [password])

    return (
        <>
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <form id="register-form" className={styles.form} onSubmit={handleSubmit(registerFunction.onSubmit)}>
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
                            <p className={`${registerStatus.emailVerified} ? ${styles.emailVerifiedCode} : ${styles.emailVerifiedCodeError}`}>
                                {registerStatus.emailCodeVerified}
                            </p>

                            <div className={styles.passwordBirthday}>
                                <Input 
                                    type={registerStatus.showPassword ? "text" : "password"}
                                    placeholder="영문/숫자/특수문자 조합"
                                    {...register("password")}
                                    className={styles.input}
                                />
                                <button
                                    type="button"
                                    className={styles.passwordShow}
                                    onClick={() => registerStatus.setShowPassword(!registerStatus.showPassword)}
                                >{registerStatus.showPassword ? "🔒" : "👁‍🗨"}</button>
                            </div>
                            {password && (
                                <p
                                    className={`
                                        text-sm mt-1
                                        ${registerStatus.passwordStrength === "strong" && "text-green-600"}
                                        ${registerStatus.passwordStrength === "medium" && "text-yellow-600"}
                                        ${registerStatus.passwordStrength === "weak" && "text-red-600"}  
                                    `}
                                >
                                    {registerStatus.passwordStrength === "strong" && "비밀번호 강도: 강함"}
                                    {registerStatus.passwordStrength === "medium" && "비밀번호 강도: 보통"}
                                    {registerStatus.passwordStrength === "weak" && "비밀번호 강도: 약함"}
                                </p>
                            )}
                            <Input 
                                className={styles.input}
                                type="password"
                                {...register("passwordConfirm")}
                                placeholder="비밀번호 확인"
                            />
                            {passwordConfirm && (
                                <p className={isMatch ? styles.passwordConfirmSuccess : styles.passwordConfirmError}>
                                    {isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
                                </p>
                            )}
                            <Input 
                                type="text"
                                {...register("name")} 
                                placeholder="이름"
                                className={styles.input}
                            />
                            <Input  
                                type="text"
                                {...register("nickname")} 
                                placeholder="닉네임"
                                className={styles.input}
                            />
                            <div className={styles.passwordBirthday}>
                                <Input
                                    type="text"
                                    placeholder="생년월일 (YYYY.MM.DD)"
                                    {...register("birthday")}
                                    className={styles.input} 
                                    onChange={(e) => {}}
                                />
                            </div>
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

            <div className={styles.actionArea}>
                <button
                    type="submit"
                    form="register-form"
                    className={styles.submitButton}
                >가입하기</button>
            </div>
        </div>
        </>
    )
}