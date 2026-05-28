import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePhoneStore, LINKS, VIDEOS } from '../store/phoneStore'
import AppShell from './AppShell'

/* shared glass surface token */
const G = {
  card: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(24px) saturate(2)',
    WebkitBackdropFilter: 'blur(24px) saturate(2)',
    border: '1px solid rgba(255,255,255,0.11)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.32)',
  },
  cardGold: {
    background: 'rgba(201,168,76,0.07)',
    backdropFilter: 'blur(24px) saturate(2)',
    WebkitBackdropFilter: 'blur(24px) saturate(2)',
    border: '1px solid rgba(201,168,76,0.20)',
    boxShadow: 'inset 0 1px 0 rgba(201,168,76,0.20), inset 0 -1px 0 rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.28)',
  },
}

/* ============================================================
   MESSAGES APP
   ============================================================ */
export function MessagesApp() {
  const { messages, addMessage } = usePhoneStore()
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

  const threads = [
    { name: 'Official Tyse', preview: 'New record just dropped. Holiday.', time: '9:00 PM', badge: 1, emoji: '👑' },
    { name: 'New Music Alert', preview: 'Holiday is now streaming everywhere 🎶', time: '9:01 PM', badge: 1, emoji: '🎵' },
    { name: 'Tour Dates', preview: 'Stay locked in. Dates dropping soon.', time: '8:45 PM', badge: 0, emoji: '📍' },
  ]

  return (
    <AppShell title="Messages" bg="linear-gradient(180deg,#020205 0%,#050505 100%)">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {!chatView ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -60 }}
              style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {threads.map((thread, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setChatView(true)}
                  style={{
                    ...G.card,
                    display: 'flex', alignItems: 'center', gap: 13,
                    padding: '13px 14px', borderRadius: 18, cursor: 'pointer',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--gold), #4a2800)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                    boxShadow: '0 0 0 2px rgba(201,168,76,0.3), 0 4px 12px rgba(0,0,0,0.4)',
                  }}>{thread.emoji}</div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{thread.name}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 3 }}>
                      {thread.preview}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{thread.time}</div>
                    {thread.badge > 0 && (
                      <div style={{
                        marginTop: 5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 18, height: 18, borderRadius: '50%',
                        background: 'var(--gold)', fontSize: 10, fontWeight: 700, color: '#000',
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
                padding: '8px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(0,0,0,0.15)',
              }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setChatView(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontSize: 20 }}>‹</motion.button>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), #4a2800)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  boxShadow: '0 0 0 2px rgba(201,168,76,0.25)',
                }}>👑</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Official Tyse</div>
                  <div style={{ fontSize: 11, color: 'var(--gold)' }}>Active now</div>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                      }}
                    >
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3, textAlign: msg.from === 'tyse' ? 'left' : 'right', padding: '0 4px' }}>
                      {msg.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div style={{ padding: '10px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(0,0,0,0.12)' }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Message Official Tyse..."
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.11)',
                    borderRadius: 22, padding: '10px 16px',
                    color: '#fff', fontSize: 14, outline: 'none',
                    fontFamily: 'DM Sans',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                />
                <motion.button whileTap={{ scale: 0.88 }} onClick={send}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--gold)', border: 'none', cursor: 'pointer',
                    fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 0 16px rgba(201,168,76,0.4)',
                  }}>↑</motion.button>
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
    <AppShell title="Connect" bg="linear-gradient(180deg, #0a0600 0%, #050505 55%)">
      <div style={{ height: '100%', overflowY: 'auto', padding: '24px 18px 40px' }}>

        {/* Profile glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...G.card,
            textAlign: 'center',
            padding: '28px 20px 24px',
            borderRadius: 24,
            marginBottom: 16,
          }}
        >
          <motion.div
            animate={{ boxShadow: ['0 0 24px rgba(201,168,76,0.25)', '0 0 44px rgba(201,168,76,0.45)', '0 0 24px rgba(201,168,76,0.25)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold), #3a2000)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, margin: '0 auto 16px',
            }}
          >👑</motion.div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: 3, color: '#fff', lineHeight: 1 }}>Official Tyse</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 7, letterSpacing: 0.5 }}>
            Artist · @officialtyce
          </div>
        </motion.div>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {LINKS.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileTap={{ scale: 0.97 }}
              className="link-item"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', borderRadius: 18,
                textDecoration: 'none', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: link.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
              }}>{link.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{link.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{link.sub}</div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
            </motion.a>
          ))}
        </div>

        {/* Email signup — gold glass */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          style={{ ...G.cardGold, borderRadius: 20, padding: '18px 16px' }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Stay in the loop</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>First access to drops, tour dates, exclusives.</div>
          <EmailSignup />
        </motion.div>
      </div>
    </AppShell>
  )
}

