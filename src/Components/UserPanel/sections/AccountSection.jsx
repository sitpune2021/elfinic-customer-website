import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../UserPanel.css";
import {
  FaUser,
  FaPhone,
  FaCamera,
  FaSave,
  FaTimes,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrashAlt,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useConfirm } from "../../../contexts/ConfirmContext";
import { fetchUserProfile, updateUserProfile } from "../../../store/slices/userProfileSlice";

function AccountSection({ userInfo, setUserInfo }) {
  const { profile, loading, updateLoading } = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    photo: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        mobile: profile.mobile || "",
        photo: profile.photo || null,
      }));
      setProfileImagePreview(profile.photo || null);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
    setSuccessMessage("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setPhotoFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    try {
      const resultAction = await dispatch(
        updateUserProfile({
          userId: user.id,
          name: formData.name,
          mobile: formData.mobile,
          photo: photoFile,
        })
      );

      if (updateUserProfile.fulfilled.match(resultAction)) {
        toast.success("Profile updated successfully!");
        setIsEditingProfile(false);
        setPhotoFile(null);
      } else {
        toast.error(resultAction.payload || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setPasswordError("All password fields are required");
      return;
    }
    if (formData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setPasswordError("User not authenticated. Please log in.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile/updatePassword`, {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword,

      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      toast.success(response.data.message || "Password changed successfully!");

    }
    catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
      return;
    }
    finally {
      setIsLoading(false);
    }

    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setIsChangingPassword(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const cancelEdit = () => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        mobile: profile.mobile || "",
        photo: profile.photo || null,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setProfileImagePreview(profile.photo || null);
    }
    setPhotoFile(null);
    setIsEditingProfile(false);
    setIsChangingPassword(false);
    setPasswordError("");
    setSuccessMessage("");
  };

  const profileFields = [
    {
      name: "name",
      label: "Full Name",
      icon: FaUser,
      type: "text",
      required: true,
    },
    {
      name: "mobile",
      label: "Mobile Number",
      icon: FaPhone,
      type: "tel",
      required: true,
    },
  ];
  const { confirmAction } = useConfirm();

  const showconfirmdelete = () => {
    confirmAction({
      header: "Delete Account",
      message: "Are you sure you want to permanently delete your account? This action cannot be undone.",
      icon: "pi pi-trash",
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      accept: DeleteAccount,
      reject: () => {
        console.log("Delete cancelled");
      },
    });
  };
  const DeleteAccount = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("User not authenticated. Please log in.");
      return;
    }
    console.log("Deleting account for user ID:", JSON.parse(user).id);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/user/delete-account`,
        {
          data: {
            user_id: JSON.parse(user).id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message || "Account deleted successfully!");
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete account"
      );
      return;
    }
  };
  return (
    <section className="content-section active account-section-modern">
      {/* Header */}
      <div className="account-modern-header">
        <div>
          <h1 className="header-name">My Account</h1>
          <p className="dashboard-subtitle">
            Manage your personal information and security
          </p>
        </div>
        {!isEditingProfile && !isChangingPassword && (
          <button
            className="edit-profile-btn"
            onClick={() => setIsEditingProfile(true)}
          >
            <FaUser size={14} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert-message success">
          <FaCheckCircle />
          {successMessage}
        </div>
      )}
      {passwordError && (
        <div className="alert-message error">
          <FaExclamationTriangle />
          {passwordError}
        </div>
      )}

      {/* Profile Card */}
      <div className="account-profile-card">
        {/* Profile Image */}
        <div className="profile-image-section-modern">
          <div className="profile-avatar-large">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                <FaUser size={50} />
              </div>
            )}
            {isEditingProfile && (
              <div className="avatar-overlay" onClick={triggerFileInput}>
                <FaCamera size={24} />
                <span>Change Photo</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className="profile-info-text">
            <h3>{profile?.name || formData.name || "Your Name"}</h3>
            <p>{profile?.email || "your.email@example.com"}</p>
          </div>
        </div>
        {/* Profile Form */}
        <form className="account-form-modern" onSubmit={handleProfileSubmit}>
          <div className="form-grid">
            {profileFields.map((field) => {
              const IconComponent = field.icon;
              return (
                <div key={field.name} className="form-field">
                  <label>
                    <IconComponent className="field-icon" />
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    disabled={!isEditingProfile}
                    required={field.required}
                    placeholder={field.label}
                  />
                </div>
              );
            })}
          </div>

          {isEditingProfile && (
            <div className="form-actions-modern">
              <button type="submit" className="btn-primary-modern" disabled={updateLoading}>
                <FaSave />
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn-secondary-modern"
                onClick={cancelEdit}
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Password Section */}
      <div className="password-card-modern">
        <div className="password-header">
          <div>
            <h3>
              <FaLock className="section-icon" />
              Security & Password
            </h3>
            <p>Keep your account secure with a strong password</p>
          </div>
          {!isChangingPassword && !isEditingProfile && (
            <button
              className="change-password-btn-modern"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form
            className="password-form-modern"
            onSubmit={handlePasswordSubmit}
          >
            <div className="form-field">
              <label>
                <FaLock className="field-icon" />
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
              />
            </div>
            <div className="form-field">
              <label>
                <FaLock className="field-icon" />
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password (min 8 characters)"
              />
            </div>
            <div className="form-field">
              <label>
                <FaLock className="field-icon" />
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
              />
            </div>
            <div className="form-actions-modern">
              <button type="submit" className="btn-primary-modern">
                <FaLock />
                {isLoading ? <span>Updating...</span> : "Update Password"}
              </button>
              <button
                type="button"
                className="btn-secondary-modern"
                onClick={cancelEdit}
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="password-info-modern">
            <p>Last changed: Never or Not tracked</p>
            <p className="security-tip">
              💡 Use a strong password with at least 8 characters
            </p>
          </div>
        )}
      </div>

      {/* account delete */}
      <div>
        <button onClick={showconfirmdelete} className="delete-account-btn-modern">
          <FaTrashAlt size={14} />
          Delete My Account
        </button>
      </div>
    </section>
  );
}

export default AccountSection;
