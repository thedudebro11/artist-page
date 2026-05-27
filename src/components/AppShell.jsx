import { motion } from 'framer-motion'
import { usePhoneStore } from '../store/phoneStore'
import StatusBar from './StatusBar'
import DynamicIsland from './DynamicIsland'

// App shell with slide-up animation
export default function AppShell({ title, children, bg = '#050505' }) {
  const goHome = usePhoneStore((s) => s.goHome)

  return (
    <motion.div
      key="app"
      initial={{ y: '100%', borderRadius: '54px' }}
      animate={{ y: 0, borderRadius: '54px' }}
      exit={{ y: '100%', borderRadius: '54px' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 30,
      }}
    >
      <DynamicIsland />
      <StatusBar />

      {/* Top bar */}
      <div className="app-topbar-blur" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 92,
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 20px 12px',
        justifyContent: 'space-between',
        zIndex: 5
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goHome}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--gold)',
            fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'DM Sans'
          }}
        >
          ‹ Home
        </motion.button>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.3 }}>
          {title}
        </span>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, marginTop: 92, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>

      <div className="home-indicator" />
    </motion.div>
  )
}
