import React, { useState } from "react";
import {
  FaBell,
  FaEnvelope,
  FaMoon,
  FaShieldAlt,
  FaLock,
  FaSms,
  FaDatabase,
  FaSignInAlt,
} from "react-icons/fa";

function SettingsSection() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    smsAlerts: true,
    darkMode: false,
    twoFactorAuth: false,
    loginAlerts: true,
    dataSharing: false,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const settingsGroups = [
    {
      title: "Notifications",
      icon: FaBell,
      color: "#d8963c",
      items: [
        {
          key: "notifications",
          label: "Push Notifications",
          description: "Receive order updates",
          icon: FaBell,
        },
        {
          key: "emailUpdates",
          label: "Email Updates",
          description: "Promotional emails",
          icon: FaEnvelope,
        },
        {
          key: "smsAlerts",
          label: "SMS Alerts",
          description: "Important updates via SMS",
          icon: FaSms,
        },
      ],
    },
    {
      title: "Security",
      icon: FaShieldAlt,
      color: "#050040",
      items: [
        {
          key: "twoFactorAuth",
          label: "Two-Factor Auth",
          description: "Extra security layer",
          icon: FaLock,
        },
        {
          key: "loginAlerts",
          label: "Login Alerts",
          description: "New login notifications",
          icon: FaSignInAlt,
        },
      ],
    },
    {
      title: "Privacy",
      icon: FaDatabase,
      color: "#4caf50",
      items: [
        {
          key: "dataSharing",
          label: "Data Sharing",
          description: "Analytics data sharing",
          icon: FaDatabase,
        }
      ],
    },
  ];

  return (
    <section className="content-section active">
      <div className="settings-header">
        <h1 className="header-name">Settings</h1>
        <p className="dashboard-subtitle">
          Manage your preferences and account settings
        </p>
      </div>

      <div className="settings-grid">
        {settingsGroups.map((group, groupIndex) => {
          const GroupIcon = group.icon;
          return (
            <div key={groupIndex} className="settings-group-card">
              <div className="settings-group-header">
                <div
                  className="group-icon"
                  style={{
                    backgroundColor: `${group.color}15`,
                    color: group.color,
                  }}
                >
                  <GroupIcon size={20} />
                </div>
                <h3 className="group-title">{group.title}</h3>
              </div>
              <div className="settings-items">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.key} className="setting-item">
                      <div className="setting-info">
                        <div className="setting-icon">
                          <ItemIcon size={16} />
                        </div>
                        <div className="setting-text">
                          <span className="setting-label">{item.label}</span>
                          <span className="setting-description">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={() => handleToggle(item.key)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsSection;
