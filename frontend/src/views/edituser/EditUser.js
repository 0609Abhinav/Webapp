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
import axios from 'axios'
import StateDropdown from '../pages/profile/stateDropdown'

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
    photo: null,
    photoFile: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [touched, setTouched] = useState({})

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  const apiBase = 'http://localhost:3002/api'

  const genders = ['Male', 'Female', 'Other']

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

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (name === 'photo' && files.length > 0) {
      setUser((prev) => ({ ...prev, photoFile: files[0] }))
    } else if (name === 'phone') {
      setUser((prev) => ({ ...prev, phone: value.replace(/\D/g, '').slice(0, 10) }))
    } else if (name === 'pincode') {
      setUser((prev) => ({ ...prev, pincode: value.replace(/\D/g, '').slice(0, 6) }))
    } else {
      setUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleStateSelect = (stateObj) => {
    setTouched((prev) => ({ ...prev, state_name: true }))
    setUser((prev) => ({ ...prev, state_name: stateObj?.state_name || '' }))
  }

  const validate = {
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email),
    phone: () => /^\d{10}$/.test(user.phone),
    pincode: () => /^\d{6}$/.test(user.pincode),
    state_name: () => user.state_name !== '',
    gender: () => user.gender !== '',
  }

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
    <CRow className="justify-content-center mt-4 mx-0">
      <CCol xs={12} md={8} lg={6} className="px-0">
        <CCard className="shadow-sm">
          <CCardHeader className="bg-primary text-white text-center">
            <h4 className="mb-0">Edit User Profile</h4>
          </CCardHeader>
          <CCardBody className="p-3">
            {success && <div className="text-success mb-3 text-center">{success}</div>}
            <CForm onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Avatar */}
              <div className="text-center mb-4">
                <img
                  src={
                    user.photoFile
                      ? URL.createObjectURL(user.photoFile)
                      : user.photo
                      ? `http://localhost:3002/uploads/${user.photo}`
                      : 'https://via.placeholder.com/120'
                  }
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', border: '2px solid #1976d2' }}
                />
              </div>

              {/* Full Name & Email */}
              <CRow className="mb-3 gx-2">
                <CCol xs={12} md={6}>
                  <CFormLabel>Full Name</CFormLabel>
                  <CFormInput name="fullName" value={user.fullName} onChange={handleChange} placeholder="Enter full name" required />
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput name="email" type="email" value={user.email} onChange={handleChange} placeholder="Enter email" invalid={touched.email && !validate.email()} />
                  <CFormFeedback invalid>Enter a valid email address</CFormFeedback>
                </CCol>
              </CRow>

              {/* Phone & Gender */}
              <CRow className="mb-3 gx-2">
                <CCol xs={12} md={6}>
                  <CFormLabel>Phone</CFormLabel>
                  <CFormInput name="phone" value={user.phone} onChange={handleChange} placeholder="Enter phone number" invalid={touched.phone && !validate.phone()} />
                  <CFormFeedback invalid>Phone must be 10 digits</CFormFeedback>
                </CCol>
                <CCol xs={12} md={6}>
                  <CFormLabel>Gender</CFormLabel>
                  <CFormSelect name="gender" value={user.gender} onChange={handleChange} invalid={touched.gender && !validate.gender()}>
                    <option value="">Select Gender</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </CFormSelect>
                  <CFormFeedback invalid>Please select a gender</CFormFeedback>
                </CCol>
              </CRow>

              {/* Address */}
              <CRow className="mb-3 gx-2">
                <CCol xs={12} md={4}>
                  <CFormLabel>Street</CFormLabel>
                  <CFormInput name="street" value={user.street} onChange={handleChange} placeholder="Street" />
                </CCol>
                <CCol xs={12} md={4}>
                  <CFormLabel>City</CFormLabel>
                  <CFormInput name="city" value={user.city} onChange={handleChange} placeholder="City" />
                </CCol>
                <CCol xs={12} md={4}>
                  <CFormLabel>Pincode</CFormLabel>
                  <CFormInput name="pincode" value={user.pincode} onChange={handleChange} placeholder="Pincode" invalid={touched.pincode && !validate.pincode()} />
                  <CFormFeedback invalid>Pincode must be 6 digits</CFormFeedback>
                </CCol>
              </CRow>

              {/* State */}
              <CRow className="mb-4 gx-2">
                <CCol xs={12} md={6}>
                  <CFormLabel>State</CFormLabel>
                  <StateDropdown onSelect={handleStateSelect} value={user.state_name} />
                  {touched.state_name && !validate.state_name() && <div className="text-danger mt-1">Please select a state</div>}
                </CCol>
              </CRow>

              {/* Photo Upload */}
              <CRow className="mb-4 gx-2">
                <CCol xs={12} md={6}>
                  <CFormLabel>Profile Photo</CFormLabel>
                  <CFormInput type="file" name="photo" accept="image/*" onChange={handleChange} />
                </CCol>
              </CRow>

              {/* Buttons */}
              <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                <CButton color="secondary" onClick={() => navigate('/dashboard')}>Cancel</CButton>
                <CButton type="submit" color="primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditUser


