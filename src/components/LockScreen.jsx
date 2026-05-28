import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { usePhoneStore } from '../store/phoneStore'
import StatusBar from './StatusBar'
import DynamicIsland from './DynamicIsland'

export default function LockScreen() {
  const unlock = usePhoneStore((s) => s.unlock)
  const [notifVisible, setNotifVisible] = useState(false)
  const [hint, setHint] = useState(false)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, -120], [1, 0])
  const scale = useTransform(y, [0, -120], [1, 0.94])
  const isDragging = useRef(false)

  useEffect(() => {
    // Notification drop after 1.4s
    const t1 = setTimeout(() => setNotifVisible(true), 1400)
    const t2 = setTimeout(() => setHint(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleDragEnd = (_, info) => {
    if (info.offset.y < -60 || info.velocity.y < -300) {
      animate(y, -window.innerHeight, { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] })
      setTimeout(unlock, 420)
    } else {
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 40 })
    }
    isDragging.current = false
  }

  const handleTap = () => {
    if (!isDragging.current) {
      animate(y, -window.innerHeight, { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] })
      setTimeout(unlock, 480)
    }
  }

  return (
    <motion.div
      style={{ y, opacity, scale, position: 'absolute', inset: 0, zIndex: 20 }}
      drag="y"
      dragConstraints={{ top: -200, bottom: 0 }}
      dragElastic={{ top: 0.4, bottom: 0 }}
      onDragStart={() => { isDragging.current = true }}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      className="lock-screen-bg swipe-target"
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
            filter: 'brightness(0.58) contrast(1.05)',
            display: 'block', userSelect: 'none',
          }}
        />
        {/* Gradient overlay — keeps top & bottom dark for status bar + swipe hint */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.0) 45%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.82) 100%)',
        }} />
        {/* Subtle gold bloom at bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 110% 40% at 50% 105%, rgba(201,168,76,0.10) 0%, transparent 60%)',
        }} />
      </div>

      {/* Grid lines */}
      <div className="lock-grid-lines" />

      {/* Floating particles */}
      <Particles />

      {/* Dynamic Island */}
      <DynamicIsland />

      {/* Status Bar */}
      <StatusBar />

      {/* Notification Banner */}
      <motion.div
        initial={{ y: -80, opacity: 0, scale: 0.95 }}
        animate={notifVisible ? { y: 0, opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          position: 'absolute',
          top: 64,
          left: 16,
          right: 16,
          zIndex: 50,
          pointerEvents: 'none'
        }}
      >
        <div className="notif-banner" style={{ padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #c9a84c, #8a6020)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0
          }}>👑</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3px', textTransform: 'uppercase', marginBottom: 3, lineHeight: 1.2 }}>
              Official Tyse · now
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3, lineHeight: 1.2 }}>
              New Drop @ 9 PM
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.2 }}>
              Tap to listen 🔥
            </div>
          </div>
        </div>
      </motion.div>

      {/* Time & Date */}
      <div style={{
        position: 'absolute',
        top: '28%',
        left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 6,
        userSelect: 'none'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 }}
        >
          Sunday, May 25
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          style={{
            fontFamily: 'DM Sans',
            fontSize: 90,
            fontWeight: 200,
            color: '#fff',
            letterSpacing: -4,
            lineHeight: 1,
            textShadow: '0 0 80px rgba(201,168,76,0.2)'
          }}
        >
          9<BlinkColon />00
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: 'Cormorant Garamond',
            fontStyle: 'italic',
            fontSize: 16,
            color: 'var(--gold)',
            letterSpacing: 2,
            marginTop: 4
          }}
        >
          Main Character
        </motion.div>
      </div>

      {/* Bottom swipe area */}
      <motion.div
        animate={hint ? { opacity: [0.5, 0.85, 0.5] } : { opacity: 0 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: 36,
          left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 12,
          pointerEvents: 'none'
        }}
      >
        <span style={{
          fontSize: 12, color: 'rgba(255,255,255,0.5)',
          letterSpacing: 0.8, fontFamily: 'DM Sans', fontWeight: 400,
        }}>
          swipe up to unlock
        </span>
        {/* Liquid glass pill */}
        <div style={{
          width: 134, height: 5, borderRadius: 3,
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 4px rgba(0,0,0,0.4)',
        }} />
      </motion.div>
    </motion.div>
  )
}

function BlinkColon() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >:</motion.span>
  )
}

function Particles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() > 0.7 ? 2 : 1,
            height: Math.random() > 0.7 ? 2 : 1,
            borderRadius: '50%',
            background: `rgba(201,168,76,${0.2 + Math.random() * 0.4})`
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -(20 + Math.random() * 40)]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  )
}
