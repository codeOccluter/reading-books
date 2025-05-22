import { useState } from "react"
import api from "@/utils/axios/axios"
import { loginFormData } from "./schema"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export const useLoginForm = (watch: any, setValue: any) => {

    const router = useRouter()

    const loginStatus = {

    }

    const onSubmit = async (data: loginFormData) => {

        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password
        })

        if(res?.ok) {
            router.push("/dashboard")
        }else {
            alert("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.")
        }
    }

    const loginFunction = {
        onSubmit
    }

    return {
        loginStatus,
        loginFunction,
    }
}