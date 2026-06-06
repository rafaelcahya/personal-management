import webpush from 'web-push'

export async function sendPushNotification(subscription, payload) {
  if (!subscription?.endpoint) {
    return { sent: false, error: 'invalid_subscription' }
  }

  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? '/main/running/dashboard',
  })

  try {
    await webpush.sendNotification(subscription, notificationPayload)
    return { sent: true }
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      return { sent: false, error: 'subscription_expired', expired: true }
    }
    console.error('[sendPushNotification]', err)
    return { sent: false, error: 'push_send_failed' }
  }
}
