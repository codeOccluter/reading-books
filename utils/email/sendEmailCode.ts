import nodemailer from "nodemailer"

export const sendEmailCode = async (email: string, code: string) => {

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    await transporter.sendMail({
        from: `Reading Books Service <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "[ReadingBooks] 이메일 인증 코드입니다.",
        html: `
        <p>
            <b>인증코드</b> ${code}
        </p>
        `
    })
}