//we use this file instead of axios for the provided access token in headers

//interceptor - intercepts all our requests and adds headers to them
//axios - clean and easy way to send internet requests, IF we have access, token headers are auto added

import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // we import so we can easily change
})


//we check if the sender has permission before using the interceptor to add the header for jwt token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    }
)

export default api

