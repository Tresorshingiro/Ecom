import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  if (!user) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

export default ProtectedRoute 