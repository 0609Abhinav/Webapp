
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CRow,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
} from '@coreui/react'
import StateDropdown from '../profile/stateDropdown'
import axios from 'axios'

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
    state_name: '',
    gender: '',
    photo: null, // stored file name from DB
    photoFile: null, // newly selected local file
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [touched, setTouched] = useState({}) // track fields touched

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  const apiBase = 'http://localhost:3002/api'

  const genders = ['Male', 'Female', 'Other']

  // --- Fetch user data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${apiBase}/users/${id}`, { headers })
        if (userRes.data.status !== 'success') throw new Error(userRes.data.message)

        const userData = userRes.data.data
        setUser({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          street: userData.street || '',
          city: userData.city || '',
          pincode: userData.pincode || '',
          state_name: userData.state ? userData.state.state_name : '',
          gender: userData.gender || '',
          photo: userData.photo || null,
          photoFile: null,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // --- Handle input changes ---
  const handleChange = (e) => {
    const { name, value, files } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    if (name === 'photo' && files.length > 0) {
      setUser((prev) => ({ ...prev, photoFile: files[0] }))
    } else if (name === 'phone') {
      const val = value.replace(/\D/g, '').slice(0, 10)
      setUser((prev) => ({ ...prev, phone: val }))
    } else if (name === 'pincode') {
      const val = value.replace(/\D/g, '').slice(0, 6)
      setUser((prev) => ({ ...prev, pincode: val }))
    } else {
      setUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  // --- Handle state selection ---
  const handleStateSelect = (stateObj) => {
    setTouched((prev) => ({ ...prev, state_name: true }))
    setUser((prev) => ({
      ...prev,
      state_name: stateObj?.state_name || '',
    }))
  }

  // --- Validation helpers ---
  const validate = {
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email),
    phone: () => /^\d{10}$/.test(user.phone),
    pincode: () => /^\d{6}$/.test(user.pincode),
    state_name: () => user.state_name !== '',
    gender: () => user.gender !== '',
  }

  // --- Form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    for (const field of Object.keys(validate)) {
      if (!validate[field]()) {
        setTouched((prev) => ({ ...prev, [field]: true }))
        setError(`Please correct the ${field} field.`)
        return
      }
    }

    try {
      setLoading(true)
      const formData = new FormData()
      Object.keys(user).forEach((key) => {
        if (user[key] !== null && key !== 'photoFile') formData.append(key, user[key])
      })
      if (user.photoFile) formData.append('photo', user.photoFile)

      const res = await axios.put(`${apiBase}/users/${id}`, formData, { headers })
      if (res.data.status !== 'success') throw new Error(res.data.message)

      setSuccess('User updated successfully!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-5 text-center">Loading...</div>
  if (error && !success) return <div className="p-5 text-danger text-center">{error}</div>

  return (
    <CRow className="justify-content-center mt-4">
      <CCol xs={12} md={8} lg={6}>
        <CCard className="shadow-sm">
          <CCardHeader className="bg-primary text-white text-center">
            <h4 className="mb-0">Edit User Profile</h4>
          </CCardHeader>
          <CCardBody>
            {success && <div className="text-success mb-3 text-center">{success}</div>}
            <CForm onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Avatar */}
              <div className="text-center mb-4">
                <img
                  src={
                    user.photoFile
                      ? URL.createObjectURL(user.photoFile) // preview newly selected photo
                      : user.photo
                        ? `http://localhost:3002/uploads/${user.photo}` // use correct URL, remove /api
                        : null
                  }
                  alt="Profile"
                  className="rounded-circle"
                  width="120"
                  height="120"
                  style={{ objectFit: 'cover', border: '2px solid #1976d2' }}
                />
              </div>

              {/* Full Name & Email */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Full Name</CFormLabel>
                  <CFormInput
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    invalid={touched.email && !validate.email()}
                  />
                  <CFormFeedback invalid>Enter a valid email address</CFormFeedback>
                </CCol>
              </CRow>

              {/* Phone & Gender */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Phone</CFormLabel>
                  <CFormInput
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    invalid={touched.phone && !validate.phone()}
                  />
                  <CFormFeedback invalid>Phone must be 10 digits</CFormFeedback>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Gender</CFormLabel>
                  <CFormSelect
                    name="gender"
                    value={user.gender}
                    onChange={handleChange}
                    invalid={touched.gender && !validate.gender()}
                  >
                    <option value="">Select Gender</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </CFormSelect>
                  <CFormFeedback invalid>Please select a gender</CFormFeedback>
                </CCol>
              </CRow>

              {/* Address */}
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel>Street</CFormLabel>
                  <CFormInput
                    name="street"
                    value={user.street}
                    onChange={handleChange}
                    placeholder="Street"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>City</CFormLabel>
                  <CFormInput
                    name="city"
                    value={user.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Pincode</CFormLabel>
                  <CFormInput
                    name="pincode"
                    value={user.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    invalid={touched.pincode && !validate.pincode()}
                  />
                  <CFormFeedback invalid>Pincode must be 6 digits</CFormFeedback>
                </CCol>
              </CRow>

              {/* State Dropdown */}
              <CRow className="mb-4">
                <CCol md={6}>
                  <CFormLabel>State</CFormLabel>
                  <StateDropdown onSelect={handleStateSelect} value={user.state_name} />
                  {touched.state_name && !validate.state_name() && (
                    <div className="text-danger mt-1">Please select a state</div>
                  )}
                </CCol>
              </CRow>

              {/* Photo Upload */}
              <CRow className="mb-4">
                <CCol md={6}>
                  <CFormLabel>Profile Photo</CFormLabel>
                  <CFormInput type="file" name="photo" accept="image/*" onChange={handleChange} />
                </CCol>
              </CRow>

              {/* Buttons */}
              <div className="d-flex justify-content-between">
                <CButton color="secondary" onClick={() => navigate('/dashboard')}>
                  Cancel
                </CButton>
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditUser
