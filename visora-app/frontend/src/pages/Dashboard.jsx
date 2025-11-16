import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AccessibilityFeatures from '../components/AccessibilityFeatures'

const USE_BACKEND = true // Set to true to use backend API, false for localStorage
const API_URL = 'http://localhost:5001/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    // Accessibility Features
    voiceControl: false,
    hideImages: false,
    highContrast: false,
    dyslexiaFont: false,
    highlightLinks: false,
    disableAnimations: false,
    focusLine: false,
    letterSpacing: 0,
    dimmerOverlay: false,
    cursorSize: 1,
    fontSize: 100,
    lineHeight: 1.5,
    contentWidth: 1000,
    blockPopups: false,
    readingMode: false,
    disableStickyElements: false,
    disableHoverEffects: false,
    textToSpeech: {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voice: 0
    }
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchReviews(parsedUser.id)
    loadPreferences(parsedUser.id)
  }, [navigate])

  const loadPreferences = async (userId) => {
    if (USE_BACKEND) {
      try {
        const response = await axios.get(`${API_URL}/users/preferences/${userId}`)
        setPreferences(response.data.preferences)
      } catch (err) {
        console.error('Failed to load preferences:', err)
      }
    } else {
      const savedPrefs = localStorage.getItem('preferences_' + userId)
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs))
      }
    }
  }

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  const handleSavePreferences = async () => {
    setLoading(true)
    try {
      if (USE_BACKEND) {
        await axios.put(`${API_URL}/users/preferences/${user.id}`, { preferences })
      } else {
        localStorage.setItem('preferences_' + user.id, JSON.stringify(preferences))
      }
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save preferences:', err)
      alert('Failed to save preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewPreferences = () => {
    setPreferences({
      voiceControl: false,
      hideImages: false,
      highContrast: false,
      dyslexiaFont: false,
      highlightLinks: false,
      disableAnimations: false,
      focusLine: false,
      letterSpacing: 0,
      dimmerOverlay: false,
      cursorSize: 1,
      fontSize: 100,
      lineHeight: 1.5,
      contentWidth: 1000,
      blockPopups: false,
      readingMode: false,
      disableStickyElements: false,
      disableHoverEffects: false,
      textToSpeech: {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        voice: 0
      }
    })
    setIsEditing(true)
  }

  const handleDeletePreferences = async () => {
    if (window.confirm('Are you sure you want to delete your preferences?')) {
      setLoading(true)
      try {
        if (USE_BACKEND) {
          await axios.delete(`${API_URL}/users/preferences/${user.id}`)
        } else {
          localStorage.removeItem('preferences_' + user.id)
        }
        setPreferences({
          voiceControl: false,
          hideImages: false,
          highContrast: false,
          dyslexiaFont: false,
          highlightLinks: false,
          disableAnimations: false,
          focusLine: false,
          letterSpacing: 0,
          dimmerOverlay: false,
          cursorSize: 1,
          fontSize: 100,
          lineHeight: 1.5,
          contentWidth: 1000,
          blockPopups: false,
          readingMode: false,
          disableStickyElements: false,
          disableHoverEffects: false,
          textToSpeech: {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            voice: 0
          }
        })
        setIsEditing(false)
      } catch (err) {
        console.error('Failed to delete preferences:', err)
        alert('Failed to delete preferences. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const fetchReviews = async (userId) => {
    if (USE_BACKEND) {
      try {
        const response = await axios.get(`${API_URL}/reviews/${userId}`)
        setReviews(response.data)
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
        setReviews([])
      }
    } else {
      // DUMMY REVIEWS - Load from localStorage
      const savedReviews = localStorage.getItem('reviews_' + userId)
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews))
      } else {
        // Sample reviews
        const sampleReviews = [
          { _id: '1', text: 'This is a sample review. Great app!', date: new Date().toISOString() },
          { _id: '2', text: 'Very helpful for accessibility needs.', date: new Date().toISOString() }
        ]
        setReviews(sampleReviews)
        localStorage.setItem('reviews_' + userId, JSON.stringify(sampleReviews))
      }
    }
  }

  const handleAddReview = async (e) => {
    e.preventDefault()
    if (!reviewText.trim()) return

    if (reviewText.trim().length < 10) {
      alert('Review must be at least 10 characters long')
      return
    }

    setLoading(true)
    try {
      if (USE_BACKEND) {
        await axios.post(`${API_URL}/reviews/add`, {
          userId: user.id,
          reviewText: reviewText.trim(),
          rating: 5
        })
        setReviewText('')
        await fetchReviews(user.id)
      } else {
        // DUMMY ADD REVIEW - Save to localStorage
        const newReview = {
          _id: Date.now().toString(),
          text: reviewText,
          date: new Date().toISOString()
        }
        const updatedReviews = [newReview, ...reviews]
        setReviews(updatedReviews)
        localStorage.setItem('reviews_' + user.id, JSON.stringify(updatedReviews))
        setReviewText('')
      }
    } catch (err) {
      console.error('Failed to add review:', err)
      alert('Failed to add review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* Main Content - Left */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Greeting & Mode Indicator */}
          <div className="flex items-start justify-between mb-12 flex-wrap gap-4">
            <h1 className="text-5xl font-bold md:text-[7rem]">Hello, {user.name}.</h1>
            <div className={`px-4 py-2 rounded-lg border-2 ${USE_BACKEND ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
              <span className="text-sm font-semibold">
                {USE_BACKEND ? '🔌 Backend Mode' : '💾 Local Mode'}
              </span>
            </div>
          </div>

          {/* User Preferences */}
          <div className="mb-12">
            <div className="border-2 border-black rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Preferences</h2>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSavePreferences}
                        disabled={loading}
                        className="px-6 py-2 bg-black text-white border-2 border-black rounded-lg hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false)
                          loadPreferences(user.id)
                        }}
                        className="px-6 py-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={handleNewPreferences}
                        className="px-6 py-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                      >
                        New
                      </button>
                      <button 
                        onClick={handleDeletePreferences}
                        className="px-6 py-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Accessibility Features Section */}
              <AccessibilityFeatures 
                preferences={preferences}
                setPreferences={setPreferences}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Add Review Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Add Your Review</h2>
            <form onSubmit={handleAddReview} className="space-y-4">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                rows="4"
                placeholder="Write your review here..."
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          {reviews.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Your Reviews</h3>
              {reviews.map((review) => (
                <div key={review._id} className="border-2 border-black rounded-lg p-4">
                  <p className="mb-2">{review.text}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(review.createdAt || review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button className="mt-8 px-8 py-3 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors">
            + Add Review
          </button>
        </div>

        {/* Right Sidebar - Floating Profile */}
        <div className="fixed top-8 right-8 group">
          <div className="w-20 h-20 group-hover:w-80 group-hover:h-auto p-6 flex flex-col items-center transition-all duration-300 bg-white rounded-full group-hover:rounded-2xl border-2 border-black shadow-lg overflow-hidden">
            {/* Profile Icon */}
            <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-light flex items-center justify-center flex-shrink-0 group-hover:w-20 group-hover:h-20 group-hover:mb-6 transition-all duration-300">
              <span className="text-lg group-hover:text-3xl font-bold transition-all duration-300">{user.name.charAt(0).toUpperCase()}</span>
            </div>

            {/* Details - Show on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full space-y-4 max-h-0 group-hover:max-h-96 overflow-hidden">
              <p className="text-xl font-semibold text-center whitespace-nowrap">{user.name}</p>
              <p className="text-sm text-center mb-4 whitespace-nowrap text-gray-600">{user.email}</p>

              <button
                onClick={() => window.location.href = '/landing'}
                className="w-full px-6 py-3 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors whitespace-nowrap"
              >
                Return to Landing
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
