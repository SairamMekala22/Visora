import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const USE_BACKEND = true // Set to true to use real backend, false for demo mode

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (USE_BACKEND) {
        // Real backend authentication
        const response = await axios.post('http://localhost:5001/api/auth/login', formData)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
        navigate('/dashboard')
      } else {
        // Demo mode - works without backend
        const defaultUsers = [
          { email: 'demo@visora.com', password: 'demo123', name: 'Demo User', id: 'user123' },
          { email: 'test@visora.com', password: 'test123', name: 'Test User', id: 'user456' },
          { email: 'admin@visora.com', password: 'admin123', name: 'Admin User', id: 'user789' }
        ]
        
        // Get dynamically created users from signup
        const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]')
        const allUsers = [...defaultUsers, ...demoUsers]

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const user = allUsers.find(u => u.email === formData.email && u.password === formData.password)

        if (user) {
          const mockUser = {
            id: user.id,
            name: user.name,
            email: user.email
          }
          localStorage.setItem('user', JSON.stringify(mockUser))
          localStorage.setItem('token', 'fake-jwt-token-' + Date.now())
          navigate('/dashboard')
        } else {
          throw new Error('Invalid credentials. Try: demo@visora.com / demo123')
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-black rounded-lg p-8 bg-white">
          <h1 className="text-3xl font-bold text-center mb-8">Login to Visora</h1>
          
          {/* Mode Indicator & Demo Credentials */}
          <div className="mb-6 p-4 border-2 border-black bg-gray-light rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">
                {USE_BACKEND ? '🔌 Backend Mode' : '🎯 Demo Mode'}
              </p>
              <span className={`text-xs px-2 py-1 rounded ${USE_BACKEND ? 'bg-green-200' : 'bg-blue-200'}`}>
                {USE_BACKEND ? 'Live' : 'Offline'}
              </span>
            </div>
            {!USE_BACKEND && (
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> demo@visora.com</p>
                <p><strong>Password:</strong> demo123</p>
                <hr className="my-2 border-black" />
                <p className="text-xs">Other test accounts: test@visora.com / test123</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 border border-black bg-gray-light text-black rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white border-2 border-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold underline hover:no-underline">
              Sign up
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
