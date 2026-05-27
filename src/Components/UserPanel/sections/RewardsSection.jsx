import React from 'react'

function RewardsSection() {
    const rewardHistory = [
        {
            id: 1,
            description: 'Purchase Cashback',
            points: '+250',
            date: '2 days ago'
        },
        {
            id: 2,
            description: 'Review Bonus',
            points: '+50',
            date: '1 week ago'
        },
        {
            id: 3,
            description: 'Referral Reward',
            points: '+500',
            date: '2 weeks ago'
        },
        {
            id: 4,
            description: 'Welcome Bonus',
            points: '+100',
            date: '1 month ago'
        }
    ]

    return (
        <section className="content-section active">
            <h1>My Rewards</h1>
            <div className="rewards-card">
                <p>Available Points</p>
                <h2>1,250</h2>
                <div className="rewards-actions">
                    <button className="btn btn-primary">Redeem Points</button>
                    <button className="btn btn-secondary">Earn More</button>
                </div>
            </div>
            <div className="rewards-history">
                <h3>Points History</h3>
                {rewardHistory.map(reward => (
                    <div key={reward.id} className="rewards-item">
                        <div className="rewards-icon">🏆</div>
                        <div className="rewards-details">
                            <strong>{reward.description}</strong>
                            <span>{reward.date}</span>
                        </div>
                        <div className="rewards-points">{reward.points}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default RewardsSection