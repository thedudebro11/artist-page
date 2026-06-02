import { motion } from 'framer-motion'
import { usePhoneStore } from '../store/phoneStore'
import StatusBar from './StatusBar'
import DynamicIsland from './DynamicIsland'

const APPS = [
  { id: 'music',    label: 'Music',    emoji: '🎵', gradient: 'linear-gradient(145deg, #c9200d, #f0491a)' },
  { id: 'videos',   label: 'Videos',   emoji: '▶',  gradient: 'linear-gradient(145deg, #1c1c1e, #3a3a3c)' },
  { id: 'gallery',  label: 'Gallery',  emoji: '📸', gradient: 'linear-gradient(145deg, #1d6fa4, #1fa2c0)' },
  { id: 'messages', label: '9 PM Notes', emoji: '💌', gradient: 'linear-gradient(145deg, #1a8a38, #30d158)' },
  { id: 'store',    label: 'Store',    emoji: '🛍️', gradient: 'linear-gradient(145deg, #4a35b0, #9b59f5)' },
  { id: 'connect',  label: 'Socials',  emoji: '🔗', gradient: 'linear-gradient(145deg, #0a5eb8, #0a84ff)' },
]

const DOCK_APPS = ['music', 'messages', 'store', 'connect']

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  }
}

export default function HomeScreen() {
  const openApp = usePhoneStore((s) => s.openApp)
  const screen = usePhoneStore((s) => s.screen)

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="home-wallpaper"
      style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        pointerEvents: screen === 'app' ? 'none' : 'auto'
      }}
    >
      {/* Artist background photo */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <img
          src="/artist-bg.png"
          alt=""
          draggable={false}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 10%',
            filter: 'brightness(0.42) contrast(1.05) saturate(0.9)',
            display: 'block', userSelect: 'none',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.82) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 50% at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 60%)',
        }} />
      </div>

      <DynamicIsland />
      <StatusBar />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: 60, padding: '0 24px', marginBottom: 8, position: 'relative', zIndex: 1 }}
      >
        <div style={{ fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 2 }}>
          Welcome back
        </div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 30, letterSpacing: 2, color: '#fff', lineHeight: 1 }}>
          Official <span style={{ color: 'var(--gold)' }}>Tyse</span>
        </div>
      </motion.div>

      {/* App Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px 12px',
          padding: '20px 20px 0',
          alignContent: 'start',
          position: 'relative', zIndex: 1
        }}
      >
        {APPS.map((app) => (
          <motion.div key={app.id} variants={item}>
            <AppIcon app={app} onPress={() => openApp(app.id)} />
          </motion.div>
        ))}
      </motion.div>

      {/* Dock */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 24 }}
        style={{ padding: '0 20px 36px', position: 'relative', zIndex: 1 }}
      >
        <div className="dock-blur" style={{
          borderRadius: 28,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          {DOCK_APPS.map((id) => {
            const app = APPS.find(a => a.id === id)
            return (
              <motion.div
                key={id}
                whileTap={{ scale: 0.82 }}
                onClick={() => openApp(id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <div style={{
                  width: 56, height: 56,
                  borderRadius: 14,
                  background: app.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
                    borderRadius: 'inherit'
                  }} />
                  {app.emoji}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Home indicator */}
      <div className="home-indicator" />
    </motion.div>
  )
}

function AppIcon({ app, onPress }) {
  return (
    <motion.div
      whileTap={{ scale: 0.82 }}
      onClick={onPress}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}
    >
      <motion.div
        style={{
          width: 72, height: 72,
          borderRadius: 15,
          background: app.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30,
          boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
          position: 'relative', overflow: 'hidden'
        }}
        whileHover={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.1)' }}
      >
        {/* Glass sheen layers */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 45%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.15)',
        }} />
        {app.emoji}
      </motion.div>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', letterSpacing: 0.2 }}>
        {app.label}
      </span>
    </motion.div>
  )
}
