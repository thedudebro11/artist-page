import { useState } from 'react'
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

const inputStyle = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 10,
  padding: '9px 12px',
  color: '#fff',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'DM Sans',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
}

const MOODS = ['vibing', 'emotional', 'hype', 'grateful', 'nostalgic']
const MOOD_COLORS = {
  vibing:    'rgba(201,168,76,0.22)',
  emotional: 'rgba(140,60,210,0.22)',
  hype:      'rgba(255,55,55,0.22)',
  grateful:  'rgba(30,200,100,0.22)',
  nostalgic: 'rgba(60,120,255,0.22)',
}

function MoodPill({ mood, selected, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{
        background: selected ? MOOD_COLORS[mood] : 'rgba(255,255,255,0.05)',
        border: `1px solid ${selected ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 20, padding: '5px 12px',
        color: selected ? '#fff' : 'rgba(255,255,255,0.42)',
        fontSize: 12, fontFamily: 'DM Sans',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
      }}
    >
      {mood}
    </motion.button>
  )
}

function FanNoteCard({ note }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ ...G.card, borderRadius: 16, padding: '13px 15px', marginBottom: 8 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--gold), #4a2800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#000',
          }}>{note.name[0].toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{note.name}</div>
            <div style={{ fontSize: 11, color: 'var(--gold)', lineHeight: 1.2 }}>{note.song}</div>
          </div>
        </div>
        <div style={{
          background: MOOD_COLORS[note.mood] || 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 10, padding: '2px 8px',
          fontSize: 10, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap',
        }}>{note.mood}</div>
      </div>
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>{note.message}</div>
      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.22)', marginTop: 7, textAlign: 'right' }}>{note.ts}</div>
    </motion.div>
  )
}

/* ============================================================
   9 PM NOTES APP
   ============================================================ */
export function MessagesApp() {
  const { artistNotes, fanNotes, pinnedNotes, addFanNote } = usePhoneStore()
  const [tab, setTab] = useState('artist')
  const [name, setName] = useState('')
  const [song, setSong] = useState('')
  const [mood, setMood] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    if (!name.trim() || !msg.trim() || !mood) return
    addFanNote({ name: name.trim(), song: song.trim() || 'General', mood, message: msg.trim() })
    setName(''); setSong(''); setMood(''); setMsg('')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const TABS = [
    { key: 'artist', label: 'Artist' },
    { key: 'fans',   label: 'Fans'   },
    { key: 'pinned', label: 'Pinned' },
  ]

  return (
    <AppShell title="9 PM Notes" bg="linear-gradient(180deg,#020205 0%,#050505 100%)">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 6,
          padding: '10px 14px 8px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          {TABS.map(({ key, label }) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.94 }}
              onClick={() => setTab(key)}
              style={{
                flex: 1, padding: '7px 0', borderRadius: 10, border: 'none',
                background: tab === key ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                color: tab === key ? 'var(--gold)' : 'rgba(255,255,255,0.42)',
                fontSize: 12.5, fontFamily: 'DM Sans', fontWeight: tab === key ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px 24px' }}>
          <AnimatePresence mode="wait">

            {/* ── ARTIST TAB ── */}
            {tab === 'artist' && (
              <motion.div key="artist"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <motion.div
                    animate={{ boxShadow: ['0 0 16px rgba(201,168,76,0.2)', '0 0 28px rgba(201,168,76,0.4)', '0 0 16px rgba(201,168,76,0.2)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{
                      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--gold), #3a2000)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}
                  >👑</motion.div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Official Tyse</div>
                    <div style={{ fontSize: 11, color: 'var(--gold)', lineHeight: 1.2 }}>9 PM Broadcast · Active</div>
                  </div>
                </div>

                {artistNotes.map((note, i) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ ...G.cardGold, borderRadius: 16, padding: '14px 16px', marginBottom: 10 }}
                  >
                    <div style={{ fontSize: 14, color: '#fff', lineHeight: 1.5 }}>{note.text}</div>
                    <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)', marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{note.date}</span><span>{note.time}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ── FANS TAB ── */}
            {tab === 'fans' && (
              <motion.div key="fans"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="sent"
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                      style={{
                        ...G.cardGold, borderRadius: 16, padding: '16px',
                        marginBottom: 14, textAlign: 'center',
                        color: 'var(--gold)', fontSize: 14, fontWeight: 600,
                      }}
                    >
                      🔥 Note sent. Real ones noticed.
                    </motion.div>
                  ) : (
                    <motion.div key="form"
                      style={{ ...G.card, borderRadius: 16, padding: '14px', marginBottom: 14 }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
                        Leave a Note
                      </div>

                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          style={{ ...inputStyle, width: '50%', boxSizing: 'border-box' }}
                        />
                        <input
                          value={song}
                          onChange={(e) => setSong(e.target.value)}
                          placeholder="Fav song"
                          style={{ ...inputStyle, width: '50%', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', marginBottom: 6, lineHeight: 1.2 }}>Mood</div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {MOODS.map((m) => (
                            <MoodPill key={m} mood={m} selected={mood === m} onClick={() => setMood(m)} />
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Your message to Tyse..."
                        rows={3}
                        style={{ ...inputStyle, borderRadius: 10, resize: 'none', marginBottom: 8 }}
                      />

                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={handleSubmit}
                        style={{
                          width: '100%', padding: '10px 0', border: 'none', borderRadius: 10,
                          background: (name.trim() && msg.trim() && mood) ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                          color: (name.trim() && msg.trim() && mood) ? '#000' : 'rgba(255,255,255,0.28)',
                          fontSize: 13, fontWeight: 700, fontFamily: 'DM Sans',
                          letterSpacing: 0.5, cursor: 'pointer',
                        }}
                      >
                        Send Note
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.26)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                  Fan Notes
                </div>
                {fanNotes.map((note) => <FanNoteCard key={note.id} note={note} />)}
              </motion.div>
            )}

            {/* ── PINNED TAB ── */}
            {tab === 'pinned' && (
              <motion.div key="pinned"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>📌</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Pinned by Tyse</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.36)', lineHeight: 1.2 }}>These hit different</div>
                  </div>
                </div>
                {pinnedNotes.map((note) => <FanNoteCard key={note.id} note={note} />)}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  )
}

/* ============================================================
   SOCIALS / LINKS APP
   ============================================================ */
export function ConnectApp() {
  return (
    <AppShell title="Socials" bg="linear-gradient(180deg, #0a0600 0%, #050505 55%)">
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
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 7, letterSpacing: 0.5, lineHeight: 1.3 }}>
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
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{link.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2, lineHeight: 1.2 }}>{link.sub}</div>
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
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>Stay in the loop</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14, lineHeight: 1.4 }}>First access to drops, tour dates, exclusives.</div>
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
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#fff', letterSpacing: 1.5, marginTop: 6, lineHeight: 1 }}>Drops Coming Soon</div>
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
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 3, letterSpacing: 0.3, lineHeight: 1.2 }}>{item.price}</div>
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
        <div style={{
          ...G.card,
          margin: '10px 14px 8px',
          borderRadius: 16,
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Recents</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.2 }}>12 items · @officialtyce</div>
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
   VIDEOS APP — helpers
   ============================================================ */
const BADGE_COLORS = {
  Featured:  { bg: 'rgba(201,168,76,0.90)', text: '#000' },
  Official:  { bg: 'rgba(255,255,255,0.88)', text: '#000' },
  Exclusive: { bg: 'rgba(140,50,210,0.85)', text: '#fff' },
}

function BadgeChip({ badge }) {
  if (!badge) return null
  const c = BADGE_COLORS[badge] || { bg: 'rgba(255,255,255,0.18)', text: '#fff' }
  return (
    <div style={{
      display: 'inline-block',
      background: c.bg, borderRadius: 5,
      padding: '2px 7px',
      fontSize: 9.5, fontWeight: 700, color: c.text,
      letterSpacing: 0.8, textTransform: 'uppercase',
      fontFamily: 'DM Sans', lineHeight: 1.4,
    }}>
      {badge}
    </div>
  )
}

function PlayCircle({ size = 48 }) {
  const fs = Math.round(size * 0.35)
  const pl = Math.round(size * 0.06)
  return (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: '50%', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backdropFilter: 'blur(12px) saturate(1.8)', WebkitBackdropFilter: 'blur(12px) saturate(1.8)' }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.32)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.40), 0 4px 16px rgba(0,0,0,0.50)' }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs, paddingLeft: pl, color: '#fff' }}>▶</div>
    </div>
  )
}

function FeaturedVideoCard({ vid }) {
  return (
    <motion.a
      href={vid.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      whileTap={{ scale: 0.985 }}
      style={{
        textDecoration: 'none', display: 'block', cursor: 'pointer',
        borderRadius: 20, overflow: 'hidden',
        border: '1px solid rgba(201,168,76,0.22)',
        boxShadow: '0 0 0 1px rgba(201,168,76,0.07), 0 8px 32px rgba(0,0,0,0.55), 0 0 40px rgba(201,168,76,0.05)',
        position: 'relative', height: 190,
      }}
    >
      <img
        src={`https://img.youtube.com/vi/${vid.ytId}/hqdefault.jpg`}
        alt={vid.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {/* cinematic gradient — heavy at bottom for text legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.32) 38%, rgba(0,0,0,0.88) 100%)' }} />

      {/* badge + duration */}
      <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <BadgeChip badge={vid.badge} />
        <div style={{
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 5, padding: '2px 7px',
          fontSize: 10.5, fontWeight: 600, color: '#fff', fontFamily: 'DM Mono',
        }}>{vid.dur}</div>
      </div>

      {/* centered play */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlayCircle size={54} />
      </div>

      {/* title + meta */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 14px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 3 }}>{vid.title}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.2 }}>
          {vid.type} · {vid.year}
        </div>
      </div>
    </motion.a>
  )
}

