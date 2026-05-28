import { motion, AnimatePresence } from 'framer-motion'
import { usePhoneStore, TRACKS } from '../store/phoneStore'

export default function DynamicIsland() {
  const { islandActive, currentTrack, isPlaying } = usePhoneStore()
  const track = TRACKS[currentTrack]

  return (
    <motion.div
      className="dynamic-island"
      animate={{
        width: islandActive ? 264 : 120,
        height: islandActive ? 58 : 34,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        x: '-50%',
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
        borderRadius: 22,
        zIndex: 100,
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <AnimatePresence mode="wait">
        {islandActive && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', height: '100%' }}
          >
            {/* Album art thumbnail */}
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
            }}>
              <img
                src={`https://img.youtube.com/vi/${track?.ytId}/mqdefault.jpg`}
                alt={track?.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Track info */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: '#fff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                fontFamily: 'DM Sans', letterSpacing: 0.1,
              }}>{track?.title}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontFamily: 'DM Sans' }}>
                Official Tyse
              </div>
            </div>

            {/* EQ bars */}
            {isPlaying && (
              <div style={{ display: 'flex', gap: 2.5, alignItems: 'flex-end', height: 22 }}>
                {[0.4, 0.9, 0.6, 1, 0.7].map((h, i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: 3, height: 18,
                      background: 'linear-gradient(0deg, #c9a84c, #e8c97a)',
                      borderRadius: 2,
                      transformOrigin: 'bottom',
                    }}
                    animate={{ scaleY: [h, 1, h * 0.5, 0.9, h] }}
                    transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
