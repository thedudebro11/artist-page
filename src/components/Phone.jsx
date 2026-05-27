import { AnimatePresence, motion } from 'framer-motion'
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

export default function Phone() {
  const { screen, activeApp } = usePhoneStore()
  const ActiveApp = activeApp ? APP_MAP[activeApp] : null

  return (
    <div
      className="phone-shell"
      style={{ width: 'var(--phone-w)', height: 'var(--phone-h)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Lock Screen */}
      <AnimatePresence>
        {screen === 'lock' && <LockScreen key="lock" />}
      </AnimatePresence>

      {/* Home Screen */}
      <AnimatePresence>
        {screen !== 'lock' && <HomeScreen key="home" />}
      </AnimatePresence>

      {/* Active App */}
      <AnimatePresence mode="wait">
        {screen === 'app' && ActiveApp && <ActiveApp key={activeApp} />}
      </AnimatePresence>
    </div>
  )
}
