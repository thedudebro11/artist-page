import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePhoneStore, TRACKS } from '../store/phoneStore'
import AppShell from './AppShell'

function loadYouTubeApi(onReady) {
  if (window.YT?.Player) {
    onReady()
    return
  }
  const prev = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = () => {
    if (prev) prev()
    onReady()
  }
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  }
}

export default function MusicApp() {
  const { currentTrack, isPlaying, progress, setTrack, togglePlay, setProgress, showIsland } = usePhoneStore()
  const track = TRACKS[currentTrack]
  const playerRef = useRef(null)
  const elRef = useRef(null)
  const intervalRef = useRef(null)
  const [ytReady, setYtReady] = useState(false)

  // Create YouTube player on mount
  useEffect(() => {
    let alive = true

    const el = document.createElement('div')
    el.style.cssText = 'position:fixed;width:1px;height:1px;bottom:-5px;left:-5px;overflow:hidden;pointer-events:none;opacity:0.01'
    document.body.appendChild(el)
    elRef.current = el

    loadYouTubeApi(() => {
      if (!alive) return
      playerRef.current = new window.YT.Player(el, {
        videoId: track.ytId,
        playerVars: {
          autoplay: 0, controls: 0, disablekb: 1,
          fs: 0, rel: 0, modestbranding: 1,
          iv_load_policy: 3, playsinline: 1,
        },
        events: {
          onReady: () => { if (alive) setYtReady(true) },
          onStateChange: (e) => {
            if (e.data === 0 && alive) {
              const store = usePhoneStore.getState()
              const next = (store.currentTrack + 1) % TRACKS.length
              store.setTrack(next)
              store.showIsland(TRACKS[next].title)
            }
          },
        },
      })
    })

    return () => {
      alive = false
      clearInterval(intervalRef.current)
      try { playerRef.current?.destroy() } catch (_) {}
      playerRef.current = null
      elRef.current?.remove()
    }
  }, [])

  // Load video when track changes
  useEffect(() => {
    if (!playerRef.current || !ytReady) return
    if (isPlaying) {
      playerRef.current.loadVideoById(track.ytId)
    } else {
      playerRef.current.cueVideoById(track.ytId)
    }
  }, [currentTrack])

  // Play / pause
  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!playerRef.current || !ytReady) return

    if (isPlaying) {
      playerRef.current.playVideo()
      intervalRef.current = setInterval(() => {
        try {
          const p = playerRef.current
          if (!p) return
          const curr = p.getCurrentTime() || 0
          const total = p.getDuration() || 1
          setProgress((curr / total) * 100)
        } catch (_) {}
      }, 500)
    } else {
      playerRef.current.pauseVideo()
    }

    return () => clearInterval(intervalRef.current)
  }, [isPlaying, ytReady])

  const handleSeek = (pct) => {
    try {
      if (playerRef.current?.seekTo) {
        playerRef.current.seekTo((pct / 100) * (playerRef.current.getDuration() || 0), true)
      }
    } catch (_) {}
    setProgress(pct)
  }

  const handleTrackSelect = (i) => { setTrack(i); showIsland(TRACKS[i].title) }
  const handlePrev = () => handleTrackSelect(currentTrack > 0 ? currentTrack - 1 : TRACKS.length - 1)
  const handleNext = () => handleTrackSelect((currentTrack + 1) % TRACKS.length)

  const currentSecs = Math.floor((progress / 100) * track.secs)
  const currentTime = `${Math.floor(currentSecs / 60)}:${(currentSecs % 60).toString().padStart(2, '0')}`

  return (
    <AppShell title="Music" bg="linear-gradient(180deg, #0d0602 0%, #080503 35%, #050505 100%)">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Album Art */}
        <div style={{ padding: '16px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <motion.div
            key={currentTrack}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ position: 'relative' }}
          >
            <div
              className="album-art-shadow"
              style={{
                width: 200, height: 200, borderRadius: 16,
                overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(145deg,#1c0e00,#3a2600)',
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${track.ytId}/hqdefault.jpg`}
                alt={track.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)',
              }} />
            </div>

            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute', inset: -8, borderRadius: 24,
                  border: '1px solid var(--gold)', pointerEvents: 'none',
                }}
              />
            )}

            {!ytReady && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 16,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: '2px solid rgba(201,168,76,0.3)',
                    borderTopColor: 'var(--gold)',
                  }}
                />
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#fff', letterSpacing: 1.5, lineHeight: 1 }}>
                {track.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 4, fontFamily: 'DM Sans' }}>
                {track.artist}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress */}
        <div style={{ padding: '12px 24px 0' }}>
          <ProgressBar progress={progress} onSeek={handleSeek} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono' }}>{currentTime}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono' }}>{track.dur}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <motion.button whileTap={{ scale: 0.8 }} onClick={handlePrev}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 24, display: 'flex' }}>
            ⏮
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => { togglePlay(); if (!isPlaying) showIsland(track.title) }}
            style={{
              width: 62, height: 62, borderRadius: '50%',
              background: 'var(--gold)', border: 'none', cursor: 'pointer',
              fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              paddingLeft: isPlaying ? 0 : 3,
              boxShadow: '0 0 30px rgba(201,168,76,0.35), 0 8px 24px rgba(0,0,0,0.5)',
              opacity: ytReady ? 1 : 0.55,
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </motion.button>

          <motion.button whileTap={{ scale: 0.8 }} onClick={handleNext}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 24, display: 'flex' }}>
            ⏭
          </motion.button>
        </div>

        {/* Track List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 20px' }}>
          {TRACKS.map((t, i) => (
            <motion.div
              key={t.id}
              whileTap={{ background: 'rgba(255,255,255,0.05)' }}
              onClick={() => handleTrackSelect(i)}
              className="track-row"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 8, cursor: 'pointer',
              }}
            >
              <span style={{
                fontSize: 13,
                color: i === currentTrack ? 'var(--gold)' : 'rgba(255,255,255,0.25)',
                width: 20, textAlign: 'center', fontFamily: 'DM Mono',
              }}>
                {i === currentTrack && isPlaying ? <EQMini /> : String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: i === currentTrack ? 'var(--gold-light)' : '#fff', lineHeight: 1.2 }}>
                  {t.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.2 }}>
                  {t.artist}
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', fontFamily: 'DM Mono' }}>
                {t.dur}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </AppShell>
  )
}

function ProgressBar({ progress, onSeek }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    onSeek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
  }
  return (
    <div className="progress-track" onClick={handleClick} style={{ height: 3, cursor: 'pointer', borderRadius: 4 }}>
      <motion.div
        className="progress-fill"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
        style={{ height: '100%', borderRadius: 4, position: 'relative' }}
      >
        <div className="progress-thumb" />
      </motion.div>
    </div>
  )
}

function EQMini() {
  return (
    <span style={{ display: 'inline-flex', gap: 1.5, alignItems: 'flex-end', height: 14 }}>
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <motion.span
          key={i}
          style={{ width: 2, display: 'block', background: 'var(--gold)', borderRadius: 1, transformOrigin: 'bottom' }}
          animate={{ scaleY: [h, 1, h * 0.4, 0.8, h] }}
          transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, delay: i * 0.07 }}
        />
      ))}
    </span>
  )
}
