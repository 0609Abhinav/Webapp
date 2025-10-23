// Dashboard.js
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import {
  CAvatar, CButton, CCard, CCardBody, CCardHeader, CCardFooter,
  CFormInput, CFormSelect, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CPagination, CPaginationItem,
  CBadge, CSpinner, CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilChatBubble, cilSend, cilCloudDownload } from '@coreui/icons'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import WidgetsBrand from '../widgets/WidgetsBrand'
import MainChart from './MainChart'
import { TextField } from '@mui/material'
import StateDropdown from '../pages/profile/stateDropdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const socket = io('http://localhost:3002', { transports: ['websocket'] })

const Dashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [userData, setUserData] = useState(null)

  // AI Chat state
  const [aiVisible, setAiVisible] = useState(false)
  const [aiMessages, setAiMessages] = useState([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const aiEndRef = useRef(null)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [actionLoading, setActionLoading] = useState(false)

  const apiBase = 'http://localhost:3002/api'
  const baseUploadUrl = 'http://localhost:3002/uploads/'
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  // ---------------- FETCH CURRENT USER ----------------
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/users/me`, { headers })
      const json = await res.json()
      if (json.status !== 'success') throw new Error(json.message)
      setUserData(json.data)
    } catch {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [apiBase, headers, navigate])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiBase}/users`, { headers })
      const json = await res.json()
      if (json.status !== 'success') throw new Error(json.message)
      setUsers(json.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiBase, headers])

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchCurrentUser()
    fetchUsers()
  }, [token])

  // ---------------- AI CHAT SETUP ----------------
  useEffect(() => {
    socket.on('privateMessage', (msg) => setAiMessages(prev => [...prev, msg]))
    return () => socket.off('privateMessage')
  }, [])

  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiMessages])

 const sendAiMessage = async () => {
  if (!aiInput.trim()) return

  const userMsg = { role: 'user', text: aiInput }
  setAiMessages((prev) => [...prev, userMsg])
  setAiInput('')
  setAiLoading(true)

  try {
    // Make POST request to your AI backend
    const res = await fetch(`${apiBase.replace('/api','')}/api/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg.text }),
    })
    const data = await res.json()

    // Push AI response
    const botReply = data.reply || 'Sorry, I could not understand that.'
    setAiMessages((prev) => [...prev, { role: 'bot', text: botReply }])
  } catch (err) {
    console.error(err)
    setAiMessages((prev) => [
      ...prev,
      { role: 'bot', text: 'AI service is currently unavailable.' },
    ])
  } finally {
    setAiLoading(false)
  }
}


  // ---------------- USER CRUD ----------------
  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      gender: user.gender || '',
      state: user.state_name ? { state_name: user.state_name } : null,
      city: user.city || '',
      photo: null,
      photoPreview: user.photo ? `${baseUploadUrl}${user.photo}` : null
    })
    setEditModal(true)
  }

  const handleEditFile = (e) => {
    const file = e.target.files?.[0]
    if (file) setFormData(p => ({ ...p, photo: file, photoPreview: URL.createObjectURL(file) }))
  }

  const updateUser = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      const fd = new FormData()
      fd.append('fullName', formData.fullName)
      fd.append('email', formData.email)
      if (formData.gender) fd.append('gender', formData.gender)
      if (formData.state?.state_name) fd.append('state_name', formData.state.state_name)
      if (formData.city) fd.append('city', formData.city)
      if (formData.photo) fd.append('photo', formData.photo)

      const res = await fetch(`${apiBase}/users/${selectedUser.id}`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: fd
      })
      const json = await res.json()
      if (json.status !== 'success') throw new Error(json.message || 'Update failed')
      setEditModal(false)
      fetchUsers()
    } catch (err) { console.error(err) }
    finally { setActionLoading(false) }
  }

  const handleDelete = (user) => { setSelectedUser(user); setDeleteModal(true) }
  const confirmDelete = async () => {
    try { await fetch(`${apiBase}/users/${selectedUser.id}`, { method: 'DELETE', headers }); setDeleteModal(false); fetchUsers() }
    catch (err) { console.error(err) }
  }

  // ---------------- PAGINATION ----------------
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentUsers = users.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(users.length / itemsPerPage)

  if (loading) return <div className="text-center p-5"><CSpinner /> Loading...</div>
  if (error) return <div className="text-center p-5 text-danger">{error}</div>

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div><h4>Welcome, {userData?.fullName || 'User'}</h4><small className="text-muted">Your Dashboard Overview</small></div>
          <CButton color="danger" variant="outline" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}><CIcon icon={cilCloudDownload} className="me-2" /> Logout</CButton>
        </CCardHeader>
        <CCardBody><MainChart /></CCardBody>
        <CCardFooter><WidgetsBrand withCharts /></CCardFooter>
      </CCard>

      {/* ---------------- USER TABLE ---------------- */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader><h5>📋 Registered Users</h5></CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Profile</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Gender</CTableHeaderCell>
                <CTableHeaderCell>State</CTableHeaderCell>
                <CTableHeaderCell>City</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.map((user, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell><CAvatar src={user.photo ? `${baseUploadUrl}${user.photo}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} size="md"           
                  style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      overflow: "hidden",
                      marginRight: "10px",
                    }}/></CTableDataCell>
                  <CTableDataCell>{user.fullName}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell><CBadge color={user.gender === 'Male' ? 'info' : 'danger'}>{user.gender}</CBadge></CTableDataCell>
                  <CTableDataCell>{user.state_name}</CTableDataCell>
                  <CTableDataCell>{user.city}</CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" className="me-2" onClick={() => handleEdit(user)}><CIcon icon={cilPencil} /></CButton>
                    <CButton size="sm" color="danger" onClick={() => handleDelete(user)}><CIcon icon={cilTrash} /></CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <div className="d-flex justify-content-center mt-3">
            <CPagination>
              {[...Array(totalPages)].map((_, idx) => <CPaginationItem key={idx} active={currentPage === idx + 1} onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</CPaginationItem>)}
            </CPagination>
          </div>
        </CCardBody>
      </CCard>

      {/* ---------------- EDIT MODAL ---------------- */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader><CModalTitle>Edit User</CModalTitle></CModalHeader>
        <CModalBody>
          <CFormInput className="mb-2" label="Full Name" value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} />
          <CFormInput className="mb-2" label="Email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
          <CFormSelect className="mb-2" label="Gender" value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </CFormSelect>
          <div className="mb-2">
            <label className="form-label">State</label>
            <StateDropdown value={formData.state?.state_name || ''} onSelect={state => setFormData(p => ({ ...p, state }))} />
          </div>
          <TextField fullWidth variant="outlined" label="City" value={formData.city || ''} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} className="mb-2" />
          <CFormInput type="file" accept="image/*" className="mb-2" label="Change Profile Picture" onChange={handleEditFile} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)} disabled={actionLoading}>Cancel</CButton>
          <CButton color="primary" onClick={updateUser} disabled={actionLoading}>{actionLoading ? <CSpinner size="sm" /> : 'Save Changes'}</CButton>
        </CModalFooter>
      </CModal>

      {/* ---------------- DELETE MODAL ---------------- */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader><CModalTitle>Confirm Delete</CModalTitle></CModalHeader>
        <CModalBody>Are you sure you want to delete <strong>{selectedUser?.fullName}</strong>?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>Cancel</CButton>
          <CButton color="danger" onClick={confirmDelete}>Delete</CButton>
        </CModalFooter>
      </CModal>

      {/* ---------------- AI FLOATING WIDGET ---------------- */}
      <div style={{ position: 'fixed', bottom: '50px', right: '50px', zIndex: 1880 }}>
        <CButton color="info" shape="rounded-circle" style={{ width: '60px', height: '60px', animation: 'bounce 2s infinite' }} onClick={() => setAiVisible(!aiVisible)}>
          <CIcon icon={cilChatBubble} size="lg" />
        </CButton>
      </div>

      {aiVisible && (
        <div style={{ position: 'fixed', bottom: '120px', right: '20px', width: '400px', height: '600px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', zIndex: 1050 }}>
          <div style={{ backgroundColor: '#053253ff', color: '#fff', padding: '10px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', textAlign: 'center' }}>
            <h4>🤖 AI Assistant</h4>
          </div>
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', backgroundColor: '#f9fafb' }}>
            {aiMessages.map((msg, idx) => (
              <div key={idx} className={`mb-2 d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div className={`p-2 rounded-3 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light border'}`} style={{ maxWidth: '80%', whiteSpace: 'pre-wrap' }}>
                  {msg.role === 'bot' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown> : msg.text}
                </div>
              </div>
            ))}
            {aiLoading && <div className="text-muted fst-italic px-3">AI is typing...</div>}
            <div ref={aiEndRef} />
          </div>
          <div style={{ borderTop: '1px solid #d9b9b9', padding: '8px', display: 'flex', alignItems: 'center' }}>
            <CFormInput placeholder="Ask AI..." value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAiMessage()} disabled={aiLoading} />
            <CButton color="info" className="ms-2" onClick={sendAiMessage} disabled={aiLoading}><CIcon icon={cilSend} /></CButton>
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard
