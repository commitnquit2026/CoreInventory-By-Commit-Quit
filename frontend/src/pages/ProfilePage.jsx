import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import LoadingState from '../components/common/LoadingState'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  })

  if (loading) {
    return <LoadingState message="Loading profile..." />
  }

  if (!user) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Profile not found</p>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
        <p className="text-slate-600">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-6">
        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium">
              {user.username}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                id="email"
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
            ) : (
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                {user.email}
              </div>
            )}
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2">
              First Name
            </label>
            {isEditing ? (
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={editData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
            ) : (
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                {user.first_name || '-'}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2">
              Last Name
            </label>
            {isEditing ? (
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={editData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
            ) : (
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                {user.last_name || '-'}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Account Status</p>
              <p className="text-sm text-slate-600 mt-1">
                {user.is_active ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    ✕ Inactive
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-6 border-t border-slate-200">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
