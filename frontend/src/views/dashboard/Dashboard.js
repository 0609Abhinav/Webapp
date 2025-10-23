// import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import io from 'socket.io-client'
// import {
//   CAvatar,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCardFooter,
//   CFormInput,
//   CFormSelect,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CPagination,
//   CPaginationItem,
//   CCollapse,
//   CInputGroup,
//   CInputGroupText,
//   CBadge,
//   CSpinner,
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalTitle,
//   CModalFooter,
//   CToast,
//   CToastBody,
//   CToaster
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilUser, cilPencil, cilTrash, cilChatBubble, cilSend, cilCloudDownload, cilSearch } from '@coreui/icons'
// import WidgetsDropdown from '../widgets/WidgetsDropdown'
// import WidgetsBrand from '../widgets/WidgetsBrand'
// import MainChart from './MainChart'
// import StateDropdown from '../pages/profile/stateDropdown' // Infinite scroll state dropdown
// import { Autocomplete, TextField } from '@mui/material'

// const socket = io('http://localhost:3002', { transports: ['websocket'] })

// const Dashboard = () => {
//   const navigate = useNavigate()
//   const token = localStorage.getItem('token')
//   const [userData, setUserData] = useState(null)

//   // Chat state
//   const [chatVisible, setChatVisible] = useState(false)
//   const [chatMessages, setChatMessages] = useState([])
//   const [chatInput, setChatInput] = useState('')
//   const chatEndRef = useRef(null)

//   // Users listing state
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 5
//   const [searchQuery, setSearchQuery] = useState('')

//   // Modal states
//   const [editModal, setEditModal] = useState(false)
//   const [deleteModal, setDeleteModal] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [formData, setFormData] = useState({})

//   const apiBase = 'http://localhost:3002/api'
//   const baseUploadUrl = 'http://localhost:3002/uploads/'
//   const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

//   // ---------------- CHAT SETUP ----------------
//   useEffect(() => {
//     if (!userData?.id) return
//     socket.on('privateMessage', (msg) => {
//       setChatMessages((prev) => [...prev, msg])
//     })
//     return () => socket.off('privateMessage')
//   }, [userData])

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [chatMessages])

//   const sendMessage = () => {
//     if (!chatInput.trim() || !userData?.id) return
//     const message = chatInput.trim()
//     const msgData = { from: userData.id, to: 1, message }
//     socket.emit('privateMessage', msgData)
//     setChatMessages((prev) => [
//       ...prev,
//       { from: userData.id, message, timestamp: new Date().toISOString() },
//     ])
//     setChatInput('')
//   }

//   // ---------------- FETCH DATA ----------------
//   const fetchCurrentUser = useCallback(async () => {
//     try {
//       const res = await fetch(`${apiBase}/users/me`, { headers })
//       const json = await res.json()
//       if (json.status !== 'success') throw new Error(json.message)
//       setUserData(json.data)
//     } catch {
//       localStorage.removeItem('token')
//       navigate('/login')
//     }
//   }, [apiBase, headers, navigate])

//   const fetchUsers = useCallback(async () => {
//     try {
//       setLoading(true)
//       const res = await fetch(`${apiBase}/users`, { headers })
//       const json = await res.json()
//       if (json.status !== 'success') throw new Error(json.message)
//       setUsers(json.data || [])
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }, [apiBase, headers])

//   useEffect(() => {
//     if (!token) {
//       navigate('/login')
//       return
//     }
//     fetchCurrentUser()
//     fetchUsers()
//   }, [token])

//   // Filter users by search
//   const filteredUsers = users.filter(
//     (user) =>
//       user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   // Pagination
//   const indexOfLast = currentPage * itemsPerPage
//   const indexOfFirst = indexOfLast - itemsPerPage
//   const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast)
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

//   // ---------------- EDIT USER ----------------
//   const handleEdit = (user) => {
//     setSelectedUser(user)
//     setFormData({
//       fullName: user.fullName,
//       email: user.email,
//       gender: user.gender,
//       state: user.state_name ? { state_name: user.state_name } : null,
//       city: user.city || '',
//       photoPreview: user.photo ? `${baseUploadUrl}${user.photo}` : null,
//     })
//     setEditModal(true)
//   }

//   const handleFileChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setFormData((prev) => ({
//         ...prev,
//         photo: file,
//         photoPreview: URL.createObjectURL(file),
//       }))
//     }
//   }

