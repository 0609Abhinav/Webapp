// import React, { useEffect, useState, useRef } from 'react'
// import io from 'socket.io-client'
// import {
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CCardFooter,
//   CListGroup,
//   CListGroupItem,
//   CRow,
//   CCol,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CAvatar,
//   CButton,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilSend } from '@coreui/icons'

// const socket = io('http://localhost:3002', { transports: ['websocket'] })

// const Chat = () => {
//   const [users, setUsers] = useState([]) // All registered users
//   const [selectedUser, setSelectedUser] = useState(null) // Current chat user
//   const [messages, setMessages] = useState([]) // Messages with selected user
//   const [input, setInput] = useState('') // Chat input
//   const chatEndRef = useRef(null)
//   const token = localStorage.getItem('token')

//   const headers = { Authorization: `Bearer ${token}` }

//   // -------------------- Fetch all users --------------------
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch('http://localhost:3002/api/users', { headers })
//       const json = await res.json()
//       if (json.status === 'success') setUsers(json.data || [])
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   // -------------------- Socket.IO --------------------
//   useEffect(() => {
//     const userId = localStorage.getItem('userId') // Current logged-in user
//     if (!userId) return

//     // Register user with socket
//     socket.emit('register', userId)

//     // Receive private messages
//     socket.on('privateMessage', (msg) => {
//       // Only add messages from/to selected user
//       if (selectedUser && (msg.from === selectedUser.id || msg.to === selectedUser.id)) {
//         setMessages((prev) => [...prev, msg])
//       }
//     })

//     return () => {
//       socket.off('privateMessage')
//     }
//   }, [selectedUser])

//   // Scroll to bottom on new message
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // -------------------- Send message --------------------
//   const sendMessage = () => {
//     if (!input.trim() || !selectedUser) return

//     const from = localStorage.getItem('userId')
//     const msg = { from, to: selectedUser.id, message: input.trim(), timestamp: new Date().toISOString() }
//     socket.emit('privateMessage', msg)
//     setMessages((prev) => [...prev, msg])
//     setInput('')
//   }

//   return (
//     <CRow>
//       {/* -------------------- User List -------------------- */}
//       <CCol xs={12} md={3}>
//         <CCard className="mb-4 shadow-sm">
//           <CCardHeader>User List</CCardHeader>
//           <CCardBody style={{ maxHeight: '600px', overflowY: 'auto' }}>
//             <CListGroup>
//               {users.map((user) => (
//                 <CListGroupItem
//                   key={user.id}
//                   active={selectedUser?.id === user.id}
//                   onClick={() => {
//                     setSelectedUser(user)
//                     setMessages([]) // Clear previous messages for demo; you can fetch history
//                   }}
//                   className="d-flex align-items-center"
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <CAvatar src={`http://localhost:3002/uploads/${user.photo}`} size="md" className="me-2">
//                     {user.photo ? null : user.fullName[0]}
//                   </CAvatar>
//                   <span>{user.fullName}</span>
//                 </CListGroupItem>
//               ))}
//             </CListGroup>
//           </CCardBody>
//         </CCard>
//       </CCol>

//       {/* -------------------- Chat Box -------------------- */}
//       <CCol xs={12} md={9}>
//         <CCard className="mb-4 shadow-sm">
//           {selectedUser ? (
//             <>
//               <CCardHeader className="d-flex align-items-center">
//                 <CAvatar
//                   src={`http://localhost:3002/uploads/${selectedUser.photo}`}
//                   size="md"
//                   className="me-2"
//                 >
//                   {selectedUser.photo ? null : selectedUser.fullName[0]}
//                 </CAvatar>
//                 <strong>{selectedUser.fullName}</strong>
//               </CCardHeader>
//               <CCardBody
//                 style={{ maxHeight: '500px', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '10px' }}
//               >
//                 {messages.map((msg, idx) => {
//                   const isMe = msg.from === localStorage.getItem('userId')
//                   return (
//                     <div
//                       key={idx}
//                       className={`mb-2 d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
//                     >
//                       <div
//                         className={`p-2 rounded-3 ${isMe ? 'bg-primary text-white' : 'bg-light border'}`}
//                         style={{ maxWidth: '70%' }}
//                       >
//                         <div>{msg.message}</div>
//                         <small className="text-muted" style={{ fontSize: '0.7rem' }}>
//                           {new Date(msg.timestamp).toLocaleTimeString()}
//                         </small>
//                       </div>
//                     </div>
//                   )
//                 })}
//                 <div ref={chatEndRef}></div>
//               </CCardBody>
//               <CCardFooter>
//                 <CInputGroup>
//                   <CFormInput
//                     placeholder="Type your message..."
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                   />
//                   <CInputGroupText as="button" onClick={sendMessage}>
//                     <CIcon icon={cilSend} />
//                   </CInputGroupText>
//                 </CInputGroup>
//               </CCardFooter>
//             </>
//           ) : (
//             <CCardBody>
//               <div className="text-center text-muted py-5">
//                 <CIcon icon={cilChatBubble} size="lg" className="mb-2" />
//                 <div>Select a user to start chatting</div>
//               </div>
//             </CCardBody>
//           )}
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default Chat
