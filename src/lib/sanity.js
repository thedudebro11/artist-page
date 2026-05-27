import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

export const QUERIES = {
  artist: `*[_type == "artist"][0]{
    name, tagline, bio, "photo": photo.asset->url
  }`,

  tracks: `*[_type == "track"] | order(order asc) {
    _id, title, artist, duration, seconds, spotifyUrl
  }`,

  videos: `*[_type == "video"] | order(order asc) {
    _id, title, subtitle, views, duration, youtubeId
  }`,

  links: `*[_type == "link"] | order(order asc) {
    _id, label, sub, icon, color, url
  }`,

  storeItems: `*[_type == "storeItem"] | order(order asc) {
    _id, name, price, emoji, available
  }`,

  gallery: `*[_type == "galleryPhoto"] | order(order asc) {
    _id, caption, "url": photo.asset->url
  }`,
}
