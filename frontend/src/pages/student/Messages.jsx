import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Messages = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);

  useEffect(() => {
    loadChatUsers();
    startPolling();
    return () => stopPolling();
  }, []);

  const loadChatUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/messages/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setChatUsers(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load chat users:', error);
      setLoading(false);
    }
  };

  const loadMessages = async (receiverId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/messages/${receiverId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessages(response.data.data || []);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const startPolling = () => {
    // Poll for new messages every 3 seconds
    pollingInterval.current = setInterval(async () => {
      if (selectedChat) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/messages/${selectedChat.user_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const newMessages = response.data.data || [];
          // Only update if there are new messages
          if (newMessages.length > messages.length) {
            setMessages(newMessages);
            scrollToBottom();
          }
        } catch (error) {
          console.error('Polling failed:', error);
        }
      }
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/messages/send',
        {
          receiver_id: selectedChat.user_id,
          message: messageText
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMessageText('');
      // Reload messages immediately
      await loadMessages(selectedChat.user_id);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (tab, route) => {
    setActiveTab(tab);
    if (route) {
      navigate(route);
    }
  };

  const handleSelectChat = (chatUser) => {
    setSelectedChat(chatUser);
    loadMessages(chatUser.user_id);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🎓 CampusConnect</h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Student Portal</p>
        </div>
        <ul className="sidebar-menu">
          <li className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('dashboard', '/student/dashboard')}>📊 Dashboard</li>
          <li className={`sidebar-menu-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => handleNavigation('attendance', '/student/attendance')}>📅 Attendance</li>
          <li className={`sidebar-menu-item ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => handleNavigation('assignments', '/student/assignments')}>📚 Assignments</li>
          <li className={`sidebar-menu-item ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => handleNavigation('materials', '/student/materials')}>📖 Study Materials</li>
          <li className={`sidebar-menu-item ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => handleNavigation('grades', '/student/grades')}>🏆 Grades</li>
          <li className={`sidebar-menu-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => handleNavigation('messages', '/student/messages')}>💬 Messages</li>
          <li className="sidebar-menu-item" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">
          <div className="navbar-brand">Messages</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', height: 'calc(100vh - 140px)' }}>
          {/* Chat List */}
          <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', padding: '0 1rem' }}>Chats</h3>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
              ) : chatUsers.length > 0 ? (
                chatUsers.map((chatUser) => (
                  <div
                    key={chatUser.user_id}
                    onClick={() => handleSelectChat(chatUser)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      backgroundColor: selectedChat?.user_id === chatUser.user_id ? '#f3f4f6' : 'white',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedChat?.user_id === chatUser.user_id ? '#f3f4f6' : 'white'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.25rem'
                      }}>
                        {chatUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{chatUser.name}</strong>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>
                          {chatUser.role === 'faculty' ? 'Faculty' : 'Student'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
                  <p>No users available to chat</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h4>{selectedChat.name}</h4>
                </div>
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.message_id}
                        style={{
                          marginBottom: '1rem',
                          display: 'flex',
                          justifyContent: msg.sender_id === user.userId ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.75rem',
                            backgroundColor: msg.sender_id === (user?.userId ?? user?.id) ? '#3b82f6' : '#e5e7eb',
                            color: msg.sender_id === (user?.userId ?? user?.id) ? 'white' : '#1f2937'
                          }}
                        >
                          <p style={{ margin: 0, wordWrap: 'break-word' }}>{msg.content || msg.message_text}</p>
                          <p style={{ fontSize: '0.75rem', margin: '0.25rem 0 0 0', opacity: 0.7 }}>
                            {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: '#9ca3af' }}>No messages in this chat</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  />
                  <button type="submit" className="btn btn-primary">Send</button>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                  <h4>Select a chat to start messaging</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
