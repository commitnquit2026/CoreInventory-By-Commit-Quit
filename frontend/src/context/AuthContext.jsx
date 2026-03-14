import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in (on mount)
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token')
    if (storedToken) {
      setToken(storedToken)
      // Verify token is still valid by fetching profile
      authService
        .getProfile(storedToken)
        .then((userData) => {
          setUser(userData)
          setError(null)
        })
        .catch((err) => {
          console.error('Token validation failed:', err)
          localStorage.removeItem('jwt_token')
          setToken(null)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.login(username, password)
      
      // Store token
      localStorage.setItem('jwt_token', response.token)
      setToken(response.token)
      setUser(response.user)
      
      return { success: true, user: response.user }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.register(userData)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    setToken(null)
    setUser(null)
    setError(null)
  }

  const isAuthenticated = !!token && !!user

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    setError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
