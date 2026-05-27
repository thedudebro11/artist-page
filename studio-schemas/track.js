export default {
  name: 'track', title: 'Track', type: 'document',
  fields: [
    { name: 'title',      title: 'Title',           type: 'string' },
    { name: 'artist',     title: 'Artist',          type: 'string' },
    { name: 'duration',   title: 'Duration',        type: 'string', description: 'e.g. 3:42' },
    { name: 'seconds',    title: 'Duration (secs)', type: 'number' },
    { name: 'spotifyUrl', title: 'Spotify URL',     type: 'url' },
    { name: 'order',      title: 'Order',           type: 'number' },
  ],
}
