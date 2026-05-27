import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { useConfirm } from '../contexts/ConfirmContext';

/**
 * Custom hook for handling user logout with confirmation
 * @returns {Function} handleLogout - Function to trigger logout with confirmation
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { confirmAction } = useConfirm();

    const handleLogout = useCallback(() => {
        // Show confirmation dialog using ConfirmContext
        confirmAction({
            header: 'Confirm Logout',
            message: 'Are you sure you want to logout from your account?',
            icon: 'pi pi-sign-out',
            acceptLabel: 'Yes, Logout',
            rejectLabel: 'Cancel',
            accept: () => {
                // User clicked "Yes, Logout" - proceed with logout
                dispatch(logout());
                toast.success('Logged out successfully!', {
                    position: 'top-right',
                    autoClose: 2000,
                });
                navigate('/login');
            },
            reject: () => {
                // User clicked "Cancel" - do nothing (stay on current page)
            }
        });
    }, [dispatch, navigate, confirmAction]);

    return handleLogout;
};
