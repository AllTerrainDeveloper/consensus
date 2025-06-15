import { useState, type KeyboardEvent } from 'react'
import BrainThinking from './BrainThinking'

export interface Message {
  id: number
  text: string
  sender: 'bot' | 'user'
}

const models = ['OpenAI', 'Claude', 'Gemini'] as const

type ModelState = Record<(typeof models)[number], 'thinking' | 'done'>

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! Ask me anything.', sender: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState<ModelState | null>(null)

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
    }
    setMessages((m) => [...m, userMessage])
    setInput('')

    const initial: ModelState = {
      OpenAI: 'thinking',
      Claude: 'thinking',
      Gemini: 'thinking',
    }
    setThinking(initial)

    models.forEach((model, idx) => {
      setTimeout(() => {
        setThinking((t) => (t ? { ...t, [model]: 'done' } : t))
      }, 1500 + idx * 500)
    })

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now(),
        text: `Echo: ${input}`,
        sender: 'bot',
      }
      setThinking(null)
      setMessages((m) => [...m, botMessage])
    }, 3000)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
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
        {thinking && (
          <div className="thinking-container">
            {models.map((m) => (
              <BrainThinking key={m} label={m} state={thinking[m]} />
            ))}
          </div>
        )}
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
