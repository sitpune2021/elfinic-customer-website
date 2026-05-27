import React from 'react'

function NotificationsSection() {
    const notifications = [
        {
            id: 1,
            icon: '📦',
            title: 'Order Shipped',
            message: 'Your order #ORD-001 has been shipped and is on the way',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            icon: '💰',
            title: 'Payment Successful',
            message: 'Payment of ₹2,499 has been processed successfully',
            time: '1 day ago',
            read: true
        },
        {
            id: 3,
            icon: '🎉',
            title: 'Welcome Bonus',
            message: 'You have received 100 reward points as welcome bonus',
            time: '3 days ago',
            read: true
        },
        {
            id: 4,
            icon: '🔔',
            title: 'New Feature Alert',
            message: 'Check out our new wishlist feature to save your favorite items',
            time: '1 week ago',
            read: false
        },
        {
            id: 5,
            icon: '⭐',
            title: 'Review Request',
            message: 'Please rate your recent purchase of Wireless Headphones',
            time: '2 weeks ago',
            read: true
        }
    ]

    const markAsRead = (id) => {
        // Here you would update the notification status
        console.log(`Marking notification ${id} as read`)
    }

    const deleteNotification = (id) => {
        // Here you would delete the notification
        console.log(`Deleting notification ${id}`)
    }

    return (
        <section className="content-section active">
            <h1>Notifications</h1>
            <div className="notifications-list">
                {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                        <div className="notification-icon">{notification.icon}</div>
                        <div className="notification-content">
                            <strong>{notification.title}</strong>
                            <p>{notification.message}</p>
                            <div className="notification-time">{notification.time}</div>
                        </div>
                        <div className="notification-actions">
                            {!notification.read && (
                                <button
                                    className="notification-btn"
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    Mark as Read
                                </button>
                            )}
                            <button
                                className="notification-btn"
                                onClick={() => deleteNotification(notification.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default NotificationsSection