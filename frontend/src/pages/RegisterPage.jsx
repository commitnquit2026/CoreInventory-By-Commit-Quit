import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Boxes, Check } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error, setError } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    first_name: '',
    last_name: '',
    role: 'Warehouse Staff',
  })
  const [formError, setFormError] = useState('')
  const [step, setStep] = useState(1)

  const roles = [
    'Inventory Manager',
    'Warehouse Staff',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setFormError('')
    setError(null)
  }

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name
    ) {
      setFormError('Please fill in all fields')
      return false
    }

    if (formData.username.length < 6 || formData.username.length > 12) {
      setFormError('Login Id must be between 6 and 12 characters')
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address')
      return false
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters')
      return false
    }

    if (formData.password !== formData.passwordConfirm) {
      setFormError('Passwords do not match')
      return false
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
      setFormError(
        'Password must contain uppercase, lowercase, number, and special character'
      )
      return false
    }

    return true
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (!formData.first_name || !formData.last_name) {
        setFormError('Please fill in your name')
        return
      }
      setFormError('')
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!validateForm()) {
      return
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      role: formData.role,
    })

    if (result.success) {
      navigate('/login', {
        state: { message: 'Registration successful! Please log in.' },
      })
    } else {
      setFormError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl" />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-xl p-8 space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center">
                <img src="/logo.png" alt="CoreInventory" className="h-20 w-20" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                <p className="text-slate-600 mt-2">Join CoreInventory today</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex gap-2">
              <div className={`flex-1 h-2 rounded-full transition ${step >= 1 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-slate-300'}`} />
              <div className={`flex-1 h-2 rounded-full transition ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-slate-300'}`} />
            </div>

            {/* Form */}
            <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
              {step === 1 ? (
                <>
                  {/* First Step: Personal Info */}
                  <div className="space-y-5">
                    {/* First Name */}
                    <div className="space-y-2">
                      <label htmlFor="first_name" className="block text-sm font-semibold text-slate-700">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          id="first_name"
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="John"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label htmlFor="last_name" className="block text-sm font-semibold text-slate-700">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          id="last_name"
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <label htmlFor="role" className="block text-sm font-semibold text-slate-700">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Error Messages */}
                  {(formError || error) && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 font-medium">{formError || error}</p>
                    </div>
                  )}

                  {/* Next Button */}
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  {/* Second Step: Account Info */}
                  <div className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                        Email Id
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                        Login Id
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          id="username"
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter Login Id"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-slate-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          id="passwordConfirm"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="passwordConfirm"
                          value={formData.passwordConfirm}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Error Messages */}
                  {(formError || error) && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 font-medium">{formError || error}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      {loading ? 'Creating Account...' : (
                        <>
                          Create Account
                          <Check className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="block w-full px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition text-center"
            >
              Sign In
            </Link>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-slate-600 mt-6">
            By signing up, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