function VideoCard({ vid, index }) {
  return (
    <motion.a
      href={vid.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      style={{
        textDecoration: 'none', display: 'block', cursor: 'pointer',
        borderRadius: 16, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.35)',
        position: 'relative', height: 130,
      }}
    >
      <img
        src={`https://img.youtube.com/vi/${vid.ytId}/hqdefault.jpg`}
        alt={vid.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.46) 52%, rgba(0,0,0,0.84) 100%)' }} />

      {vid.badge && (
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <BadgeChip badge={vid.badge} />
        </div>
      )}

      {/* centered play */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlayCircle size={38} />
      </div>

      {/* bottom: title + meta + duration */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 12px 10px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div style={{ minWidth: 0, marginRight: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vid.title}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.50)', lineHeight: 1.2, marginTop: 1 }}>
            {vid.type} · {vid.year}
          </div>
        </div>
        <div style={{
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(0,0,0,0.50)', border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 4, padding: '2px 6px',
          fontSize: 10, fontWeight: 600, color: '#fff', fontFamily: 'DM Mono',
          flexShrink: 0,
        }}>{vid.dur}</div>
      </div>
    </motion.a>
  )
}

/* ============================================================
   VIDEOS APP
   ============================================================ */
export function VideosApp() {
  const [featured, ...rest] = VIDEOS

  return (
    <AppShell title="Videos" bg="linear-gradient(180deg,#020205 0%,#050505 100%)">
      <div style={{
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        padding: '12px 14px 48px',
      }}>

        {/* Vault header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 14 }}
        >
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#fff', letterSpacing: 2, lineHeight: 1 }}>
            Video Vault
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.38)', marginTop: 4, lineHeight: 1.3 }}>
            Official visuals, late-night clips, and moments for the real ones.
          </div>
        </motion.div>

        {/* Featured — first video, larger treatment */}
        <FeaturedVideoCard vid={featured} />

        {/* Section label */}
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.28)',
          letterSpacing: 2.5, textTransform: 'uppercase',
          margin: '16px 0 10px',
        }}>
          All Visuals
        </div>

        {/* Stacked cinematic cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rest.map((vid, i) => (
            <VideoCard key={vid.id} vid={vid} index={i} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
