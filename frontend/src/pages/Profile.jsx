import React, { useContext } from 'react'
import { AuthContext } from '../context/authContext'

const Profile = () => {
    const { user } = useContext(AuthContext)

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                    <label className="text-sm text-gray-600">Username</label>
                    <p className="text-lg font-medium">{user.username}</p>
                </div>
                <div className="mb-4">
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-lg font-medium">{user.email}</p>
                </div>
                {/* Add more user details as needed */}
            </div>
        </div>
    )
}

export default Profile 