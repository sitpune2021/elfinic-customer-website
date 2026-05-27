import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'

function ProtectedRoute({ children }) {
    const { IsLogin } = useApi()
    const navigate = useNavigate()

    useEffect(() => {
        if (!IsLogin()) {
            navigate('/login')
        }
    }, [IsLogin, navigate])

    if (!IsLogin()) {
        return null
    }

    return children
}

export default ProtectedRoute