function EmailSignup() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = () => { if (!email.includes('@')) return; setDone(true) }

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
          flex: 1,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, padding: '10px 14px',
          color: '#fff', fontSize: 13, outline: 'none',
          fontFamily: 'DM Sans',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      />
      <motion.button whileTap={{ scale: 0.9 }} onClick={submit}
        style={{
          background: 'var(--gold)', border: 'none', borderRadius: 12,
          padding: '10px 16px', cursor: 'pointer',
          fontSize: 12, fontWeight: 700, color: '#000',
          fontFamily: 'DM Sans', letterSpacing: 0.8, textTransform: 'uppercase',
          boxShadow: '0 0 16px rgba(201,168,76,0.35)',
        }}>Join</motion.button>
    </div>
  )
}

/* ============================================================
   STORE APP
   ============================================================ */
export function StoreApp() {
  const items = [
    { name: 'Main Character Tee', price: 'Coming Soon', emoji: '👕', grad: 'linear-gradient(135deg,#1a001a,#36003a)' },
    { name: '9 PM Cap',           price: 'Coming Soon', emoji: '🧢', grad: 'linear-gradient(135deg,#1a0a00,#3a1800)' },
    { name: 'The Mask Hoodie',    price: 'Coming Soon', emoji: '🎭', grad: 'linear-gradient(135deg,#0d0d22,#1a1a44)' },
    { name: 'Holiday — CD',       price: 'Coming Soon', emoji: '💿', grad: 'linear-gradient(135deg,#001a00,#003020)' },
  ]

  return (
    <AppShell title="Store" bg="linear-gradient(180deg,#0a0014 0%, #050505 60%)">
      <div style={{ height: '100%', overflowY: 'auto', padding: '16px 18px 40px' }}>

        {/* Gold glass banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...G.cardGold,
            borderRadius: 22, padding: '20px',
            marginBottom: 22, textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24 }}>🔥</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#fff', letterSpacing: 1.5, marginTop: 6 }}>Drops Coming Soon</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.38)', marginTop: 5, lineHeight: 1.5 }}>Official Tyse merch in production. Stay locked in.</div>
        </motion.div>

        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 14 }}>Preview Concepts</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.95 }}
              className="store-card"
              style={{ borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}
            >
              <div style={{
                aspectRatio: '1',
                background: item.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, position: 'relative',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 55%)' }} />
                {item.emoji}
              </div>
              <div style={{ padding: '11px 13px 13px' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 3, letterSpacing: 0.3 }}>{item.price}</div>
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
        {/* Glass header strip */}
        <div style={{
          ...G.card,
          margin: '10px 14px 8px',
          borderRadius: 16,
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>Recents</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>12 items · @officialtyce</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, padding: '0 2px' }}>
          {photos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ opacity: 0.72, scale: 0.97 }}
              style={{
                aspectRatio: '1',
                background: p.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, cursor: 'pointer', position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)' }} />
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
    <AppShell title="Videos" bg="linear-gradient(180deg,#020205 0%,#050505 100%)">
      <div style={{ height: '100%', overflowY: 'auto', padding: '14px 14px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {VIDEOS.map((vid, i) => (
          <motion.a
            key={vid.id}
            href={vid.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.98 }}
            style={{
              textDecoration: 'none', display: 'block',
              ...G.card,
              borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
            }}
          >
            {/* Thumbnail */}
            <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: grads[i % grads.length], overflow: 'hidden' }}>
              <img
                src={`https://img.youtube.com/vi/${vid.ytId}/hqdefault.jpg`}
                alt={vid.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)' }} />

              {/* Glass play button — 21st.dev liquid glass recipe */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  position: 'relative',
                  width: 52, height: 52, borderRadius: '50%',
                }}>
                  {/* blur layer */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    backdropFilter: 'blur(12px) saturate(1.8)',
                    WebkitBackdropFilter: 'blur(12px) saturate(1.8)',
                  }} />
                  {/* fill + edge */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.28)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 16px rgba(0,0,0,0.45)',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, paddingLeft: 3, color: '#fff',
                  }}>▶</div>
                </div>
              </div>

              {/* Duration glass pill */}
              <div style={{
                position: 'absolute', bottom: 8, right: 10,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 5,
                padding: '2px 7px', fontSize: 11, fontWeight: 600, color: '#fff', fontFamily: 'DM Mono',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
              }}>{vid.dur}</div>
            </div>

            {/* Info */}
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{vid.title}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>{vid.sub}</div>
            </div>
          </motion.a>
        ))}
      </div>
    </AppShell>
  )
}
