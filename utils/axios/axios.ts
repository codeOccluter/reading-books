import axios from "axios"

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            console.warn("인증 오류: 로그인 필요")
        }

        return Promise.reject(error)
    }
)

export default api