//   const handleUpdateUser = async () => {
//     const formDataToSend = new FormData()
//     Object.keys(formData).forEach((key) => {
//       if (formData[key]) {
//         if (key === 'state') {
//           formDataToSend.append('state_name', formData.state.state_name)
//         } else {
//           formDataToSend.append(key, formData[key])
//         }
//       }
//     })

//     await fetch(`${apiBase}/users/${selectedUser.id}`, {
//       method: 'PUT',
//       headers: { Authorization: `Bearer ${token}` },
//       body: formDataToSend,
//     })
//     setEditModal(false)
//     fetchUsers()
//   }

//   // ---------------- DELETE USER ----------------
//   const handleDelete = (user) => {
//     setSelectedUser(user)
//     setDeleteModal(true)
//   }

//   const confirmDelete = async () => {
//     await fetch(`${apiBase}/users/${selectedUser.id}`, {
//       method: 'DELETE',
//       headers,
//     })
//     setDeleteModal(false)
//     fetchUsers()
//   }

//   // ---------------- RENDER ----------------
//   if (loading)
//     return (
//       <div className="text-center p-5">
//         <CSpinner color="primary" />
//         <div>Loading...</div>
//       </div>
//     )

//   if (error)
//     return (
//       <div className="text-center p-5 text-danger">
//         <h5>Error:</h5>
//         <p>{error}</p>
//       </div>
//     )

//   return (
//     <>
//       <WidgetsDropdown className="mb-4" />

//       <CCard className="mb-4 shadow-sm">
//         <CCardHeader className="d-flex justify-content-between align-items-center">
//           <div>
//             <h4 className="mb-0">Welcome, {userData?.fullName || 'User'}</h4>
//             <small className="text-muted">Your Dashboard Overview</small>
//           </div>
//           <div className="d-flex gap-2">
//             <CButton
//               color="info"
//               variant="outline"
//               onClick={() => setChatVisible(!chatVisible)}
//             >
//               <CIcon icon={cilChatBubble} className="me-2" />
//               Chat with Admin
//             </CButton>
//             <CButton
//               color="danger"
//               variant="outline"
//               onClick={() => {
//                 localStorage.removeItem('token')
//                 navigate('/login')
//               }}
//             >
//               <CIcon icon={cilCloudDownload} className="me-2" />
//               Logout
//             </CButton>
//           </div>
//         </CCardHeader>

//         <CCardBody>
//           <MainChart />
//         </CCardBody>
//         <CCardFooter>
//           <WidgetsBrand withCharts />
//         </CCardFooter>
//       </CCard>

//       {/* ---------------- USER RECORDS LIST ---------------- */}
//       <CCard className="mb-4 shadow-sm">
//         <CCardHeader className="d-flex justify-content-between align-items-center">
//           <h5 className="mb-0">📋 Registered Users</h5>
//           <CInputGroup style={{ maxWidth: '300px' }}>
//             <CInputGroupText>
//               <CIcon icon={cilSearch} />
//             </CInputGroupText>
//             <CFormInput
//               placeholder="Search by name or email..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </CInputGroup>
//         </CCardHeader>
//         <CCardBody>
//           <CTable hover responsive bordered>
//             <CTableHead color="light">
//               <CTableRow>
//                 <CTableHeaderCell>Profile</CTableHeaderCell>
//                 <CTableHeaderCell>Name</CTableHeaderCell>
//                 <CTableHeaderCell>Email</CTableHeaderCell>
//                 <CTableHeaderCell>Gender</CTableHeaderCell>
//                 <CTableHeaderCell>State</CTableHeaderCell>
//                 <CTableHeaderCell>City</CTableHeaderCell>
//                 <CTableHeaderCell>Actions</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {currentUsers.map((user, idx) => (
//                 <CTableRow key={idx}>
//                   <CTableDataCell>
//                     <CAvatar
//                       size="md"
//                       src={
//                         user.photo
//                           ? `${baseUploadUrl}${user.photo}`
//                           : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
//                       }
//                     />
//                   </CTableDataCell>
//                   <CTableDataCell>{user.fullName}</CTableDataCell>
//                   <CTableDataCell>{user.email}</CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color={user.gender === 'Male' ? 'info' : 'danger'}>
//                       {user.gender}
//                     </CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color="secondary">{user.state_name}</CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <CBadge color="secondary">{user.city}</CBadge>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <CButton
//                       size="sm"
//                       color="warning"
//                       className="me-2"
//                       onClick={() => handleEdit(user)}
//                     >
//                       <CIcon icon={cilPencil} />
//                     </CButton>
//                     <CButton
//                       size="sm"
//                       color="danger"
//                       onClick={() => handleDelete(user)}
//                     >
//                       <CIcon icon={cilTrash} />
//                     </CButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>

