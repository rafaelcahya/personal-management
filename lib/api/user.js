export async function getUser() {
  const res = await fetch('/api/user', { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch user')
  return data
}

export async function updateUser(payload) {
  const res = await fetch('/api/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update user')
  return data
}

export async function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/user/avatar', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    let errorText = 'Failed to upload avatar'
    try {
      const data = await res.json()
      errorText = data.error || errorText
    } catch {
      errorText = await res.text()
    }
    throw new Error(errorText)
  }

  const data = await res.json()
  return { url: data.publicUrl, path: data.path }
}
