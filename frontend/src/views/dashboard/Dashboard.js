import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
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
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CRow,
  CCol,
  CProgress,
  CCollapse,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilUserFemale,
  cilPencil,
  cilTrash,
  cilArrowTop,
  cilArrowBottom,
  cilChatBubble,
  cilSend,
  cilCloudDownload,
} from '@coreui/icons'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import WidgetsBrand from '../widgets/WidgetsBrand'
import MainChart from './MainChart'

// ---------------- SOCKET SETUP ----------------
const socket = io('http://localhost:3002', { transports: ['websocket'] })

const Dashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [userData, setUserData] = useState(null)

  // Chat state
  const [chatVisible, setChatVisible] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef(null)

  // ---------------- CHAT SETUP ----------------
  useEffect(() => {
    if (!userData?.id) return

    // // Register user ID on socket connect
    // socket.emit('register', userData.id)

    socket.on('privateMessage', (msg) => {
      setChatMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off('privateMessage')
    }
  }, [userData])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const sendMessage = () => {
    if (!chatInput.trim() || !userData?.id) return
    const message = chatInput.trim()

    // Example: all users send messages to admin (id = 1)
    const msgData = { from: userData.id, to: 1, message }
    socket.emit('privateMessage', msgData)

    setChatMessages((prev) => [
      ...prev,
      { from: userData.id, message, timestamp: new Date().toISOString() },
    ])
    setChatInput('')
  }

  // ---------------- DASHBOARD DATA ----------------
  const apiBase = 'http://localhost:3002/api'
  const baseUploadUrl = 'http://localhost:3002/uploads/'
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/users/me`, { headers })
      const json = await res.json()
      if (json.status !== 'success') throw new Error(json.message)
      setUserData(json.data)
    } catch (err) {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [apiBase, headers, navigate])

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

  // ---------------- UI STATES ----------------
  if (loading)
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status" />
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

  // ---------------- RENDER ----------------
  return (
    <>
      <WidgetsDropdown className="mb-4" />

      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Welcome, {userData?.fullName || 'User'}</h4>
            <small className="text-muted">Your Dashboard Overview</small>
          </div>
          <div>
            <CButton
              color="info"
              variant="outline"
              className="me-2"
              onClick={() => setChatVisible(!chatVisible)}
            >
              <CIcon icon={cilChatBubble} className="me-2" />
              Chat with Admin
            </CButton>
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
          </div>
        </CCardHeader>

        <CCardBody>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <WidgetsBrand withCharts />
        </CCardFooter>
      </CCard>

      {/* Private Chat Box */}
      <CCollapse visible={chatVisible}>
        <CCard className="mb-4 shadow">
          <CCardHeader>💬 Private Chat with Admin</CCardHeader>
          <CCardBody
            style={{
              height: '250px',
              overflowY: 'auto',
              backgroundColor: '#f9fafb',
              padding: '10px',
            }}
          >
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 d-flex ${
                  msg.from === userData?.id
                    ? 'justify-content-end'
                    : 'justify-content-start'
                }`}
              >
                <div
                  className={`p-2 rounded-3 ${
                    msg.from === userData?.id
                      ? 'bg-primary text-white'
                      : 'bg-light border'
                  }`}
                  style={{ maxWidth: '70%' }}
                >
                  <strong>{msg.from === userData?.id ? 'You' : 'Admin'}</strong>
                  <div>{msg.message}</div>
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
                placeholder="Type your message..."
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