//           {/* Pagination */}
//           <div className="d-flex justify-content-center mt-3">
//             <CPagination>
//               {[...Array(totalPages)].map((_, idx) => (
//                 <CPaginationItem
//                   key={idx}
//                   active={currentPage === idx + 1}
//                   onClick={() => setCurrentPage(idx + 1)}
//                 >
//                   {idx + 1}
//                 </CPaginationItem>
//               ))}
//             </CPagination>
//           </div>
//         </CCardBody>
//       </CCard>

//       {/* ---------------- EDIT MODAL ---------------- */}
//       <CModal visible={editModal} onClose={() => setEditModal(false)}>
//         <CModalHeader>
//           <CModalTitle>Edit User</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="text-center mb-3">
//             {formData.photoPreview && (
//               <img
//                 src={formData.photoPreview}
//                 alt="Preview"
//                 style={{
//                   width: '120px',
//                   height: '120px',
//                   borderRadius: '50%',
//                   objectFit: 'cover',
//                 }}
//               />
//             )}
//           </div>
//           <CFormInput
//             className="mb-2"
//             label="Full Name"
//             value={formData.fullName || ''}
//             onChange={(e) =>
//               setFormData({ ...formData, fullName: e.target.value })
//             }
//           />
//           <CFormInput
//             className="mb-2"
//             label="Email"
//             value={formData.email || ''}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />
//           <CFormSelect
//             className="mb-2"
//             label="Gender"
//             value={formData.gender || ''}
//             onChange={(e) =>
//               setFormData({ ...formData, gender: e.target.value })
//             }
//           >
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </CFormSelect>

//           {/* Interactive State Dropdown */}
//           <StateDropdown
//             value={formData.state?.state_name || ''}
//             onSelect={(state) => setFormData({ ...formData, state })}
//           />

//           {/* City typing input */}
//           <TextField
//             fullWidth
//             variant="outlined"
//             label="City"
//             value={formData.city || ''}
//             onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//             className="mb-2"
//             placeholder="Type your city"
//           />

//           <CFormInput
//             type="file"
//             accept="image/*"
//             className="mb-2"
//             label="Profile Picture"
//             onChange={handleFileChange}
//           />
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setEditModal(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={handleUpdateUser}>
//             Save Changes
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* ---------------- DELETE MODAL ---------------- */}
//       <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
//         <CModalHeader>
//           <CModalTitle>Confirm Delete</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           Are you sure you want to delete{' '}
//           <strong>{selectedUser?.fullName}</strong>?
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setDeleteModal(false)}>
//             Cancel
//           </CButton>
//           <CButton color="danger" onClick={confirmDelete}>
//             Delete
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* ---------------- CHAT BOX ---------------- */}
//       <CCollapse visible={chatVisible}>
//         <CCard className="mb-4 shadow">
//           <CCardHeader>💬 Private Chat with Admin</CCardHeader>
//           <CCardBody
//             style={{
//               height: '250px',
//               overflowY: 'auto',
//               backgroundColor: '#f9fafb',
//               padding: '10px',
//             }}
//           >
//             {chatMessages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`mb-2 d-flex ${
//                   msg.from === userData?.id
//                     ? 'justify-content-end'
//                     : 'justify-content-start'
//                 }`}
//               >
//                 <div
//                   className={`p-2 rounded-3 ${
//                     msg.from === userData?.id
//                       ? 'bg-primary text-white'
//                       : 'bg-light border'
//                   }`}
//                   style={{ maxWidth: '70%' }}
//                 >
//                   <strong>{msg.from === userData?.id ? 'You' : 'Admin'}</strong>
//                   <div>{msg.message}</div>
//                   <small className="text-muted" style={{ fontSize: '0.7rem' }}>
//                     {new Date(msg.timestamp).toLocaleTimeString()}
//                   </small>
//                 </div>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </CCardBody>
//           <CCardFooter>
//             <CInputGroup>
//               <CFormInput
//                 placeholder="Type your message..."
//                 value={chatInput}
//                 onChange={(e) => setChatInput(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//               />
//               <CInputGroupText as="button" onClick={sendMessage}>
//                 <CIcon icon={cilSend} />
//               </CInputGroupText>
//             </CInputGroup>
//           </CCardFooter>
//         </CCard>
//       </CCollapse>

