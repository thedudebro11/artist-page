import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function subscribeEmail(email) {
  const { error } = await supabase
    .from('email_signups')
    .insert({ email })

  if (error) {
    // Duplicate — treat as success so the user isn't confused
    if (error.code === '23505') return { ok: true, duplicate: true }
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
