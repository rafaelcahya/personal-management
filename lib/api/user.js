export async function getUser() {
  const res = await fetch('/api/user', { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch user')
  return data.data.user
}

export async function updateUser(payload) {
  const res = await fetch('/api/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to update profile')
  return data.data.user
}

// Uploads the file to Supabase Storage. Returns { path, url }; the caller must persist
// the public url via updateUser({ avatar: url }) since this endpoint doesn't save it.
export async function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/user/avatar', { method: 'POST', body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to upload avatar')
  return data.data
}
