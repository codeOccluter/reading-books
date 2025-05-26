import { useState } from "react"
import api from "@/utils/axios/axios"
import { RegisterFormData } from "./schema"

export enum PasswordStrength {
    Weak = "weak",
    Medium = "medium",
    Strong = "strong",
    None = ""
}

export const useRegisterForm = (watch: any, setValue: any) => {

    const [result, setResult] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [authCode, setAuthCode] = useState("")
    const [emailCodeVerified, setEmailCodeVerified] = useState("")
    const [emailError, setEmailError] = useState("")
    const [emailInputShake, setEmailInputShake] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.None)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

    const registerStatus = {
        result,
        emailSent,
        emailVerified,
        authCode,
        emailError,
        emailInputShake,
        selectedImage,
        imagePreviewUrl,
        showPassword,
        passwordStrength,
        setAuthCode,
        setShowPassword,
        setPasswordStrength,
        emailCodeVerified,
    }

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

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const invalid = !email || !emailRegex.test(email);

        if (invalid) {
            
            setEmailError(!email ? "이메일을 먼저 입력해주세요." : "유효한 이메일 형식을 입력해주세요.");
            setEmailInputShake(true);
            setTimeout(() => setEmailInputShake(false), 500);
            
            return;
        }


        try {

            const res = await api.post("/email/send-email-code", { email })
            setEmailSent(true)
            setEmailError("")
        }catch(error) {
            setEmailError(`이메일 전송에 실패했습니다. (front-end), ${error}`)
        }
    }

    const handleEmailInputFocusOn = () => {
        setEmailError("")
        setEmailInputShake(false)
    }

    const handleVerifyCode = async () => {
        
        try{
            const res = await api.post("/email/verify-email-code", {
                email: watch("email"),
                code: authCode
            })
    
            setEmailCodeVerified(res.data.message)
            setEmailVerified(true)
        }catch(error){
            console.log(error)
        }
    }

    const onSubmit = async (data: RegisterFormData) => {

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

    const checkPasswordStrength = (password: string): PasswordStrength => {

        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
        const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/

        if(strongRegex.test(password)) return PasswordStrength.Strong
        if(mediumRegex.test(password)) return PasswordStrength.Medium
        
        return PasswordStrength.Weak
    }

    const registerFunction = {
        handleImageChange,
        handleImageDelete,
        handleSendEmailAuth,
        handleEmailInputFocusOn,
        handleVerifyCode,
        onSubmit,
        checkPasswordStrength
    }

    return {
        registerStatus, 
        registerFunction
    }
}