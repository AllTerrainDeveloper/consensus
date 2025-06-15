import { useState } from 'react'
import './App.css'

const mockSessions = ['Session 1', 'Session 2', 'Session 3']

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Consensus AI</h2>
      <div className="session-list">
        {mockSessions.map((s) => (
          <div key={s} className="session-item">
            {s}
          </div>
        ))}
      </div>
      <div className="section">
        <div className="session-item">Settings</div>
        <div className="session-item">Profile</div>
      </div>
    </aside>
  )
}

function ChatView() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! Ask me anything.', sender: 'bot' },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage = { id: messages.length + 1, text: input, sender: 'user' }
    setMessages((m) => [...m, userMessage])
    setInput('')
    setTimeout(() => {
      const botMessage = { id: Date.now(), text: `Echo: ${input}`, sender: 'bot' }
      setMessages((m) => [...m, botMessage])
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="chat-container">
      <div className="chat-header">Welcome to Consensus AI</div>
      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.sender}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <ChatView />
    </div>
  )
}
