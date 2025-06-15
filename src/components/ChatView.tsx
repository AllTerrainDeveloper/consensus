import { useState, type KeyboardEvent } from 'react'
import BrainThinking from './BrainThinking'

const models = ['OpenAI', 'Claude', 'Gemini'] as const
type ModelState = Record<(typeof models)[number], 'thinking' | 'done'>

function randomDelay() {
  return Math.floor(Math.random() * 2000) + 1000 // 1-3 seconds
}

export type Message =
  | {
      id: number
      type: 'text'
      text: string
      sender: 'bot' | 'user'
    }
  | {
      id: number
      type: 'brains'
      states: ModelState
    }

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'text', text: 'Hello! Ask me anything.', sender: 'bot' },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const prompt = input
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'text',
      text: prompt,
      sender: 'user',
    }

    const initial: ModelState = {
      OpenAI: 'thinking',
      Claude: 'thinking',
      Gemini: 'thinking',
    }

    const brainsId = Date.now()
    const brainsMessage: Message = {
      id: brainsId,
      type: 'brains',
      states: initial,
    }

    setMessages((m) => [...m, userMessage, brainsMessage])
    setInput('')

    const thinkingPromises = models.map(
      (model) =>
        new Promise<void>((resolve) => {
          const delay = randomDelay()
          setTimeout(() => {
            setMessages((msgs) =>
              msgs.map((msg) =>
                msg.id === brainsId && msg.type === 'brains'
                  ? { ...msg, states: { ...msg.states, [model]: 'done' } }
                  : msg,
              ),
            )
            resolve()
          }, delay)
        }),
    )

    Promise.all(thinkingPromises).then(() => {
      const gather: Message = {
        id: Date.now(),
        type: 'text',
        text: 'gathering responses',
        sender: 'bot',
      }
      setMessages((m) => [...m, gather])

      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now() + 1,
          type: 'text',
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
        {messages.map((m) =>
          m.type === 'text' ? (
            <div key={m.id} className={`message ${m.sender}`}>
              {m.text}
            </div>
          ) : (
            <div key={m.id} className="thinking-container">
              {models.map((model) => (
                <BrainThinking key={model} label={model} state={m.states[model]} />
              ))}
            </div>
          ),
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
