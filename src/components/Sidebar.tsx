
const mockSessions = ['Session 1', 'Session 2', 'Session 3']

export default function Sidebar() {
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
