import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePhoneStore, LINKS, VIDEOS } from '../store/phoneStore'
import AppShell from './AppShell'

/* ============================================================
   MESSAGES APP
   ============================================================ */
export function MessagesApp() {
  const { messages, addMessage, chatOpen } = usePhoneStore()
  const [chatView, setChatView] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    addMessage(input.trim())
    setInput('')
  }

  return (
    <AppShell title="Messages" bg="#000">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {!chatView ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -60 }}>
              {/* Thread list */}
              {[
                { name: 'Official Tyse', preview: 'New record just dropped. Holiday.', time: '9:00 PM', badge: 1, emoji: '👑' },
                { name: 'New Music Alert', preview: 'Holiday is now streaming everywhere 🎶', time: '9:01 PM', badge: 1, emoji: '🎵' },
                { name: 'Tour Dates', preview: 'Stay locked in. Dates dropping soon.', time: '8:45 PM', badge: 0, emoji: '📍' },
              ].map((thread, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ background: 'rgba(255,255,255,0.04)' }}
                  onClick={() => setChatView(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold), #4a3000)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0
                  }}>{thread.emoji}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{thread.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                      {thread.preview}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{thread.time}</div>
                    {thread.badge > 0 && (
                      <div style={{
                        marginTop: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 18, height: 18, borderRadius: '50%',
                        background: 'var(--gold)', fontSize: 10, fontWeight: 700, color: '#000'
                      }}>{thread.badge}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {/* Chat header */}
              <div style={{
                padding: '8px 16px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setChatView(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontSize: 20 }}
                >‹</motion.button>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #4a3000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👑</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Official Tyse</div>
                  <div style={{ fontSize: 11, color: 'var(--gold)' }}>Active now</div>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    style={{ alignSelf: msg.from === 'tyse' ? 'flex-start' : 'flex-end', maxWidth: '78%' }}
                  >
                    <div
                      className={msg.from === 'tyse' ? 'chat-bubble-in' : 'chat-bubble-out'}
                      style={{
                        padding: '10px 14px',
                        borderRadius: msg.from === 'tyse' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                        fontSize: 14, lineHeight: 1.5,
                        color: msg.from === 'tyse' ? '#fff' : '#000',
                        fontWeight: msg.from === 'fan' ? 500 : 400
                      }}
                    >
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, textAlign: msg.from === 'tyse' ? 'left' : 'right', padding: '0 4px' }}>
                      {msg.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div style={{ padding: '10px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Message Official Tyse..."
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 20, padding: '10px 16px',
                    color: '#fff', fontSize: 14, outline: 'none',
                    fontFamily: 'DM Sans'
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={send}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--gold)', border: 'none', cursor: 'pointer',
                    fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}
                >↑</motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}

/* ============================================================
   CONNECT / LINKS APP
   ============================================================ */
export function ConnectApp() {
  return (
    <AppShell title="Connect" bg="linear-gradient(180deg, #0a0500 0%, #050505 60%)">
      <div style={{ height: '100%', overflowY: 'auto', padding: '16px 20px 40px' }}>
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(201,168,76,0.2)', '0 0 40px rgba(201,168,76,0.4)', '0 0 20px rgba(201,168,76,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: 76, height: 76, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold), #3a2000)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, margin: '0 auto 12px'
            }}
          >👑</motion.div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 2, color: '#fff' }}>Official Tyse</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3, letterSpacing: 0.5 }}>
            Empire Recording Artist · Main Character @ 9 PM
          </div>
        </motion.div>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LINKS.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileTap={{ scale: 0.97 }}
              className="link-item"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 16,
                textDecoration: 'none', cursor: 'pointer'
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: link.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0
              }}>{link.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{link.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{link.sub}</div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>›</span>
            </motion.a>
          ))}
        </div>

        {/* Email signup */}
        <div style={{ marginTop: 24, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Stay in the loop</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>First access to drops, tour dates, exclusives.</div>
          <EmailSignup />
        </div>
      </div>
    </AppShell>
  )
}

function EmailSignup() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = () => {
    if (!email.includes('@')) return
    setDone(true)
  }

  if (done) return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      style={{ textAlign: 'center', padding: '10px 0', color: 'var(--gold)', fontSize: 14, fontWeight: 500 }}>
      🔥 You're locked in
    </motion.div>
  )

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="your@email.com"
        type="email"
        style={{
          flex: 1, background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '10px 14px',
          color: '#fff', fontSize: 13, outline: 'none',
          fontFamily: 'DM Sans'
        }}
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={submit}
        style={{
          background: 'var(--gold)', border: 'none', borderRadius: 10,
          padding: '10px 16px', cursor: 'pointer',
          fontSize: 12, fontWeight: 600, color: '#000',
          fontFamily: 'DM Sans', letterSpacing: 1, textTransform: 'uppercase'
        }}
      >Join</motion.button>
    </div>
  )
}

