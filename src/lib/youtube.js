const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const CHANNEL_HANDLE = 'Officaltyce'

// Resolves @handle → channel ID, then fetches latest videos
export async function fetchChannelVideos(maxResults = 8) {
  try {
    // Step 1: resolve handle to channel ID
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${CHANNEL_HANDLE}&type=channel&key=${API_KEY}`
    )
    const searchData = await searchRes.json()
    const channelId = searchData.items?.[0]?.id?.channelId
    if (!channelId) throw new Error('Channel not found')

    // Step 2: get uploads playlist ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
    )
    const channelData = await channelRes.json()
    const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsId) throw new Error('Uploads playlist not found')

    // Step 3: fetch videos from uploads playlist
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${API_KEY}`
    )
    const videosData = await videosRes.json()

    // Step 4: batch fetch view counts + durations
    const videoIds = videosData.items.map(v => v.snippet.resourceId.videoId).join(',')
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    )
    const statsData = await statsRes.json()

    const statsMap = {}
    statsData.items?.forEach(v => { statsMap[v.id] = v })

    return videosData.items.map((item, i) => {
      const videoId = item.snippet.resourceId.videoId
      const stats = statsMap[videoId]
      const views = stats?.statistics?.viewCount
        ? formatViews(parseInt(stats.statistics.viewCount))
        : '—'
      const dur = stats?.contentDetails?.duration
        ? parseDuration(stats.contentDetails.duration)
        : '—'

      return {
        id: i,
        title: item.snippet.title,
        sub: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        views,
        dur,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
      }
    })
  } catch (err) {
    console.warn('YouTube API error, using fallback data:', err.message)
    return null
  }
}

function formatViews(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`
  return `${n} views`
}

// ISO 8601 duration (PT4M19S) → "4:19"
function parseDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '—'
  const h = parseInt(match[1] || 0)
  const m = parseInt(match[2] || 0)
  const s = parseInt(match[3] || 0)
  const mm = h > 0 ? `${h}:${String(m).padStart(2, '0')}` : `${m}`
  return `${mm}:${String(s).padStart(2, '0')}`
}
