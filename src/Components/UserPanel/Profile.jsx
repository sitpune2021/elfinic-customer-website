import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import SideBar from './SideBar'
import ProfileSection from './sections/ProfileSection'
import WalletSection from './sections/WalletSection'
import OrdersSection from './sections/OrdersSection'
import AddressesSection from './sections/AddressesSection'
import WishlistSection from './sections/WishlistSection'
import RewardsSection from './sections/RewardsSection'
import AccountSection from './sections/AccountSection'
import SettingsSection from './sections/SettingsSection'
import NotificationsSection from './sections/NotificationsSection'
import './UserPanel.css'

function Profile() {
    const [activeSection, setActiveSection] = useState('profile')
    const [userInfo, setUserInfo] = useState({
        name: 'Mr.India',
        email: 'India@gmail.com',
        joinDate: 'Sep 19, 2025',
        profilePic: null
    })

    const { IsLogin } = useApi()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!IsLogin()) {
            navigate('/login')
            return
        }

        // Load user info from localStorage or API
        const savedUserInfo = localStorage.getItem('userInfo')
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo))
        }

        // Handle URL parameters for section navigation
        const urlParams = new URLSearchParams(location.search)
        const sectionParam = urlParams.get('section')
        if (sectionParam) {
            setActiveSection(sectionParam)
        }
    }, [IsLogin, navigate, location.search])

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSection userInfo={userInfo} setUserInfo={setUserInfo} />
            case 'wallet':
                return <WalletSection />
            case 'orders':
                return <OrdersSection />
            case 'addresses':
                return <AddressesSection />
            case 'wishlist':
                return <WishlistSection />
            case 'rewards':
                return <RewardsSection />
            case 'account':
                return <AccountSection userInfo={userInfo} setUserInfo={setUserInfo} />
            case 'settings':
                return <SettingsSection />
            case 'notifications':
                return <NotificationsSection />
            default:
                return <AccountSection userInfo={userInfo} setUserInfo={setUserInfo} />
        }
    }

    if (!IsLogin()) {
        return null // Will redirect to login
    }

    return (
        <div className="user-panel-container py-20">
            <div className="profile-container">
                <SideBar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    userInfo={userInfo}
                />
                <main className="main-content">
                    {renderActiveSection()}
                </main>
            </div>
        </div>
    )
}

export default Profile