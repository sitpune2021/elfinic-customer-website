import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../store/hooks/index.js';
import { addAddress, deleteAddress, fetchAddresses, selectActionLoading, selectAddress, selectAddresses, selectAddressLoading, selectSelectedAddress, selectSelectedAddressId, updateAddress } from '../../../store/slices/addressSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useConfirm } from '../../../contexts/ConfirmContext.jsx';
import {
    FaMapMarkerAlt,
    FaPlus,
    FaHome,
    FaBriefcase,
    FaMapPin,
    FaPhone,
    FaCheck,
    FaTimes,
    FaPencilAlt,
    FaTrashAlt,
    FaChevronDown,
    FaChevronUp,
    FaCheckCircle,
    FaShieldAlt,
} from 'react-icons/fa';
import './AddressesSection.css';


function AddressesSection() {
    // confirm dialog
    const { confirmAction } = useConfirm();


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);


    const addresses = useSelector(selectAddresses);
    const selectedAddressId = useSelector(selectSelectedAddressId);
    const selectedAddress = useSelector(selectSelectedAddress);
    const addressLoading = useSelector(selectAddressLoading);
    const actionLoading = useSelector(selectActionLoading);


    // Saved addresses state
    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editAddress, setEditAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        is_default: 0
    });

    // Validation errors state
    const [newAddressErrors, setNewAddressErrors] = useState({});
    const [editAddressErrors, setEditAddressErrors] = useState({});

    // Validation functions
    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phone) return 'Phone number is required';
        if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit mobile number';
        return '';
    };

    const validatePinCode = (pinCode) => {
        const pinCodeRegex = /^[1-9][0-9]{5}$/;
        if (!pinCode) return 'Pin code is required';
        if (!pinCodeRegex.test(pinCode)) return 'Please enter a valid 6-digit pin code';
        return '';
    };

    const handleNewAddressChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Clear error for this field when user types
        if (newAddressErrors[name]) {
            setNewAddressErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // For phone and postal_code, only allow numbers
        if (name === 'phone' || name === 'postal_code') {
            const numericValue = value.replace(/\D/g, '');
            setNewAddress(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setNewAddress(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
            }));
        }
    };

    const validateNewAddressField = (name, value) => {
        if (name === 'phone') {
            const error = validatePhone(value);
            setNewAddressErrors(prev => ({ ...prev, phone: error }));
        } else if (name === 'postal_code') {
            const error = validatePinCode(value);
            setNewAddressErrors(prev => ({ ...prev, postal_code: error }));
        }
    };


    const handleAddressSelect = (addressId) => {
        dispatch(selectAddress(addressId));
    };

    const handleAddNewAddress = async (e) => {
        e.preventDefault();

        // Validate all required fields
        const errors = {};

        if (!newAddress.name) errors.name = 'Full name is required';
        if (!newAddress.address_line1) errors.address_line1 = 'Address is required';
        if (!newAddress.city) errors.city = 'City is required';
        if (!newAddress.state) errors.state = 'State is required';

        const phoneError = validatePhone(newAddress.phone);
        if (phoneError) errors.phone = phoneError;

        const pinCodeError = validatePinCode(newAddress.postal_code);
        if (pinCodeError) errors.postal_code = pinCodeError;

        if (Object.keys(errors).length > 0) {
            setNewAddressErrors(errors);
            toast.error('Please fix all validation errors');
            return;
        }

        newAddress.user_id = JSON.parse(localStorage.getItem('user')).id || null;

        try {
            await dispatch(addAddress(newAddress)).unwrap();
            setShowAddressForm(false);

            // Reset form and errors
            setNewAddress({
                type: 'Home',
                name: '',
                phone: '',
                address_line1: '',
                address_line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'India',
                is_default: 0
            });
            setNewAddressErrors({});

            toast.success('Address added successfully!');
        } catch (error) {
            toast.error(error || 'Failed to add address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (addresses.length === 1) {
            toast.error('You must have at least one address');
            return;
        }


        confirmAction({
            message: 'Are you sure you want to Delete this Address?',
            header: 'Remove Item',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, Remove',
            rejectLabel: 'Cancel',
            accept: async () => {
                try {
                    await dispatch(deleteAddress(addressId)).unwrap();
                } catch (error) {
                    console.error('Error removing item:', error);
                    toast.error(error || 'Failed to Delete Address');
                }
            },
            reject: () => {
                // User cancelled, do nothing
            }
        });
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address.id);
        setEditAddress({ ...address });
        setEditAddressErrors({});
    };

    const handleEditAddressChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Clear error for this field when user types
        if (editAddressErrors[name]) {
            setEditAddressErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // For phone and postal_code, only allow numbers
        if (name === 'phone' || name === 'postal_code') {
            const numericValue = value.replace(/\D/g, '');
            setEditAddress(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setEditAddress(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
            }));
        }
    };

    const validateEditAddressField = (name, value) => {
        if (name === 'phone') {
            const error = validatePhone(value);
            setEditAddressErrors(prev => ({ ...prev, phone: error }));
        } else if (name === 'postal_code') {
            const error = validatePinCode(value);
            setEditAddressErrors(prev => ({ ...prev, postal_code: error }));
        }
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();

        // Validate all required fields
        const errors = {};

        if (!editAddress.name) errors.name = 'Full name is required';
        if (!editAddress.address_line1) errors.address_line1 = 'Address is required';
        if (!editAddress.city) errors.city = 'City is required';
        if (!editAddress.state) errors.state = 'State is required';

        const phoneError = validatePhone(editAddress.phone);
        if (phoneError) errors.phone = phoneError;

        const pinCodeError = validatePinCode(editAddress.postal_code);
        if (pinCodeError) errors.postal_code = pinCodeError;

        if (Object.keys(errors).length > 0) {
            setEditAddressErrors(errors);
            toast.error('Please fix all validation errors');
            return;
        }

        try {
            await dispatch(updateAddress(editAddress)).unwrap();
            setEditingAddressId(null);
            setEditAddress(null);
            setEditAddressErrors({});
            toast.success('Address updated successfully!');
        } catch (error) {
            toast.error(error || 'Failed to update address');
        }
    };

    const handleCancelEdit = () => {
        setEditingAddressId(null);
        setEditAddress(null);
    };



    const getTypeIcon = (type) => {
        switch (type) {
            case 'Home': return <FaHome />;
            case 'Office': return <FaBriefcase />;
            default: return <FaMapPin />;
        }
    };

    return (
        <section className="content-section active addr-section">
            {/* Header */}
            <div className="addr-header">
                <div className="addr-header-left">
                    <h2>
                        <FaMapMarkerAlt />
                        My Addresses
                    </h2>
                    <p>Manage your delivery addresses</p>
                </div>
                <button
                    className="addr-add-btn"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                >
                    <FaPlus />
                    Add New Address
                </button>
            </div>

            {/* Add New Address Form */}
            {showAddressForm && (
                <div className="addr-form-card">
                    <div className="addr-form-card-header">
                        <h3><FaPlus /> New Address</h3>
                        <button
                            className="addr-form-close"
                            onClick={() => { setShowAddressForm(false); setNewAddressErrors({}); }}
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <form onSubmit={handleAddNewAddress}>
                        {/* Address Type */}
                        <div className="addr-type-group">
                            <label className="addr-type-label">Address Type</label>
                            <div className="addr-type-options">
                                {['Home', 'Office', 'Other'].map((type) => (
                                    <label key={type} className="addr-type-radio">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type}
                                            checked={newAddress.type === type}
                                            onChange={handleNewAddressChange}
                                        />
                                        <span className="addr-type-radio-label">
                                            {getTypeIcon(type)} {type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="addr-form-grid">
                            <div className="addr-field">
                                <label>Full Name <span className="addr-required">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`addr-input ${newAddressErrors.name ? 'addr-input-error' : ''}`}
                                    placeholder="Enter full name"
                                    value={newAddress.name}
                                    onChange={handleNewAddressChange}
                                    required
                                />
                                {newAddressErrors.name && <span className="addr-error-text">{newAddressErrors.name}</span>}
                            </div>
                            <div className="addr-field">
                                <label>Phone Number <span className="addr-required">*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className={`addr-input ${newAddressErrors.phone ? 'addr-input-error' : ''}`}
                                    placeholder="10-digit mobile number"
                                    value={newAddress.phone}
                                    onChange={handleNewAddressChange}
                                    onBlur={(e) => validateNewAddressField('phone', e.target.value)}
                                    maxLength="10"
                                    required
                                />
                                {newAddressErrors.phone && <span className="addr-error-text">{newAddressErrors.phone}</span>}
                            </div>
                            <div className="addr-field addr-field-full">
                                <label>Address Line 1 <span className="addr-required">*</span></label>
                                <input
                                    type="text"
                                    name="address_line1"
                                    className={`addr-input ${newAddressErrors.address_line1 ? 'addr-input-error' : ''}`}
                                    placeholder="House number, street name"
                                    value={newAddress.address_line1}
                                    onChange={handleNewAddressChange}
                                    required
                                />
                                {newAddressErrors.address_line1 && <span className="addr-error-text">{newAddressErrors.address_line1}</span>}
                            </div>
                            <div className="addr-field addr-field-full">
                                <label>Address Line 2</label>
                                <input
                                    type="text"
                                    name="address_line2"
                                    className="addr-input"
                                    placeholder="Apartment, suite, etc. (optional)"
                                    value={newAddress.address_line2}
                                    onChange={handleNewAddressChange}
                                />
                            </div>
                            <div className="addr-field">
                                <label>City <span className="addr-required">*</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    className={`addr-input ${newAddressErrors.city ? 'addr-input-error' : ''}`}
                                    placeholder="Enter city"
                                    value={newAddress.city}
                                    onChange={handleNewAddressChange}
                                    required
                                />
                                {newAddressErrors.city && <span className="addr-error-text">{newAddressErrors.city}</span>}
                            </div>
                            <div className="addr-field">
                                <label>State <span className="addr-required">*</span></label>
                                <input
                                    type="text"
                                    name="state"
                                    className={`addr-input ${newAddressErrors.state ? 'addr-input-error' : ''}`}
                                    placeholder="Enter state"
                                    value={newAddress.state}
                                    onChange={handleNewAddressChange}
                                    required
                                />
                                {newAddressErrors.state && <span className="addr-error-text">{newAddressErrors.state}</span>}
                            </div>
                            <div className="addr-field addr-field-full">
                                <label>Pin Code <span className="addr-required">*</span></label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    className={`addr-input ${newAddressErrors.postal_code ? 'addr-input-error' : ''}`}
                                    placeholder="6-digit pin code"
                                    value={newAddress.postal_code}
                                    onChange={handleNewAddressChange}
                                    onBlur={(e) => validateNewAddressField('postal_code', e.target.value)}
                                    maxLength="6"
                                    required
                                />
                                {newAddressErrors.postal_code && <span className="addr-error-text">{newAddressErrors.postal_code}</span>}
                            </div>
                            <div className="addr-field addr-field-full">
                                <label className="addr-default-check">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        checked={newAddress.is_default === 1}
                                        onChange={handleNewAddressChange}
                                    />
                                    <span>Make this my default address</span>
                                </label>
                            </div>
                        </div>

                        <div className="addr-form-actions">
                            <button type="submit" className="addr-btn-save">
                                <FaCheck /> Save Address
                            </button>
                            <button
                                type="button"
                                className="addr-btn-cancel"
                                onClick={() => { setShowAddressForm(false); setNewAddressErrors({}); }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Saved Addresses List */}
            <div className="addr-list">
                {addressLoading ? (
                    <div className="addr-loading">
                        <div className="addr-spinner"></div>
                        <p>Loading addresses...</p>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="addr-empty">
                        <div className="addr-empty-icon">
                            <FaMapMarkerAlt />
                        </div>
                        <h4>No Saved Addresses</h4>
                        <p>Add your first delivery address to get started.</p>
                    </div>
                ) : (
                    <>
                        {(showAllAddresses ? addresses : addresses.slice(0, 3)).map((address) =>
                            editingAddressId === address.id ? (
                                /* ===== Edit Address Form ===== */
                                <div key={address.id} className="addr-form-card">
                                    <div className="addr-form-card-header">
                                        <h3><FaPencilAlt /> Edit Address</h3>
                                        <button
                                            className="addr-form-close"
                                            onClick={handleCancelEdit}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <form onSubmit={handleUpdateAddress}>
                                        {/* Address Type */}
                                        <div className="addr-type-group">
                                            <label className="addr-type-label">Address Type</label>
                                            <div className="addr-type-options">
                                                {['Home', 'Office', 'Other'].map((type) => (
                                                    <label key={type} className="addr-type-radio">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value={type}
                                                            checked={editAddress.type === type}
                                                            onChange={handleEditAddressChange}
                                                        />
                                                        <span className="addr-type-radio-label">
                                                            {getTypeIcon(type)} {type}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="addr-form-grid">
                                            <div className="addr-field">
                                                <label>Full Name <span className="addr-required">*</span></label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className={`addr-input ${editAddressErrors.name ? 'addr-input-error' : ''}`}
                                                    placeholder="Enter full name"
                                                    value={editAddress.name}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                />
                                                {editAddressErrors.name && <span className="addr-error-text">{editAddressErrors.name}</span>}
                                            </div>
                                            <div className="addr-field">
                                                <label>Phone Number <span className="addr-required">*</span></label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className={`addr-input ${editAddressErrors.phone ? 'addr-input-error' : ''}`}
                                                    placeholder="10-digit mobile number"
                                                    value={editAddress.phone}
                                                    onChange={handleEditAddressChange}
                                                    onBlur={(e) => validateEditAddressField('phone', e.target.value)}
                                                    maxLength="10"
                                                    required
                                                />
                                                {editAddressErrors.phone && <span className="addr-error-text">{editAddressErrors.phone}</span>}
                                            </div>
                                            <div className="addr-field addr-field-full">
                                                <label>Address Line 1 <span className="addr-required">*</span></label>
                                                <input
                                                    type="text"
                                                    name="address_line1"
                                                    className={`addr-input ${editAddressErrors.address_line1 ? 'addr-input-error' : ''}`}
                                                    placeholder="House number, street name"
                                                    value={editAddress.address_line1}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                />
                                                {editAddressErrors.address_line1 && <span className="addr-error-text">{editAddressErrors.address_line1}</span>}
                                            </div>
                                            <div className="addr-field addr-field-full">
                                                <label>Address Line 2</label>
                                                <input
                                                    type="text"
                                                    name="address_line2"
                                                    className="addr-input"
                                                    placeholder="Apartment, suite, etc. (optional)"
                                                    value={editAddress.address_line2}
                                                    onChange={handleEditAddressChange}
                                                />
                                            </div>
                                            <div className="addr-field">
                                                <label>City <span className="addr-required">*</span></label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    className={`addr-input ${editAddressErrors.city ? 'addr-input-error' : ''}`}
                                                    placeholder="Enter city"
                                                    value={editAddress.city}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                />
                                                {editAddressErrors.city && <span className="addr-error-text">{editAddressErrors.city}</span>}
                                            </div>
                                            <div className="addr-field">
                                                <label>State <span className="addr-required">*</span></label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    className={`addr-input ${editAddressErrors.state ? 'addr-input-error' : ''}`}
                                                    placeholder="Enter state"
                                                    value={editAddress.state}
                                                    onChange={handleEditAddressChange}
                                                    required
                                                />
                                                {editAddressErrors.state && <span className="addr-error-text">{editAddressErrors.state}</span>}
                                            </div>
                                            <div className="addr-field addr-field-full">
                                                <label>Pin Code <span className="addr-required">*</span></label>
                                                <input
                                                    type="text"
                                                    name="postal_code"
                                                    className={`addr-input ${editAddressErrors.postal_code ? 'addr-input-error' : ''}`}
                                                    placeholder="6-digit pin code"
                                                    value={editAddress.postal_code}
                                                    onChange={handleEditAddressChange}
                                                    onBlur={(e) => validateEditAddressField('postal_code', e.target.value)}
                                                    maxLength="6"
                                                    required
                                                />
                                                {editAddressErrors.postal_code && <span className="addr-error-text">{editAddressErrors.postal_code}</span>}
                                            </div>
                                            <div className="addr-field addr-field-full">
                                                <label className="addr-default-check">
                                                    <input
                                                        type="checkbox"
                                                        name="is_default"
                                                        checked={editAddress.is_default === 1}
                                                        onChange={handleEditAddressChange}
                                                    />
                                                    <span>Make this my default address</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="addr-form-actions">
                                            <button type="submit" className="addr-btn-save">
                                                <FaCheck /> Update Address
                                            </button>
                                            <button
                                                type="button"
                                                className="addr-btn-cancel"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                /* ===== Address Card ===== */
                                <div
                                    key={address.id}
                                    className={`addr-card ${address.is_default === 1 ? 'addr-card-default' : ''}`}
                                    onClick={() => handleAddressSelect(address.id)}
                                >
                                    <div className="addr-card-top">
                                        <div className="addr-card-tags">
                                            <span className="addr-badge-type">
                                                {getTypeIcon(address.type)} {address.type}
                                            </span>
                                            {address.is_default === 1 && (
                                                <span className="addr-badge-default">
                                                    <FaCheckCircle /> Default
                                                </span>
                                            )}
                                        </div>
                                        <div className="addr-card-actions">
                                            <button
                                                className="addr-btn-edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditAddress(address);
                                                }}
                                                title="Edit address"
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                className="addr-btn-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAddress(address.id);
                                                }}
                                                title="Delete address"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="addr-card-body">
                                        <h4 className="addr-card-name">{address.name}</h4>
                                        <p className="addr-card-phone">
                                            <FaPhone /> {address.phone}
                                        </p>
                                        <p className="addr-card-line">
                                            {address.address_line1}
                                            {address.address_line2 && `, ${address.address_line2}`}
                                        </p>
                                        <p className="addr-card-city">
                                            <FaMapMarkerAlt />
                                            {address.city}, {address.state} - {address.postal_code}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}

                        {addresses.length > 3 && (
                            <div className="addr-view-more">
                                <button
                                    className="addr-toggle-btn"
                                    onClick={() => setShowAllAddresses(!showAllAddresses)}
                                >
                                    {showAllAddresses ? (
                                        <><FaChevronUp /> Show Less</>
                                    ) : (
                                        <><FaChevronDown /> View All ({addresses.length})</>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

export default AddressesSection