/* ============================================================
   STORE APP
   ============================================================ */
export function StoreApp() {
  const items = [
    { name: 'Main Character Tee', price: 'Coming Soon', emoji: '👕', grad: 'linear-gradient(135deg,#1a001a,#36003a)' },
    { name: '9 PM Cap', price: 'Coming Soon', emoji: '🧢', grad: 'linear-gradient(135deg,#1a0a00,#3a1800)' },
    { name: 'The Mask Hoodie', price: 'Coming Soon', emoji: '🎭', grad: 'linear-gradient(135deg,#0d0d22,#1a1a44)' },
    { name: 'Holiday — CD', price: 'Coming Soon', emoji: '💿', grad: 'linear-gradient(135deg,#001a00,#003020)' },
  ]

  return (
    <AppShell title="Store" bg="linear-gradient(180deg,#0a0014 0%, #050505 60%)">
      <div style={{ height: '100%', overflowY: 'auto', padding: '16px 20px 40px' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.12)',
            borderRadius: 16, padding: '16px 20px',
            marginBottom: 24, textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 22 }}>🔥</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#fff', letterSpacing: 1, marginTop: 4 }}>Drops Coming Soon</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Official Tyse merch in production. Stay locked in.</div>
        </motion.div>

        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Preview Concepts</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.95 }}
              className="store-card"
              style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}
            >
              <div style={{
                aspectRatio: '1',
                background: item.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, position: 'relative'
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
                {item.emoji}
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 3 }}>{item.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

/* ============================================================
   GALLERY APP
   ============================================================ */
export function GalleryApp() {
  const photos = [
    { emoji: '🎤', grad: 'linear-gradient(135deg,#1a0d00,#3d2800)' },
    { emoji: '🌙', grad: 'linear-gradient(135deg,#001020,#002040)' },
    { emoji: '🔥', grad: 'linear-gradient(135deg,#200000,#400000)' },
    { emoji: '🎧', grad: 'linear-gradient(135deg,#100020,#300040)' },
    { emoji: '💎', grad: 'linear-gradient(135deg,#001a10,#003a20)' },
    { emoji: '🎵', grad: 'linear-gradient(135deg,#1a1000,#3d2800)' },
    { emoji: '👑', grad: 'linear-gradient(135deg,#1a0d00,#3d2000)' },
    { emoji: '🌃', grad: 'linear-gradient(135deg,#0d0d1a,#1a1a3d)' },
    { emoji: '🎭', grad: 'linear-gradient(135deg,#1a0000,#3d0000)' },
    { emoji: '⚡', grad: 'linear-gradient(135deg,#1a1a00,#3d3d00)' },
    { emoji: '🖤', grad: 'linear-gradient(135deg,#111,#222)' },
    { emoji: '✨', grad: 'linear-gradient(135deg,#0a0a1a,#1a1a2e)' },
  ]

  return (
    <AppShell title="Gallery" bg="#000">
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <div style={{ padding: '12px 16px 6px', fontSize: 20, fontWeight: 600, color: '#fff' }}>Recents</div>
        <div style={{ padding: '0 16px 6px', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>28 items · @officialtyce</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, padding: '0 2px' }}>
          {photos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ opacity: 0.7, scale: 0.98 }}
              style={{
                aspectRatio: '1',
                background: p.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, cursor: 'pointer', position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
              {p.emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

/* ============================================================
   VIDEOS APP
   ============================================================ */
export function VideosApp() {
  const grads = [
    'linear-gradient(135deg,#1a0d00,#3d2800)',
    'linear-gradient(135deg,#001020,#002540)',
    'linear-gradient(135deg,#100020,#300040)',
    'linear-gradient(135deg,#001a00,#003020)',
    'linear-gradient(135deg,#0d0d22,#1a1a44)',
  ]

  return (
    <AppShell title="Videos" bg="#000">
      <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {VIDEOS.map((vid, i) => (
          <motion.a
            key={vid.id}
            href={vid.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileTap={{ scale: 0.98 }}
            style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}
          >
            <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: grads[i % grads.length], overflow: 'hidden' }}>
              <img
                src={`https://img.youtube.com/vi/${vid.ytId}/hqdefault.jpg`}
                alt={vid.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Dark overlay so play button reads clearly */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.65)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, paddingLeft: 4,
                  border: '2px solid rgba(255,255,255,0.35)'
                }}>▶</div>
              </div>
              <div style={{
                position: 'absolute', bottom: 8, right: 10,
                background: 'rgba(0,0,0,0.75)', borderRadius: 4,
                padding: '2px 6px', fontSize: 11, fontWeight: 600, color: '#fff', fontFamily: 'DM Mono'
              }}>{vid.dur}</div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{vid.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{vid.sub}</div>
            </div>
          </motion.a>
        ))}
      </div>
    </AppShell>
  )
}
