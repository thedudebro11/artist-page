export default function StatusBar({ light = false }) {
  const color = light ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.9)'

  return (
    <div className="status-bar" style={{ color }}>
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px', fontFamily: 'DM Sans' }}>
        9:00
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
          {[4, 6, 9, 12].map((h, i) => (
            <div key={i} style={{
              width: 3, height: h,
              background: i < 3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              borderRadius: 1
            }} />
          ))}
        </div>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.5C8.55 10.5 9 10.05 9 9.5C9 8.95 8.55 8.5 8 8.5C7.45 8.5 7 8.95 7 9.5C7 10.05 7.45 10.5 8 10.5Z" fill="currentColor"/>
          <path d="M5.5 7.5C6.2 6.8 7.05 6.5 8 6.5C8.95 6.5 9.8 6.8 10.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          <path d="M3 5C4.35 3.65 6.1 3 8 3C9.9 3 11.65 3.65 13 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
        </svg>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <div style={{
            width: 25, height: 12,
            border: '1.5px solid rgba(255,255,255,0.7)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', left: 2, top: 2, bottom: 2,
              width: '68%',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 1
            }} />
          </div>
          <div style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: '0 1px 1px 0' }} />
        </div>
      </div>
    </div>
  )
}
