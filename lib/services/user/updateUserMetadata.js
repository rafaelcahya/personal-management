/**
 * Update the signed-in user's profile metadata with their own access token (Bearer requests have
 * no cookie session for auth.updateUser()). The Auth server applies the same rules as the cookie
 * path: null deletes a key, and a revoked or signed-out session is rejected. No service role.
 * Throws an Error with .status set to the Auth server's HTTP status on failure.
 * @param {string} accessToken the caller's own token, already verified by the request pipeline
 * @param {Record<string, unknown>} metadata
 */
export async function updateUserMetadata(accessToken, metadata) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: metadata }),
  })
  if (!res.ok) {
    const error = new Error('Auth server rejected the profile update')
    error.status = res.status
    throw error
  }
}
