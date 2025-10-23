import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CBadge,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilChatBubble,
  cilSend,
  cilCloudDownload,
  cilPencil,
  cilTrash,
} from '@coreui/icons'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import WidgetsBrand from '../widgets/WidgetsBrand'
import MainChart from './MainChart'

const Dashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [userData, setUserData] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // AI Chatbot state
  const [aiVisible, setAiVisible] = useState(false)
  const [aiMessages, setAiMessages] = useState([])
  const [aiInput, setAiInput] = useState('')
  const aiEndRef = useRef(null)
  const [sending, setSending] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const apiBase = 'http://localhost:3002/api'
  const baseUploadUrl = 'http://localhost:3002/uploads/'
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  // Scroll AI chat window
  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  // Add bounce animation CSS dynamically
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // Fetch current user
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

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
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
  }, [token, fetchCurrentUser, fetchUsers])

  // Pagination
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentUsers = users.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(users.length / itemsPerPage)

  // Send message to Gemini AI
  const sendAiMessage = async () => {
    if (!aiInput.trim()) return
    const userMsg = { role: 'user', text: aiInput }
    setAiMessages((prev) => [...prev, userMsg])
    setAiInput('')
    setSending(true)
    try {
      const res = await fetch(`${apiBase.replace('/api', '')}/api/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      })
      const data = await res.json()
      const botReply = data.reply || 'Sorry, I could not understand that.'
      setAiMessages((prev) => [...prev, { role: 'bot', text: botReply }])
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        { role: 'bot', text: '⚠️ AI service is currently unavailable.' },
      ])
    } finally {
      setSending(false)
    }
  }

  // ------------------ UI ------------------
  if (loading)
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <div>Loading...</div>
      </div>
    )

  if (error)
    return (
      <div className="text-center p-5 text-danger">
        <h5>Error:</h5>
        <p>{error}</p>
      </div>
    )

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Welcome, {userData?.fullName || 'User'}</h4>
            <small className="text-muted">Your Dashboard Overview</small>
          </div>
          <CButton
            color="danger"
            variant="outline"
            onClick={() => {
              localStorage.removeItem('token')
              navigate('/login')
            }}
          >
            <CIcon icon={cilCloudDownload} className="me-2" />
            Logout
          </CButton>
        </CCardHeader>
        <CCardBody>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <WidgetsBrand withCharts />
        </CCardFooter>
      </CCard>

      {/* ---------------- USERS LIST ---------------- */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader>
          <h5 className="mb-0">📋 Registered Users</h5>
        </CCardHeader>
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
                  <CTableDataCell>
                    <CAvatar
                      src={
                        user.photo
                          ? `${baseUploadUrl}${user.photo}`
                          : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                      }
                       style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      overflow: "hidden",
                    }}
                      size="md"
                    />
                  </CTableDataCell>
                  <CTableDataCell>{user.fullName}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={user.gender === 'Male' ? 'info' : 'danger'}>
                      {user.gender}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{user.state_name}</CTableDataCell>
                  <CTableDataCell>{user.city}</CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" color="warning" className="me-2">
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton size="sm" color="danger">
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <div className="d-flex justify-content-center mt-3">
            <CPagination>
              {[...Array(totalPages)].map((_, idx) => (
                <CPaginationItem
                  key={idx}
                  active={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </div>
        </CCardBody>
      </CCard>

      {/* ---------------- FLOATING AI CHATBOT ---------------- */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1050,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              backgroundColor: '#333',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            💬 Ask AI Assistant
          </div>
        )}

        <CButton
          color="info"
          shape="rounded-circle"
          style={{
            width: '60px',
            height: '60px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'bounce 2s infinite',
            transition: 'transform 0.3s ease',
          }}
          onClick={() => setAiVisible(!aiVisible)}
        >
          <CIcon icon={cilChatBubble} size="lg" />
        </CButton>
      </div>

      {/* Chat Panel */}
      {aiVisible && (
        <div
          className="shadow-lg border rounded-3"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '420px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1050,
            transform: aiVisible ? 'scale(1)' : 'scale(0.95)',
            opacity: aiVisible ? 1 : 0,
            transition: 'all 0.25s ease-in-out',
          }}
        >
          <div
            style={{
              backgroundColor: '#074d7fff',
              color: 'white',
              padding: '10px',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              textAlign: 'center',
            }}
          >
           <h4>🤖 AI Assistant</h4> 
          </div>
          <div
            style={{
              flex: 1,
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: '#f9fafb',
            }}
          >
            {aiMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 d-flex ${
                  msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'
                }`}
              >
                <div
                  className={`p-2 rounded-3 ${
                    msg.role === 'user' ? 'bg-primary text-white' : 'bg-light border'
                  }`}
                  style={{ maxWidth: '80%' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={aiEndRef} />
          </div>
          <div
            style={{
              borderTop: '1px solid #c91b1bff',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CFormInput
              placeholder="Ask AI..."
              value={aiInput}
              disabled={sending}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendAiMessage()}
            />
            <CButton color="info" className="ms-2" disabled={sending} onClick={sendAiMessage}>
              <CIcon icon={cilSend} />
            </CButton>
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard
