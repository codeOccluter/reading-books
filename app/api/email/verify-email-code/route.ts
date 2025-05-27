import { NextResponse } from "next/server"
import { getCode, removeCode } from "@/utils/email"

export async function POST(req: Request) {

    const { email, code } = await req.json()

    if(!email || !code) {
        return NextResponse.json(
            { error: `이메일과 인증코드가 필요합니다.` },
            { status: 400 },
        )
    }

    const saveCode = getCode(email)

    if(!saveCode) {
        return NextResponse.json(
            { error: `코드가 만료되었거나 존재하지 않습니다.` },
            { status: 410 },
        )
    }

    if(saveCode !== code) {
        return NextResponse.json(
            { error: `인증코드가 올바르지 않습니다.` },
            { status: 401 },
        )
    }
    
    removeCode(email)

    return NextResponse.json(
        { message: `이메일 인증이 완료되었습니다.` },
        { status: 200 }
    )
}