//       <CToaster />
//     </>
//   )
// }

// export default Dashboard

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import {
  CAvatar, CButton, CCard, CCardBody, CCardHeader, CCardFooter,
  CFormInput, CFormSelect, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CPagination,
  CPaginationItem, CCollapse, CInputGroup, CInputGroupText,
  CBadge, CSpinner, CModal, CModalHeader, CModalBody,
  CModalTitle, CModalFooter, CToast, CToastBody, CToaster
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilPencil, cilTrash, cilChatBubble, cilSend, cilCloudDownload, cilSearch } from '@coreui/icons'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import WidgetsBrand from '../widgets/WidgetsBrand'
import MainChart from './MainChart'
import StateDropdown from '../pages/profile/stateDropdown'
import { TextField } from '@mui/material'

const socket = io('http://localhost:3002', { transports: ['websocket'] })

const Dashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [userData, setUserData] = useState(null)
  const [chatVisible, setChatVisible] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef(null)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({})

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
    if (!token) {
      navigate('/login')
      return
    }
    fetchCurrentUser()
    fetchUsers()
  }, [token])

  // ---------------- CHAT SETUP ----------------
  useEffect(() => {
    socket.on('receive-message', (msg) => {
      setChatMessages((prev) => [...prev, msg])
    })
    return () => socket.off('receive-message')
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const sendMessage = async () => {
    if (!chatInput.trim()) return
    const userMsg = { from: userData?.id || 'me', text: chatInput.trim(), timestamp: new Date().toISOString() }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput('')

    try {
      const res = await fetch(`${apiBase}/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      })
      const data = await res.json()
      const aiReply = {
        from: 'gemini',
        text: data.reply || "I'm not sure how to respond to that.",
        timestamp: new Date().toISOString(),
      }
      setChatMessages((prev) => [...prev, aiReply])
    } catch (error) {
      console.error('Chat error:', error)
    }
  }

  // ---------------- USER MANAGEMENT ----------------
  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
      state: user.state_name ? { state_name: user.state_name } : null,
      city: user.city || '',
      photoPreview: user.photo ? `${baseUploadUrl}${user.photo}` : null,
    })
    setEditModal(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleUpdateUser = async () => {
    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        if (key === 'state') formDataToSend.append('state_name', formData.state.state_name)
        else formDataToSend.append(key, formData[key])
      }
    })

    await fetch(`${apiBase}/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formDataToSend,
    })
    setEditModal(false)
    fetchUsers()
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setDeleteModal(true)
  }

  const confirmDelete = async () => {
    await fetch(`${apiBase}/users/${selectedUser.id}`, { method: 'DELETE', headers })
    setDeleteModal(false)
    fetchUsers()
  }

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading)
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <div>Loading...</div>
      </div>
    )

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4>Welcome, {userData?.fullName || 'User'}</h4>
            <small className="text-muted">Your Dashboard Overview</small>
          </div>
          <CButton color="info" onClick={() => setChatVisible(!chatVisible)}>
            <CIcon icon={cilChatBubble} className="me-2" /> Chat with AI
          </CButton>
        </CCardHeader>
        <CCardBody><MainChart /></CCardBody>
        <CCardFooter><WidgetsBrand withCharts /></CCardFooter>
      </CCard>

      {/* Chat Box */}
      <CCollapse visible={chatVisible}>
        <CCard className="shadow mb-4">
          <CCardHeader>🤖 Gemini AI Chat</CCardHeader>
          <CCardBody style={{ height: '250px', overflowY: 'auto', background: '#f9fafb' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`mb-2 d-flex ${msg.from === 'gemini' ? 'justify-content-start' : 'justify-content-end'}`}>
                <div className={`p-2 rounded-3 ${msg.from === 'gemini' ? 'bg-light border' : 'bg-primary text-white'}`}>
                  <strong>{msg.from === 'gemini' ? 'Gemini' : 'You'}</strong>
                  <div>{msg.text}</div>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </CCardBody>
          <CCardFooter>
            <CInputGroup>
              <CFormInput
                placeholder="Ask Gemini something..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <CInputGroupText as="button" onClick={sendMessage}>
                <CIcon icon={cilSend} />
              </CInputGroupText>
            </CInputGroup>
          </CCardFooter>
        </CCard>
      </CCollapse>
    </>
  )
}

export default Dashboard
