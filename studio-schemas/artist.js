export default {
  name: 'artist',
  title: 'Artist Profile',
  type: 'document',
  fields: [
    { name: 'name',    title: 'Name',    type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'string', description: 'Shows under name on Connect screen' },
    { name: 'bio',     title: 'Bio',     type: 'text',   rows: 4 },
    { name: 'photo',   title: 'Profile Photo', type: 'image', options: { hotspot: true } },
  ],
}
