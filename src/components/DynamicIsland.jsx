import { motion, AnimatePresence } from 'framer-motion'
import { usePhoneStore, TRACKS } from '../store/phoneStore'

export default function DynamicIsland() {
  const { islandActive, currentTrack, isPlaying } = usePhoneStore()
  const track = TRACKS[currentTrack]

  return (
    <motion.div
      className="dynamic-island"
      animate={{
        width: islandActive ? 260 : 120,
        height: islandActive ? 56 : 34,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        x: '-50%',
        background: '#000',
        borderRadius: 22,
        zIndex: 100,
        overflow: 'hidden',
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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              height: '100%'
            }}
          >
            {/* Album art mini */}
            <div style={{
              width: 38, height: 38,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1a0d00, #2a1a00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0
            }}>🎵</div>

            {/* Track info */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: '#fff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                fontFamily: 'DM Sans'
              }}>{track?.title}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
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
                      width: 3,
                      background: 'linear-gradient(0deg, #c9a84c, #e8c97a)',
                      borderRadius: 2,
                    }}
                    animate={{ scaleY: [h, 1, h * 0.5, 0.9, h] }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.08
                    }}
                    transformOrigin="bottom"
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
