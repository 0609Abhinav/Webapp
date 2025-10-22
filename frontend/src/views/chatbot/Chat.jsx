import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import Picker from "emoji-picker-react";
import CIcon from "@coreui/icons-react";
import { cilChatBubble, cilMoon, cilSun } from "@coreui/icons";
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
  CBadge,
} from "@coreui/react";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState(new Map());
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [myAvatarUrl, setMyAvatarUrl] = useState(null);

  const socket = useRef();
  const selectedUserRef = useRef(null);
  const loggedInUserId = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef();

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      loggedInUserId.current = payload.id;
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  const apiBase = "http://localhost:3002/api";
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (!token) return;
        const res = await axios.get(`${apiBase}/users/me`, { headers });
        const userData = res.data.data;
        setMyAvatarUrl(
          userData.photo ? `http://localhost:3002/uploads/${userData.photo}` : null
        );
      } catch (err) {
        console.error("Failed to fetch avatar:", err);
        setMyAvatarUrl(null);
      }
    };
    fetchAvatar();
  }, []);

  useEffect(() => {
    if (!loggedInUserId.current) return;
    socket.current = io("http://localhost:3002", { transports: ["websocket"] });
    socket.current.emit("init", { userId: loggedInUserId.current });

    socket.current.on("online-users", (onlineMap) => {
      setConnectedUsers(new Map(Object.entries(onlineMap)));
    });

    socket.current.on("receive-message", (msg) => {
      if (
        selectedUserRef.current &&
        (msg.from === selectedUserRef.current.id || msg.to === selectedUserRef.current.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.from]: (prev[msg.from] || 0) + 1,
        }));
      }
    });

    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiBase}/users`, { headers });
        const json = await res.json();
        if (json.status === "success") {
          const filtered = json.data.filter((u) => u.id !== loggedInUserId.current);
          setUsers(filtered);
          setFilteredUsers(filtered);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const fetchMessages = async (user) => {
    if (!user) return;
    try {
      const res = await fetch(
        `${apiBase}/messages?fromUserId=${loggedInUserId.current}&toUserId=${user.id}`,
        { headers }
      );
      const json = await res.json();
      if (json.status === "success") setMessages(json.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    selectedUserRef.current = user;
    fetchMessages(user);
    setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFilesToUpload((prev) => [...prev, file]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && filesToUpload.length === 0) return;
    if (!selectedUser) return;

    const formData = new FormData();
    formData.append("fromUserId", loggedInUserId.current);
    formData.append("toUserId", selectedUser.id);
    formData.append("text", newMessage.trim() || "");
    filesToUpload.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(`${apiBase}/messages/sent`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        const messageFromServer = data.data;
        socket.current.emit("chatMessage", {
          from: messageFromServer.fromUserId,
          to: messageFromServer.toUserId,
          message: messageFromServer.messages,
          files: messageFromServer.files,
          timestamp: messageFromServer.timestamp,
          fromUser: messageFromServer.fromUser,
          toUser: messageFromServer.toUser,
        });
        setMessages((prev) => [...prev, messageFromServer]);
        setNewMessage("");
        setFilesToUpload([]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const renderMessage = (msg, idx) => {
    const isMine = msg.from === loggedInUserId.current;
    const avatarSrc = isMine
      ? myAvatarUrl || "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
      : selectedUser?.photo
      ? `http://localhost:3002/uploads/${selectedUser.photo}`
      : "";
    const senderInitial = isMine ? "Me" : selectedUser?.fullName?.[0];

    return (
      <div
        key={idx}
        className={`d-flex mb-2 ${isMine ? "justify-content-end" : "justify-content-start"}`}
      >
        {!isMine && (
          <CAvatar
            src={avatarSrc}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
              overflow: "hidden",
              marginRight: "8px",
              flexShrink: 0,
            }}
          >
            {!selectedUser?.photo && senderInitial}
          </CAvatar>
        )}
        <div
          style={{
            maxWidth: "70%",
            background: isMine
              ? "linear-gradient(135deg, #007bff, #0dcaf0)"
              : darkMode
              ? "#333"
              : "#f1f1f1",
            color: isMine ? "#fff" : darkMode ? "#fff" : "#000",
            borderRadius: "18px",
            padding: "10px 14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div>{msg.message || msg.text}</div>
          {msg.files && msg.files.length > 0 && (
            <div className="mt-2 d-flex flex-wrap">
              {msg.files.map((file, idx) => {
                const fileUrl = file.startsWith("http") ? file : `http://localhost:3002/${file}`;
                return (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginRight: "6px",
                      marginBottom: "6px",
                      display: "inline-block",
                    }}
                  >
                    {file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      <img
                        src={fileUrl}
                        alt="attachment"
                        style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        style={{
                          padding: "4px 8px",
                          background: "#ccc",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        File
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          )}
          <div
            style={{
              fontSize: "10px",
              textAlign: "right",
              marginTop: "4px",
              opacity: 0.6,
            }}
          >
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
        {isMine && (
          <CAvatar
            src={avatarSrc}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
              overflow: "hidden",
              marginLeft: "8px",
              flexShrink: 0,
            }}
          >
            {senderInitial}
          </CAvatar>
        )}
      </div>
    );
  };

  return (
    <div className={`vh-100 p-3 ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
      <CRow className="h-100">
        <CCol xs={3}>
          <CCard
            className={`h-100 border-0 shadow-sm rounded-4 ${
              darkMode ? "bg-secondary text-white" : "bg-white"
            }`}
          >
            <CCardHeader
              className={`d-flex align-items-center justify-content-between rounded-top-4 ${
                darkMode ? "bg-dark text-white" : "bg-primary text-white"
              }`}
            >
              <div className="d-flex align-items-center">
                <CIcon icon={cilChatBubble} className="me-2" />
                <span style={{ fontWeight: 200 }}>Chats</span>
              </div>
              <CButton
                size="sm"
                color={darkMode ? "light" : "dark"}
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Dark Mode"
              >
                <CIcon icon={darkMode ? cilSun : cilMoon} />
              </CButton>
            </CCardHeader>

            <CCardBody>
              <CFormInput
                placeholder="Search users..."
                onChange={(e) =>
                  setFilteredUsers(
                    users.filter((u) =>
                      u.fullName.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                  )
                }
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
                    className={`d-flex align-items-center justify-content-between py-2 border-0 ${
                      darkMode ? "bg-dark text-white" : "bg-light text-dark"
                    }`}
                    style={{
                      cursor: "pointer",
                      borderRadius: "12px",
                      marginBottom: "6px",
                      transition: "background 0.2s",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <CAvatar
                        src={user.photo ? `http://localhost:3002/uploads/${user.photo}` : ""}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          overflow: "hidden",
                          marginRight: "10px",
                          flexShrink: 0,
                        }}
                      >
                        {!user.photo && user.fullName?.[0]}
                      </CAvatar>
                      <div>
                        <div style={{ fontWeight: "500", fontSize: "14px" }}>{user.fullName}</div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: connectedUsers.has(String(user.id)) ? "lightgreen" : "gray",
                          }}
                        >
                          {connectedUsers.has(String(user.id)) ? "● Online" : "● Offline"}
                        </div>
                      </div>
                    </div>
                    {unreadCounts[user.id] > 0 && (
                      <CBadge color="danger" shape="rounded-pill">
                        {unreadCounts[user.id]}
                      </CBadge>
                    )}
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={9}>
          <CCard
            className={`h-100 d-flex flex-column shadow-sm border-0 rounded-4 ${
              darkMode ? "bg-dark text-white" : "bg-white"
            }`}
          >
            <CCardHeader
              className={`d-flex align-items-center ${
                darkMode ? "bg-secondary text-white" : "bg-light"
              }`}
              style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
            >
              {selectedUser ? (
                <div className="d-flex align-items-center">
                  <CAvatar
                    src={
                      selectedUser.photo
                        ? `http://localhost:3002/uploads/${selectedUser.photo}`
                        : ""
                    }
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      overflow: "hidden",
                      marginRight: "10px",
                    }}
                  >
                    {!selectedUser.photo && selectedUser.fullName?.[0]}
                  </CAvatar>
                  <div>
                    <strong>{selectedUser.fullName}</strong>
                    <div
                      style={{
                        fontSize: "12px",
                        color: connectedUsers.has(String(selectedUser.id))
                          ? "lightgreen"
                          : "gray",
                      }}
                    >
                      {connectedUsers.has(String(selectedUser.id)) ? "● Online" : "● Offline"}
                    </div>
                  </div>
                </div>
              ) : (
                <span>Select a user to start chat</span>
              )}
            </CCardHeader>

            <CCardBody className="flex-grow-1 overflow-auto p-3 d-flex flex-column">
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </CCardBody>

            {selectedUser && (
              <div className="p-2 border-top position-relative">
                {filesToUpload.length > 0 && (
                  <div className="mb-2 d-flex flex-wrap">
                    {filesToUpload.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: "relative",
                          marginRight: "6px",
                          marginBottom: "6px",
                        }}
                      >
                        {file.type.startsWith("image") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              padding: "4px 8px",
                              background: "#ccc",
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}
                          >
                            {file.name}
                          </span>
                        )}
                        <CButton
                          size="sm"
                          color="danger"
                          shape="rounded-circle"
                          style={{ position: "absolute", top: "-5px", right: "-5px" }}
                          onClick={() =>
                            setFilesToUpload((prev) => prev.filter((_, i) => i !== idx))
                          }
                        >
                          ✕
                        </CButton>
                      </div>
                    ))}
                  </div>
                )}
                <div className="d-flex align-items-center">
                  <CButton
                    color={darkMode ? "secondary" : "light"}
                    className="me-2"
                    onClick={() => fileInputRef.current.click()}
                  >
                    📎
                  </CButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <CFormInput
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    style={{
                      borderRadius: "12px",
                      backgroundColor: darkMode ? "#333" : "#fff",
                      color: darkMode ? "#fff" : "#000",
                    }}
                  />
                  <CButton
                    color={darkMode ? "secondary" : "light"}
                    className="ms-2"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    😊
                  </CButton>
                  <CButton color="primary" className="ms-2" onClick={handleSendMessage}>
                    Send
                  </CButton>
                </div>

                {showEmojiPicker && (
                  <div
                    style={{ position: "absolute", bottom: "60px", right: "20px", zIndex: 1000 }}
                  >
                    <Picker
                      onEmojiClick={(emojiObject) =>
                        setNewMessage((prev) => prev + emojiObject.emoji)
                      }
                      height={350}
                    />
                  </div>
                )}
              </div>
            )}
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Chat;
