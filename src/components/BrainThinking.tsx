
interface Props {
  label: string
  state: 'thinking' | 'done'
}

export default function BrainThinking({ label, state }: Props) {
  return (
    <div className="brain-wrapper">
      <div className="brain-icon">
        <span className="brain">🧠</span>
        <span className={`overlay ${state}`}>{state === 'done' ? '💡' : '⚙️'}</span>
      </div>
      <div className="brain-label">{label}</div>
    </div>
  )
}
