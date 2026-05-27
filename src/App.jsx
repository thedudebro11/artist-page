import Phone from './components/Phone'
import './styles/globals.css'

export default function App() {
  return (
    <div
      className="desktop-env"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Desktop ambient glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'pulseGlow 4s ease-in-out infinite'
      }} />

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* The Phone */}
      <Phone />

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
