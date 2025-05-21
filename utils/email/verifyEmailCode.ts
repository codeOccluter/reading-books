const codeStore = new Map<string, string>()

export const saveCode = (email: string, code: string) => {
    codeStore.set(email, code)
}

export const getCode = (email: string) => {
    return codeStore.get(email)
}

export const removeCode = (email: string) => {
    codeStore.delete(email)
}