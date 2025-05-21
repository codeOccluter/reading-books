import { NextResponse } from "next/server"
import { sendEmailCode, saveCode } from "@/utils/email"

export async function POST(req: Request) {

    const { email } = await req.json()

    if(!email || typeof email !== "string") {
        return NextResponse.json(
            { error: `이메일이 유효하지 않습니다.` },
            { status: 400 },
        )
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()

    try {
        
        await sendEmailCode(email, code)
        saveCode(email, code)
        
        return NextResponse.json(
            { message: `인증 코드 전송 완료` },
        )
    }catch(error) {
        console.error(`이메일 전송 실패: ${error}`)
        return NextResponse.json(
            { error: `이메일 전송 실패` },
            { status: 500 }
        )
    }
}