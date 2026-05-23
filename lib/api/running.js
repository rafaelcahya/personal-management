export async function saveOnboardingBiometric(payload) {
  const res = await fetch('/api/running/v1/onboarding/biometric', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to save biometric data')
  return data
}

export async function completeOnboarding(payload = {}) {
  const res = await fetch('/api/running/v1/onboarding/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to complete onboarding')
  return data
}

export function redirectToStravaConnect() {
  window.location.href = '/api/running/v1/auth/strava/connect'
}
