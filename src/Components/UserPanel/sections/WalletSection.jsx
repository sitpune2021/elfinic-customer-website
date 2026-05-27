import React from "react";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaHistory,
  FaMoneyBillWave,
  FaShoppingCart,
  FaGift,
  FaMobileAlt,
} from "react-icons/fa";

function WalletSection() {
  const walletBalance = 2850.5;

  const transactions = [
    {
      id: 1,
      type: "credit",
      description: "Payment Received",
      amount: 2500,
      date: "2 hours ago",
      icon: FaMoneyBillWave,
      iconColor: "#4caf50",
      iconBg: "rgba(76, 175, 80, 0.1)",
    },
    {
      id: 2,
      type: "debit",
      description: "Purchase - Electronics",
      amount: 899,
      date: "1 day ago",
      icon: FaShoppingCart,
      iconColor: "#f44336",
      iconBg: "rgba(244, 67, 54, 0.1)",
    },
    {
      id: 3,
      type: "credit",
      description: "Cashback Reward",
      amount: 150,
      date: "3 days ago",
      icon: FaGift,
      iconColor: "#d8963c",
      iconBg: "rgba(216, 150, 60, 0.1)",
    },
    {
      id: 4,
      type: "debit",
      description: "Subscription Payment",
      amount: 299,
      date: "1 week ago",
      icon: FaMobileAlt,
      iconColor: "#2196f3",
      iconBg: "rgba(33, 150, 243, 0.1)",
    },
  ];

  return (
    <section className="content-section active">
      {/* Header */}
      <div className="wallet-header">
        <h1 className="header-name">My Wallet</h1>
        <p className="dashboard-subtitle">
          Manage your balance and transactions
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className="wallet-balance-card">
        <div className="balance-icon">
          <FaWallet size={32} />
        </div>
        <div className="balance-info">
          <p className="balance-label">Available Balance</p>
          <h2 className="balance-amount">₹{walletBalance.toFixed(2)}</h2>
        </div>
        <div className="balance-actions">
          <button className="wallet-action-btn primary">
            <FaPlus size={14} />
            Add Money
          </button>
          <button className="wallet-action-btn secondary">
            <FaHistory size={14} />
            History
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="wallet-transactions">
        <h3 className="section-title-qw">Recent Transactions</h3>
        <div className="transactions-list">
          {transactions.map((transaction) => {
            const IconComponent = transaction.icon;
            return (
              <div key={transaction.id} className="transaction-card">
                <div
                  className="transaction-icon-wrapper"
                  style={{
                    backgroundColor: transaction.iconBg,
                  }}
                >
                  <IconComponent
                    size={24}
                    style={{ color: transaction.iconColor }}
                  />
                </div>
                <div className="transaction-info">
                  <h4 className="transaction-title">
                    {transaction.description}
                  </h4>
                  <span className="transaction-date">{transaction.date}</span>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === "credit" ? (
                    <FaArrowDown className="amount-icon" size={12} />
                  ) : (
                    <FaArrowUp className="amount-icon" size={12} />
                  )}
                  <span className="amount-value">
                    {transaction.type === "credit" ? "+" : "-"}₹
                    {transaction.amount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WalletSection;
