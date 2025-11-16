import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const USE_BACKEND = true // Set to true to use real backend, false for demo mode

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      if (USE_BACKEND) {
        // Real backend signup
        await axios.post('http://localhost:5001/api/auth/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        // Demo mode - simulate signup
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Store in localStorage for demo purposes
        const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]')
        
        // Check if user already exists
        if (demoUsers.some(u => u.email === formData.email)) {
          throw new Error('User with this email already exists')
        }
        
        demoUsers.push({
          id: 'user' + Date.now(),
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        
        localStorage.setItem('demoUsers', JSON.stringify(demoUsers))
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-black rounded-lg p-8 bg-white">
          <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>
          
          {/* Mode Indicator */}
          <div className="mb-6 p-4 border-2 border-black bg-gray-light rounded-lg">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {USE_BACKEND ? '🔌 Backend Mode' : '🎯 Demo Mode'}
              </p>
              <span className={`text-xs px-2 py-1 rounded ${USE_BACKEND ? 'bg-green-200' : 'bg-blue-200'}`}>
                {USE_BACKEND ? 'Live' : 'Offline'}
              </span>
            </div>
            {!USE_BACKEND && (
              <p className="text-xs mt-2">Create an account to test the app (stored locally)</p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 border-2 border-red-500 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 border-2 border-green-500 bg-green-50 text-green-700 rounded">
              ✓ Account created successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-white border-2 border-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : success ? 'Success!' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold underline hover:no-underline">
              Login
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-xs text-center text-gray-600">
              🔒 Protected: Dashboard requires authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
