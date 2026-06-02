import { create } from 'zustand'

const nowTs = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

export const usePhoneStore = create((set) => ({
  // Screen state
  screen: 'lock',
  activeApp: null,

  // Music player
  currentTrack: 0,
  isPlaying: false,
  progress: 35,
  islandActive: false,

  // 9 PM Notes
  artistNotes: [
    { id: 1, text: 'New drop coming 9 PM tonight. You already know what it is. 👑', time: '9:00 PM', date: 'May 25' },
    { id: 2, text: 'Holiday is out now. Go stream it. Tell a real one.', time: '9:01 PM', date: 'May 25' },
    { id: 3, text: 'More music in the lab right now. Stay patient. The wave is coming.', time: '9:03 PM', date: 'May 25' },
    { id: 4, text: 'Tour dates dropping soon. Watch this space. 🎯', time: '9:12 PM', date: 'May 24' },
  ],
  fanNotes: [
    { id: 10, name: 'KJ',  song: 'Stay',             mood: 'vibing',    message: 'This song got me through everything bro fr 🙏',           ts: '9:04 PM' },
    { id: 11, name: 'Mia', song: 'More Than Friends', mood: 'emotional', message: 'I cry every single time. Thank you for making this.',      ts: '9:06 PM' },
    { id: 12, name: 'Dom', song: 'IYKYK',             mood: 'hype',      message: 'IYKYK on repeat since drop day. Different breed fr.',      ts: '9:09 PM' },
  ],
  pinnedNotes: [
    { id: 20, name: 'KJ',  song: 'Stay',             mood: 'vibing',    message: 'This song got me through everything bro fr 🙏',           ts: '9:04 PM' },
    { id: 21, name: 'Mia', song: 'More Than Friends', mood: 'emotional', message: 'I cry every single time. Thank you for making this.',      ts: '9:06 PM' },
  ],

  addFanNote: (note) => {
    const newNote = { ...note, id: Date.now(), ts: nowTs() }
    set((s) => ({ fanNotes: [newNote, ...s.fanNotes] }))
  },

  // Actions
  unlock: () => set({ screen: 'home' }),
  goHome: () => set({ screen: 'home', activeApp: null }),
  openApp: (app) => set({ screen: 'app', activeApp: app }),
  closeApp: () => set({ screen: 'home', activeApp: null }),

  setTrack: (index) => set({ currentTrack: index, isPlaying: true, progress: 0 }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setProgress: (p) => set({ progress: p }),

  showIsland: (title) => {
    set({ islandActive: true, islandTrack: title })
    setTimeout(() => set({ islandActive: false }), 3500)
  },
}))

// Tracks data
export const TRACKS = [
  { id: 0,  title: 'Stay',              artist: 'Official Tyse', dur: '3:30', secs: 210, ytId: 's_4xyb3ikpM'  },
  { id: 1,  title: 'Foldin',            artist: 'Official Tyse', dur: '3:15', secs: 195, ytId: 'Z3AtmVwPIMY'  },
  { id: 2,  title: 'Ready Set Go',      artist: 'Official Tyse', dur: '3:22', secs: 202, ytId: 'hPJX4tvW83A'  },
  { id: 3,  title: 'Goin',              artist: 'Official Tyse', dur: '3:18', secs: 198, ytId: 'YwCA4fvldl8'  },
  { id: 4,  title: 'FINE SHYT',         artist: 'Official Tyse', dur: '1:00', secs: 60,  ytId: '3zcj6YdMx-o'  },
  { id: 5,  title: 'More Than Friends', artist: 'Official Tyse', dur: '3:45', secs: 225, ytId: 'lK82FJwPNVY'  },
  { id: 6,  title: 'Same Energy',       artist: 'Official Tyse', dur: '3:28', secs: 208, ytId: 'qz1OI2ROEt0'  },
  { id: 7,  title: 'Stretch',           artist: 'Official Tyse', dur: '3:41', secs: 221, ytId: '8ydVPWpSoEo'  },
  { id: 8,  title: "Freakin'",          artist: 'Official Tyse', dur: '3:33', secs: 213, ytId: 'jfiGLsJkNUE'  },
  { id: 9,  title: 'IYKYK',             artist: 'Official Tyse', dur: '3:20', secs: 200, ytId: 'eNVRs77-6PM'  },
  { id: 10, title: 'Baddie',            artist: 'Official Tyse', dur: '3:15', secs: 195, ytId: '-ZdN7MUBdAc'  },
]

export const VIDEOS = [
  { id: 0,  title: 'Stay',              type: 'Official Visual',   year: '2026', badge: 'Featured',  dur: '3:30', ytId: 's_4xyb3ikpM',  url: 'https://www.youtube.com/watch?v=s_4xyb3ikpM'  },
  { id: 1,  title: 'Foldin',            type: 'Audio Visual',      year: '2025', badge: 'Official',  dur: '3:15', ytId: 'Z3AtmVwPIMY',  url: 'https://www.youtube.com/watch?v=Z3AtmVwPIMY'  },
  { id: 2,  title: 'Ready Set Go',      type: 'Audio Visual',      year: '2025', badge: null,        dur: '3:22', ytId: 'hPJX4tvW83A',  url: 'https://www.youtube.com/watch?v=hPJX4tvW83A'  },
  { id: 3,  title: 'Goin',              type: 'Audio Visual',      year: '2025', badge: null,        dur: '3:18', ytId: 'YwCA4fvldl8',  url: 'https://www.youtube.com/watch?v=YwCA4fvldl8'  },
  { id: 4,  title: 'FINE SHYT',         type: 'Short Clip',        year: '2025', badge: 'Exclusive', dur: '1:00', ytId: '3zcj6YdMx-o',  url: 'https://www.youtube.com/watch?v=3zcj6YdMx-o'  },
  { id: 5,  title: 'More Than Friends', type: 'Re-release Visual', year: '2017', badge: null,        dur: '3:45', ytId: 'lK82FJwPNVY',  url: 'https://www.youtube.com/watch?v=lK82FJwPNVY'  },
  { id: 6,  title: 'Same Energy',       type: 'Audio Visual',      year: '2025', badge: null,        dur: '3:28', ytId: 'qz1OI2ROEt0',  url: 'https://www.youtube.com/watch?v=qz1OI2ROEt0'  },
  { id: 7,  title: 'Stretch',           type: 'Lyric Video',       year: '2025', badge: null,        dur: '3:41', ytId: '8ydVPWpSoEo',  url: 'https://www.youtube.com/watch?v=8ydVPWpSoEo'  },
  { id: 8,  title: "Freakin'",          type: 'Audio Visual',      year: '2025', badge: null,        dur: '3:33', ytId: 'jfiGLsJkNUE',  url: 'https://www.youtube.com/watch?v=jfiGLsJkNUE'  },
  { id: 9,  title: 'IYKYK',             type: 'Official Visual',   year: '2025', badge: null,        dur: '3:20', ytId: 'eNVRs77-6PM',  url: 'https://www.youtube.com/watch?v=eNVRs77-6PM'  },
  { id: 10, title: 'Baddie',            type: 'Audio Visual',      year: '2025', badge: 'Exclusive', dur: '3:15', ytId: '-ZdN7MUBdAc',  url: 'https://www.youtube.com/watch?v=-ZdN7MUBdAc'  },
]

export const LINKS = [
  { id: 'spotify',   label: 'Spotify',   sub: 'Stream all records',     icon: '🎵', color: 'rgba(30,215,96,0.12)',   url: 'https://open.spotify.com' },
  { id: 'youtube',   label: 'YouTube',   sub: '@Officaltyce · Visuals', icon: '▶',  color: 'rgba(255,0,0,0.1)',      url: 'https://www.youtube.com/@Officaltyce' },
  { id: 'instagram', label: 'Instagram', sub: '@officialtyce · 16K',    icon: '📸', color: 'rgba(225,48,108,0.1)',   url: 'https://www.instagram.com/officialtyce' },
  { id: 'threads',   label: 'Threads',   sub: '@officialtyce',          icon: '@',  color: 'rgba(255,255,255,0.06)', url: 'https://www.threads.com/@officialtyce' },
]
