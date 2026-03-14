import http from './http'

const authService = {
  // User signup
  register: async (userData) => {
    const response = await http.post('/auth/signup', userData)
    return response.data
  },

  // User login
  login: async (username, password) => {
    const response = await http.post('/auth/login', {
      username,
      password,
    })
    return response.data
  },

  // Get user profile
  getProfile: async (token) => {
    const response = await http.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.user
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await http.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    return response.data
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await http.post('/auth/request-password-reset', {
      email,
    })
    return response.data
  },

  // Reset password with OTP
  resetPassword: async (resetToken, otpCode, newPassword) => {
    const response = await http.post('/auth/reset-password', {
      reset_token: resetToken,
      otp_code: otpCode,
      new_password: newPassword,
    })
    return response.data
  },

  // Setup 2FA
  setup2FA: async () => {
    const response = await http.post('/auth/setup-2fa')
    return response.data
  },

  // Verify 2FA
  verify2FA: async (secret, token) => {
    const response = await http.post('/auth/verify-2fa', {
      secret,
      token,
    })
    return response.data
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await http.put('/auth/profile', profileData)
    return response.data
  },
}

export { authService }
