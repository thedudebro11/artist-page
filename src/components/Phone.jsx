import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePhoneStore } from '../store/phoneStore'
import LockScreen from './LockScreen'
import HomeScreen from './HomeScreen'
import MusicApp from './MusicApp'
import { MessagesApp, ConnectApp, StoreApp, GalleryApp, VideosApp } from './AllApps'

const APP_MAP = {
  music: MusicApp,
  messages: MessagesApp,
  connect: ConnectApp,
  store: StoreApp,
  gallery: GalleryApp,
  videos: VideosApp,
}

/* ── Titanium side button ── */
function PhoneButton({ top, height, side }) {
  const [pressed, setPressed] = useState(false)
  const isLeft = side === 'left'

  return (
    <div
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: 'absolute',
        top,
        ...(isLeft ? { left: -5 } : { right: -5 }),
        width: 5,
        height,
        borderRadius: isLeft ? '3px 1px 1px 3px' : '1px 3px 3px 1px',
        background: isLeft
          ? 'linear-gradient(90deg, #111 0%, #1e1c1a 25%, #302e2b 55%, #3d3b38 75%, #2c2a27 100%)'
          : 'linear-gradient(270deg, #111 0%, #1e1c1a 25%, #302e2b 55%, #3d3b38 75%, #2c2a27 100%)',
        boxShadow: pressed
          ? `inset 0 2px 4px rgba(0,0,0,0.8), inset 0 -1px 1px rgba(0,0,0,0.5), ${isLeft ? '-1px' : '1px'} 0 3px rgba(0,0,0,0.4)`
          : `inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.6), ${isLeft ? '-3px 0 8px' : '3px 0 8px'} rgba(0,0,0,0.6), ${isLeft ? '-1px 0 3px' : '1px 0 3px'} rgba(0,0,0,0.35)`,
        transform: pressed
          ? `translateX(${isLeft ? '1.5px' : '-1.5px'})`
          : 'translateX(0)',
        transition: 'all 0.12s cubic-bezier(0.1,0.4,0.2,1)',
        cursor: 'pointer',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        ...(isLeft ? { left: 0, width: 1 } : { right: 0, width: 1 }),
        background: 'rgba(255,255,255,0.06)',
      }} />
    </div>
  )
}

export default function Phone() {
  const { screen, activeApp } = usePhoneStore()
  const ActiveApp = activeApp ? APP_MAP[activeApp] : null

  return (
    <div style={{ position: 'relative', display: 'inline-block', verticalAlign: 'top' }}>

      {/* Left: silent switch + vol up + vol down */}
      <PhoneButton side="left" top={108} height={18} />
      <PhoneButton side="left" top={148} height={36} />
      <PhoneButton side="left" top={196} height={36} />

      {/* Right: power / sleep */}
      <PhoneButton side="right" top={162} height={68} />

      {/* Screen */}
      <div
        className="phone-shell"
        style={{ width: 'var(--phone-w)', height: 'var(--phone-h)', position: 'relative', overflow: 'hidden' }}
      >
        <AnimatePresence>
          {screen === 'lock' && <LockScreen key="lock" />}
        </AnimatePresence>

        <AnimatePresence>
          {screen !== 'lock' && <HomeScreen key="home" />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {screen === 'app' && ActiveApp && <ActiveApp key={activeApp} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
