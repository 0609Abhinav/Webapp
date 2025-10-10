import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Email,
  Phone,
  Home,
  LocationCity,
  PinDrop,
} from '@mui/icons-material';
import StateDropdown from './stateDropdown'; // Adjust path based on your project structure

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
    state_name: '',
    gender: '',
    photo: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          navigate('/login');
          return;
        }
        const profileEndpoint = 'http://localhost:3002/api/users/me';
        const res = await axios.get(profileEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User data:', res.data.data);
        const userData = res.data.data;
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          street: userData.street || '',
          city: userData.city || '',
          pincode: userData.pincode || '',
          state_name: userData.state_name || '',
          gender: userData.gender || '',
          photo: null,
        });
        setLoading(false);
      } catch (err) {
        console.error('Fetch profile error:', err);
        setError(
          err.response?.status === 404
            ? 'Profile endpoint not found. Please check backend configuration.'
            : err.response?.data?.message || 'Failed to fetch profile data.'
        );
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle state selection from StateDropdown
  const handleStateSelect = ({ state_name }) => {
    setFormData((prev) => ({ ...prev, state_name }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Validate phone
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      setLoading(false);
      return;
    }

    // Validate state
    if (!formData.state_name) {
      setError('Please select a state.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        navigate('/login');
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && key !== 'photo') {
          data.append(key, formData[key]);
        }
      });
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      const updateEndpoint = 'http://localhost:3002/api/users/me';
      const res = await axios.put(updateEndpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Update response:', res.data);
      setSuccess(res.data.message || 'Profile updated successfully!');
      setFormData((prev) => ({ ...prev, photo: null }));
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Update profile error:', err);
      setError(
        err.response?.status === 404
          ? 'Update endpoint not found. Please check backend configuration (tried PUT http://localhost:3002/api/users/me).'
          : err.response?.data?.message || 'Failed to update profile.'
      );
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
          <Typography variant="body1" ml={2}>
            Loading profile...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, color: '#1976d2' }}
        >
          Update Profile
        </Typography>
        <Typography variant="body1" align="center" gutterBottom color="text.secondary">
          Update your personal information
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" align="center" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={Boolean(formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))}
            helperText={
              formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                ? 'Please enter a valid email address'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '') // Remove non-numeric
                        if (value.length <= 10) {
                          setFormData((prev) => ({ ...prev, phone: value }))
                        }
                      }}
                      required
                      error={Boolean(formData.phone && formData.phone.length !== 10)}
                      helperText={
                        formData.phone && formData.phone.length !== 10 ? 'Enter a valid 10-digit number' : ''
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                        inputProps: { maxLength: 10 },
                      }}
                    />

          <TextField
            fullWidth
            margin="normal"
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Home color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCity color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
             required
                      error={Boolean(formData.pincode && formData.pincode.length !== 6)}
                      helperText={
                        formData.pincode && formData.pincode.length !== 6 ? 'Enter a valid 6-digit number' : ''
                      }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinDrop color="action" />
                </InputAdornment>
              ),
                inputProps: { maxLength: 6 },
            }}
          />

          <FormControl fullWidth margin="normal">
            <FormLabel>State</FormLabel>
            <StateDropdown onSelect={handleStateSelect} value={formData.state_name} />
          </FormControl>

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              name="photo"
              onChange={handleFileChange}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                Upload Photo
              </Button>
              {formData.photo && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formData.photo.name}
                </Typography>
              )}
            </label>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontSize: '1rem', fontWeight: 600, borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfileUpdate;
