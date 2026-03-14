import { useEffect, useState } from 'react'
import { Plus, Building2, MapPin, Edit2, X, Settings as SettingsIcon, User, Key } from 'lucide-react'
import { inventoryService } from '../services/inventoryService'
import { authService } from '../services/authService'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('warehouses') // 'warehouses' | 'account'
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCreateWH, setShowCreateWH] = useState(false)
  const [selectedWH, setSelectedWH] = useState(null)
  const [locations, setLocations] = useState([])
  const [showCreateLoc, setShowCreateLoc] = useState(false)

  const [whForm, setWhForm] = useState({ name: '', location: '', capacity: '' })
  const [locForm, setLocForm] = useState({ rack_code: '', location_type: 'Rack', capacity: '' })
  // Account state
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '' })
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [twoFASetup, setTwoFASetup] = useState(null)
  const [twoFAVerifyCode, setTwoFAVerifyCode] = useState('')
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  useEffect(() => { loadWarehouses() }, [])

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    try {
      const token = localStorage.getItem('jwt_token')
      const user = await authService.getProfile(token)
      setProfile({ first_name: user.first_name || '', last_name: user.last_name || '', email: user.email || '' })
    } catch (e) {
      // ignore
    }
  }

  async function loadWarehouses() {
    try {
      setLoading(true)
      const res = await inventoryService.getWarehouses()
      setWarehouses(res.data?.data || res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadLocations(warehouseId) {
    try {
      setError('')
      const res = await inventoryService.getWarehouseLocations(warehouseId)
      const locData = res.data?.locations || res.data || []
      setLocations(Array.isArray(locData) ? locData : [])
    } catch (e) {
      setError(`Failed to load locations: ${e.message}`)
      setLocations([])
    }
  }

  async function handleCreateWarehouse(e) {
    e.preventDefault()
    try {
      setError('')
      await inventoryService.createWarehouse({
        name: whForm.name,
        location: whForm.location,
        capacity: whForm.capacity ? Number(whForm.capacity) : undefined,
      })
      setSuccess('Warehouse created!')
      setShowCreateWH(false)
      setWhForm({ name: '', location: '', capacity: '' })
      await loadWarehouses()
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleCreateLocation(e) {
    e.preventDefault()
    if (!selectedWH) return
    try {
      setError('')
      await inventoryService.createLocation(selectedWH.id, {
        rack_code: locForm.rack_code,
        location_type: locForm.location_type,
        capacity: locForm.capacity ? Number(locForm.capacity) : undefined,
      })
      setSuccess('Location created!')
      setShowCreateLoc(false)
      setLocForm({ rack_code: '', location_type: 'Rack', capacity: '' })
      await loadLocations(Number(selectedWH.id))
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  // ---------- Account handlers ----------
  async function handleUpdateProfile(e) {
    e.preventDefault()
    try {
      setError('')
      const res = await authService.updateProfile(profile)
      setSuccess('Profile updated')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setError('')
    if (pwForm.newPassword !== pwForm.confirmPassword) return setError('Passwords do not match')
    try {
      await authService.changePassword(pwForm.oldPassword, pwForm.newPassword)
      setSuccess('Password changed successfully')
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleStart2FA() {
    try {
      setError('')
      const res = await authService.setup2FA()
      setTwoFASetup(res)
      setTwoFAVerifyCode('')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleVerify2FA(e) {
    e.preventDefault()
    if (!twoFASetup?.secret || !twoFAVerifyCode) return setError('Please enter the verification code')
    try {
      setError('')
      await authService.verify2FA(twoFASetup.secret, twoFAVerifyCode)
      setSuccess('2FA enabled successfully!')
      setTwoFAEnabled(true)
      setTwoFASetup(null)
      setTwoFAVerifyCode('')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleCancel2FA() {
    setTwoFASetup(null)
    setTwoFAVerifyCode('')
    setError('')
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" /> Settings
        </h1>
        <p className="text-sm text-slate-500">Manage warehouses, locations, and system configuration.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <div className="flex items-center justify-between">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'warehouses' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('warehouses')}
          >
            <Building2 className="h-4 w-4 inline mr-2" /> Warehouses
          </button>
          <button
            className={`tab ${activeTab === 'account' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User className="h-4 w-4 inline mr-2" /> Account
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCreateWH(true)} className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-brand-700 transition">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>

      {activeTab === 'warehouses' && (
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Warehouses Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><Building2 className="h-5 w-5 text-brand-600" /> Warehouses</h2>
            <button onClick={() => setShowCreateWH(true)} className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-brand-700 transition">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          {showCreateWH && (
            <form onSubmit={handleCreateWarehouse} className="space-y-3 border-t border-slate-200 pt-3">
              <input value={whForm.name} onChange={e => setWhForm(p => ({...p, name: e.target.value}))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Warehouse name *" required />
              <input value={whForm.location} onChange={e => setWhForm(p => ({...p, location: e.target.value}))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Address / Location" />
              <input type="number" value={whForm.capacity} onChange={e => setWhForm(p => ({...p, capacity: e.target.value}))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Capacity (units)" />
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-medium text-white">Create</button>
                <button type="button" onClick={() => setShowCreateWH(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {warehouses.map(wh => (
              <button
                key={wh.id}
                onClick={() => { setSelectedWH(wh); loadLocations(Number(wh.id)); setShowCreateLoc(false) }}
                className={`w-full text-left rounded-xl p-3 border transition ${selectedWH?.id === wh.id ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <p className="font-medium text-slate-900">{wh.name}</p>
                <p className="text-xs text-slate-500">{wh.location || 'No address'} {wh.capacity ? `• Capacity: ${wh.capacity}` : ''}</p>
              </button>
            ))}
            {warehouses.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No warehouses configured.</p>}
          </div>
          </div>

          {/* Locations Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-600" />
              {selectedWH ? `${selectedWH.name} — Locations` : 'Locations'}
            </h2>
            {selectedWH && (
              <button onClick={() => setShowCreateLoc(true)} className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-brand-700 transition">
                <Plus className="h-3.5 w-3.5" /> Add Rack
              </button>
            )}
          </div>

          {!selectedWH ? (
            <p className="text-sm text-slate-400 text-center py-8">Select a warehouse to view its locations.</p>
          ) : (
            <>
              {showCreateLoc && (
                <form onSubmit={handleCreateLocation} className="space-y-3 border-t border-slate-200 pt-3">
                  <input value={locForm.rack_code} onChange={e => setLocForm(p => ({...p, rack_code: e.target.value}))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Rack code * (e.g. A-01)" required />
                  <select value={locForm.location_type} onChange={e => setLocForm(p => ({...p, location_type: e.target.value}))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option>Rack</option><option>Bin</option><option>Floor</option><option>Cold Storage</option>
                  </select>
                  <input type="number" value={locForm.capacity} onChange={e => setLocForm(p => ({...p, capacity: e.target.value}))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Capacity" />
                  <div className="flex gap-2">
                    <button type="submit" className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-medium text-white">Create Location</button>
                    <button type="button" onClick={() => setShowCreateLoc(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {locations.map(loc => (
                  <div key={loc.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition">
                    <div>
                      <p className="font-medium text-slate-900">{loc.rack_code}</p>
                      <p className="text-xs text-slate-500">{loc.location_type} {loc.capacity ? `• Capacity: ${loc.capacity}` : ''}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${loc.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {loc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
                {locations.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No locations / racks in this warehouse.</p>}
              </div>
            </>
          )}
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="card p-6 rounded-2xl border border-slate-200 bg-white">
            <h3 className="text-lg font-medium mb-4">Profile</h3>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <input className="input" value={profile.first_name} onChange={e => setProfile({ ...profile, first_name: e.target.value })} />
              </div>
              <div>
                <label className="label">Last name</label>
                <input className="input" value={profile.last_name} onChange={e => setProfile({ ...profile, last_name: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="label">Email</label>
                <input className="input" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div className="col-span-2 flex justify-end">
                <button type="submit" className="btn btn-primary">Save profile</button>
              </div>
            </form>
          </div>

          <div className="card p-6 rounded-2xl border border-slate-200 bg-white">
            <h3 className="text-lg font-medium mb-4">Change password</h3>
            <form onSubmit={handleChangePassword} className="grid grid-cols-1 gap-3 max-w-md">
              <input type="password" placeholder="Current password" className="input" value={pwForm.oldPassword} onChange={e => setPwForm({ ...pwForm, oldPassword: e.target.value })} />
              <input type="password" placeholder="New password" className="input" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
              <input type="password" placeholder="Confirm new password" className="input" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary inline-flex items-center gap-2"><Key className="h-4 w-4"/> Change password</button>
              </div>
            </form>
          </div>

          <div className="card p-6 rounded-2xl border border-slate-200 bg-white">
            <h3 className="text-lg font-medium mb-4">Two-factor authentication (2FA)</h3>
            <p className="text-sm text-slate-500 mb-4">Enable 2FA to add an extra layer of security to your account. Use an authenticator app.</p>
            {twoFAEnabled ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-900">✓ Two-factor authentication is enabled</p>
              </div>
            ) : twoFASetup ? (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm font-medium mb-3">1. Scan this QR code with your authenticator app:</p>
                  {twoFASetup.qr_code ? (
                    <img src={twoFASetup.qr_code} alt="2FA QR Code" className="h-48 w-48 mx-auto border border-slate-300 rounded-lg" />
                  ) : (
                    <div className="h-48 w-48 mx-auto bg-slate-100 rounded-lg flex items-center justify-center">
                      <p className="text-xs text-slate-500">QR code not available</p>
                    </div>
                  )}
                  {twoFASetup.secret && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-600 mb-1">Or enter manually:</p>
                      <code className="block bg-white p-2 rounded border border-slate-200 text-xs font-mono">{twoFASetup.secret}</code>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">2. Enter the 6-digit code from your app:</p>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="000000"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-center font-mono text-lg tracking-widest"
                    value={twoFAVerifyCode}
                    onChange={e => setTwoFAVerifyCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={handleCancel2FA} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                    Verify & Enable
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleStart2FA} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 inline-flex items-center gap-2">
                  Start 2FA setup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
