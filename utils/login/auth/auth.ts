interface UserPayloadInput {
    id: number,
    email: string,
    name: string
}

export function createJwtPayload(
    user: UserPayloadInput, 
    ip?: string, 
    userAgent?: string
)       {

    return {
        userId: user.id,
        email: user.email,
        name: user.name,
        iat: Date.now()
    }
}