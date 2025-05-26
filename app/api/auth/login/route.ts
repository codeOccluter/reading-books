import { createJwtPayload } from "@/utils/login/auth/auth"
import { NextResponse } from "next/server"

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {

    const { email, password } = await req.json()

    const mockUser = {
        id: 1,
        email: "resacle93@naver.com",
        passwordHash: await bcrypt.hash("qlalfqjsgh!23", 10),
        name: "MOON"
    }

    const isCorrectPassword = await bcrypt.compare(password, mockUser.passwordHash)

    if(email !== mockUser.email || !isCorrectPassword) {
        return NextResponse.json(
            { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
            { status: 401 },
        )
    }

    const payload = createJwtPayload(mockUser)
    const secret = process.env.JWT_SECRET
    const options: jwt.SignOptions = {
        expiresIn: "7d"
    }

    if(!secret) {
        throw new Error(`JWT SECRET is not defined`)
    }
    // console.log(`JWT_SECRET = ${secret}`)
    const token = jwt.sign(payload, secret, options)

    const response = NextResponse.json({
        message: `로그인 성공`,
        user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name
        }
    })

    response.cookies.set(`token`, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === `production`,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    })

    return response
}