import { create } from 'zustand'

export const usePhoneStore = create((set, get) => ({
  // Screen state
  screen: 'lock', // 'lock' | 'home' | 'app'
  activeApp: null,

  // Music player
  currentTrack: 0,
  isPlaying: false,
  progress: 35,
  islandActive: false,

  // Messages
  chatOpen: false,
  messages: [
    { id: 1, from: 'tyse', text: 'Yo. 9 PM. You already know what it is. 👑', time: '9:00 PM' },
    { id: 2, from: 'tyse', text: 'New record just dropped. Holiday. Go stream it now.', time: '9:00 PM' },
    { id: 3, from: 'tyse', text: 'Stay locked in. More coming. Real soon.', time: '9:01 PM' },
  ],

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

  addMessage: (text) => {
    const msgs = get().messages
    const newMsg = { id: Date.now(), from: 'fan', text, time: '9:00 PM' }
    set({ messages: [...msgs, newMsg] })

    // Auto reply
    const replies = [
      'Appreciate the love fr 🙏',
      'Stay locked in. More coming soon 👑',
      '9 PM every time. That\'s the wave.',
      'Follow @officialtyce for all the updates 🔥',
      'The music speaks for itself. Just listen.',
      'Real ones know. Stay tuned. 🎵',
    ]
    setTimeout(() => {
      set((s) => ({
        messages: [...s.messages, {
          id: Date.now() + 1,
          from: 'tyse',
          text: replies[Math.floor(Math.random() * replies.length)],
          time: '9:0' + (Math.floor(Math.random() * 9) + 1) + ' PM'
        }]
      }))
    }, 1200)
  }
}))

// Tracks data — matches the 11 YouTube videos
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
  { id: 0,  title: 'Stay',              sub: 'Official Tyse · Audio',           dur: '3:30', ytId: 's_4xyb3ikpM',  url: 'https://www.youtube.com/watch?v=s_4xyb3ikpM'  },
  { id: 1,  title: 'Foldin',            sub: 'Official Tyse · Audio',           dur: '3:15', ytId: 'Z3AtmVwPIMY',  url: 'https://www.youtube.com/watch?v=Z3AtmVwPIMY'  },
  { id: 2,  title: 'Ready Set Go',      sub: 'Official Tyse · Audio',           dur: '3:22', ytId: 'hPJX4tvW83A',  url: 'https://www.youtube.com/watch?v=hPJX4tvW83A'  },
  { id: 3,  title: 'Goin',              sub: 'Official Tyse · Audio',           dur: '3:18', ytId: 'YwCA4fvldl8',  url: 'https://www.youtube.com/watch?v=YwCA4fvldl8'  },
  { id: 4,  title: 'FINE SHYT',         sub: 'Official Tyse · Short',           dur: '1:00', ytId: '3zcj6YdMx-o',  url: 'https://www.youtube.com/watch?v=3zcj6YdMx-o'  },
  { id: 5,  title: 'More Than Friends', sub: 'Official Tyse · Re-release 2017', dur: '3:45', ytId: 'lK82FJwPNVY',  url: 'https://www.youtube.com/watch?v=lK82FJwPNVY'  },
  { id: 6,  title: 'Same Energy',       sub: 'Official Tyse · Audio',           dur: '3:28', ytId: 'qz1OI2ROEt0',  url: 'https://www.youtube.com/watch?v=qz1OI2ROEt0'  },
  { id: 7,  title: 'Stretch',           sub: 'Official Tyse · Audio + Lyrics',  dur: '3:41', ytId: '8ydVPWpSoEo',  url: 'https://www.youtube.com/watch?v=8ydVPWpSoEo'  },
  { id: 8,  title: "Freakin'",          sub: 'Official Tyse · Audio',           dur: '3:33', ytId: 'jfiGLsJkNUE',  url: 'https://www.youtube.com/watch?v=jfiGLsJkNUE'  },
  { id: 9,  title: 'IYKYK',             sub: 'Official Tyse',                   dur: '3:20', ytId: 'eNVRs77-6PM',  url: 'https://www.youtube.com/watch?v=eNVRs77-6PM'  },
  { id: 10, title: 'Baddie',            sub: 'Official Tyse · Explicit',        dur: '3:15', ytId: '-ZdN7MUBdAc',  url: 'https://www.youtube.com/watch?v=-ZdN7MUBdAc'  },
]

export const LINKS = [
  { id: 'spotify',   label: 'Spotify',    sub: 'Stream all records',          icon: '🎵', color: 'rgba(30,215,96,0.12)',  url: 'https://open.spotify.com' },
  { id: 'youtube',   label: 'YouTube',    sub: '@Officaltyce · Visuals',      icon: '▶', color: 'rgba(255,0,0,0.1)',     url: 'https://www.youtube.com/@Officaltyce' },
  { id: 'instagram', label: 'Instagram',  sub: '@officialtyce · 16K',         icon: '📸', color: 'rgba(225,48,108,0.1)', url: 'https://www.instagram.com/officialtyce' },
  { id: 'threads',   label: 'Threads',    sub: '@officialtyce',               icon: '@',  color: 'rgba(255,255,255,0.06)', url: 'https://www.threads.com/@officialtyce' },
]
