
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Email, Phone, Visibility, VisibilityOff, Lock } from '@mui/icons-material'

function StateForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Password validation regex
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    // Validate password
    if (!passwordPattern.test(formData.password)) {
      alert(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
      )
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    try {
      // Prepare form data for submission
      const data = new FormData()
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key])
      })

      // Send POST request to register user
      await axios.post('http://localhost:3002/api/users/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('User submitted successfully!')

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      })

      // Navigate to login page
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Failed to submit user. Please try again.')
    }
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
          Register
        </Typography>
        <Typography variant="body1" align="center" gutterBottom color="text.secondary">
          Create your account
        </Typography>

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
                : "We'll never share your email."
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
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            error={Boolean(
              formData.password &&
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password),
            )}
            helperText={
              formData.password &&
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password)
                ? 'Min 8 chars, include uppercase, lowercase, number, and symbol'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={Boolean(
              formData.confirmPassword && formData.confirmPassword !== formData.password,
            )}
            helperText={
              formData.confirmPassword && formData.confirmPassword !== formData.password
                ? 'Passwords do not match'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Create Account
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default StateForm
