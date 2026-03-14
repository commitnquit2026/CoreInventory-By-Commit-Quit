import axios from 'axios'

// Use local backend in development, production URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 9000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to all requests
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - redirect to login
    if (error?.response?.status === 401) {
      localStorage.removeItem('jwt_token')
      // Redirect to login page if window exists
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
    const message =
      error?.response?.data?.message || 'Unexpected API error. Please retry.'
    return Promise.reject(new Error(message))
  },
)

export default http
