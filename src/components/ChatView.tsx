import { useState, type KeyboardEvent } from 'react'
import BrainThinking from './BrainThinking'

export interface Message {
  id: number
  text: string
  sender: 'bot' | 'user'
}

const models = ['OpenAI', 'Claude', 'Gemini'] as const

type ModelState = Record<(typeof models)[number], 'thinking' | 'done'>

function randomDelay() {
  return Math.floor(Math.random() * 2000) + 1000 // 1-3 seconds
}

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! Ask me anything.', sender: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState<ModelState | null>(null)

  const handleSend = () => {
    if (!input.trim()) return
    const prompt = input
    const userMessage: Message = {
      id: messages.length + 1,
      text: prompt,
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

    const thinkingPromises = models.map(
      (model) =>
        new Promise<void>((resolve) => {
          const delay = randomDelay()
          setTimeout(() => {
            setThinking((t) => (t ? { ...t, [model]: 'done' } : t))
            resolve()
          }, delay)
        }),
    )

    Promise.all(thinkingPromises).then(() => {
      const gather: Message = {
        id: Date.now(),
        text: 'gathering responses',
        sender: 'bot',
      }
      setMessages((m) => [...m, gather])

      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: `Echo: ${prompt}`,
          sender: 'bot',
        }
        setMessages((m) => [...m, botMessage])
      }, 1000)
    })
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
