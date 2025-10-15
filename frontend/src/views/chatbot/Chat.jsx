import React, { useEffect, useState, useRef } from "react"
import io from "socket.io-client"
import CIcon from "@coreui/icons-react"
import { cilChatBubble } from "@coreui/icons"
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CListGroup,
  CListGroupItem,
  CAvatar,
  CFormInput,
  CButton,
} from "@coreui/react"

const Chat = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const socket = useRef()
  const token = localStorage.getItem("token")
  let loggedInUserId = null

  // Decode token manually
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      loggedInUserId = payload.id // adjust according to your JWT payload
    } catch (err) {
      console.error("Failed to decode token:", err)
    }
  }

  const apiBase = "http://localhost:3002/api"
  const headers = { Authorization: `Bearer ${token}` }

  // -------------------- Initialize Socket --------------------
  useEffect(() => {
    if (!loggedInUserId) return

    socket.current = io("http://localhost:3002", { transports: ["websocket"] })

    socket.current.emit("init", { userId: loggedInUserId })

    socket.current.on("receive-message", (msg) => {
      if (
        selectedUser &&
        (msg.from === selectedUser.id || msg.to === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, msg])
      }
    })

    return () => socket.current.disconnect()
  }, [loggedInUserId, selectedUser])

  // -------------------- Fetch Users --------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiBase}/users`, { headers })
        const json = await res.json()
        if (json.status === "success") {
          const filtered = json.data.filter((user) => user.id !== loggedInUserId)
          setUsers(filtered)
          setFilteredUsers(filtered)
        }
      } catch (err) {
        console.error(err)
      }
    }
    if (loggedInUserId) fetchUsers()
  }, [apiBase, headers, loggedInUserId])

  // -------------------- Fetch Messages --------------------
  const fetchMessages = async (user) => {
    if (!user || !loggedInUserId) return
    try {
      const res = await fetch(
        `${apiBase}/messages?fromUserId=${loggedInUserId}&toUserId=${user.id}`,
        { headers }
      )
      const json = await res.json()
      if (json.status === "success") {
        setMessages(json.data || [])
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
    }
  }

  // -------------------- Handle Search --------------------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredUsers(filtered)
  }

  // -------------------- Handle Select User --------------------
  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setMessages([]) // Clear previous messages
    fetchMessages(user)
  }

  // -------------------- Handle Send Message --------------------
  const handleSendMessage = async () => {
    if (!newMessage || !selectedUser || !loggedInUserId) return

    const msgPayload = {
      fromUserId: loggedInUserId,
      toUserId: selectedUser.id,
      text: newMessage,
    }

    try {
      // Send via REST to store in DB
      await fetch(`${apiBase}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(msgPayload),
      })

      // Send via WebSocket
      socket.current.emit("chatMessage", {
        from: loggedInUserId,
        to: selectedUser.id,
        message: newMessage,
        timestamp: new Date(),
      })

      setMessages((prev) => [
        ...prev,
        {
          from: loggedInUserId,
          to: selectedUser.id,
          text: newMessage,
          timestamp: new Date(),
        },
      ])
      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  return (
    <CRow className="h-100">
      {/* Users List */}
      <CCol xs={3}>
        <CCard className="h-100">
          <CCardHeader className="d-flex align-items-center justify-content-between">
            <CIcon icon={cilChatBubble} className="me-2" />
            <span>Users</span>
          </CCardHeader>
          <CCardBody className="d-flex flex-column">
            <CFormInput
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="mb-3"
              style={{ borderRadius: "12px" }}
            />
            <CListGroup flush>
              {filteredUsers.map((user) => (
                <CListGroupItem
                  key={user.id}
                  action
                  active={selectedUser?.id === user.id}
                  onClick={() => handleSelectUser(user)}
                  className="d-flex align-items-center py-2"
                  style={{ cursor: "pointer" }}
                >
                  <CAvatar
                    src={user.photo ? `http://localhost:3002/uploads/${user.photo}` : ""}
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  >
                    {!user.photo && user.fullName?.[0]}
                  </CAvatar>
                  <span style={{ fontWeight: "500", fontSize: "14px" }}>{user.fullName}</span>
                </CListGroupItem>
              ))}
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Chat Window */}
      <CCol xs={9}>
        <CCard className="h-100 d-flex flex-column">
          <CCardHeader>
            {selectedUser ? (
              <div className="d-flex align-items-center">
                <CAvatar
                  src={selectedUser.photo ? `http://localhost:3002/uploads/${selectedUser.photo}` : ""}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                >
                  {!selectedUser.photo && selectedUser.fullName?.[0]}
                </CAvatar>
                <strong>{selectedUser.fullName}</strong>
              </div>
            ) : (
              <span>Select a user to chat</span>
            )}
          </CCardHeader>
          <CCardBody
            className="flex-grow-1 overflow-auto p-3 d-flex flex-column"
            style={{ maxHeight: "500px" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="d-flex mb-2"
                style={{
                  justifyContent: msg.from === loggedInUserId ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                }}
              >
                {msg.from !== loggedInUserId && selectedUser && (
                  <CAvatar
                    src={selectedUser.photo ? `http://localhost:3002/uploads/${selectedUser.photo}` : ""}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "6px",
                    }}
                  >
                    {!selectedUser.photo && selectedUser.fullName?.[0]}
                  </CAvatar>
                )}
                <div
                  style={{
                    maxWidth: "70%",
                    backgroundColor: msg.from === loggedInUserId ? "#3b82f6" : "#f3f4f6",
                    color: msg.from === loggedInUserId ? "#fff" : "#111827",
                    borderRadius: "12px",
                    padding: "8px",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                  <div
                    style={{
                      fontSize: "10px",
                      marginTop: "4px",
                      textAlign: "right",
                      color:
                        msg.from === loggedInUserId ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </CCardBody>
          {selectedUser && (
            <div className="d-flex p-2 border-top">
              <CFormInput
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                style={{ borderRadius: "12px" }}
              />
              <CButton color="primary" className="ms-2" onClick={handleSendMessage}>
                Send
              </CButton>
            </div>
          )}
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Chat
