import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {

    const { email, password } = await req.json()

    const mockUser = {
        id: 1,
        email: "test@example.com",
        passwordHash: await bcrypt.hash("123456", 10),
        name: "MOON"
    }

    const isCorrectPassword = await bcrypt.compare(password, mockUser.passwordHash)

    if(email !== mockUser.email || !isCorrectPassword) {
        return NextResponse.json(
            { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
            { status: 401 },
        )
    }

    const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email, name: mockUser.name },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
    )

    cookies()
        .set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        })

    return NextResponse.json(
        { message: "로그인 성공", user: mockUser },
    )
}