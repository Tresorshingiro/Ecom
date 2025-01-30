import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext)

    if (!user) {
        // Redirect to login if there's no user
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute 