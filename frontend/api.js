import axios from 'axios'

const rawURL = (import.meta.env.VITE_APP_URL || 'http://127.0.0.1:5000').replace(/['"]/g, '')
const baseURL = rawURL.endsWith('/api') ? rawURL : `${rawURL.replace(/\/$/, '')}/api`

const api = axios.create({
    baseURL
})

// This is the configuration for the axios api that can be used when we implement tokens
/* 
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
*/

export default api
