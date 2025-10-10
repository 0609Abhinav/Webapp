import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilUser, cilLockLocked } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null); // No static fallback
  const [error, setError] = useState('');

  // Fetch user profile data to get avatar URL
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your profile.');
          navigate('/login');
          return;
        }

        const profileEndpoint = 'http://localhost:3002/api/users/me';
        const res = await axios.get(profileEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Access user data from res.data.data
        const userData = res.data.data;
        console.log('User data:', userData);

        // Construct avatar URL from photo field
        const photo = userData.photo;
        setAvatarUrl(photo ? `http://localhost:3002/uploads/${photo}` : null);
      } catch (err) {
        console.error('Fetch avatar error:', err);
        setError(
          err.response?.status === 404
            ? 'Profile endpoint not found. Please check backend configuration.'
            : err.response?.data?.message || 'Failed to load profile data.'
        );
        setAvatarUrl(null);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchAvatar();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        {avatarUrl ? (
          <CAvatar src={avatarUrl} size="sm" />
        ) : (
          <CAvatar color="secondary" size="sm" text="?" /> // Placeholder if no avatar
        )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {error && (
          <CDropdownItem disabled>
            <span className="text-danger">{error}</span>
          </CDropdownItem>
        )}
        <CDropdownItem onClick={() => navigate('/profile')}>
          <CIcon icon={cilUser} className="me-2" />
          Update Profile
        </CDropdownItem>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;