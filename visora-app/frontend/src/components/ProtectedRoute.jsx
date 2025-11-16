import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user')
  const token = localStorage.getItem('token')

  // Check if user is authenticated
  if (!user || !token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  // Render the protected component if authenticated
  return children
}

export default ProtectedRoute
