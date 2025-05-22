import { useState } from "react"
import api from "@/utils/axios/axios"
import { RegisterFormData } from "./schema"

export const useRegisterForm = (watch: any, setValue: any) => {

    const [result, setResult] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [authCode, setAuthCode] = useState("")
    const [emailError, setEmailError] = useState("")
    const [emailInputShake, setEmailInputShake] = useState(false)

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
        setAuthCode
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

            setEmailVerified(true)
            alert("이메일 인증 성공")
        }catch(error) {
            alert("인증코드가 올바르지 않습니다.")
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

    const registerFunction = {
        handleImageChange,
        handleImageDelete,
        handleSendEmailAuth,
        handleEmailInputFocusOn,
        handleVerifyCode,
        onSubmit,
    }

    return {
        registerStatus, 
        registerFunction
    }
}