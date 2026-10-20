export const NOTIFICATION_TYPES = [
  'post_activity',
  'weekly_review',
  'friday_prep',
  'anomaly',
  'race_reminder',
  'product_update',
  'low_stock',
  'pr_achieved',
  'gear_mileage',
  'strava_disconnected',
  'restock_reminder',
  'event_analysis_ready',
  'weekly_summary',
]

// Shown only on this device by the browser (the server can't know a session ended), so they
// never become rows in `app_notifications` — but they still get a push switch.
export const LOCAL_ONLY_TYPES = ['session_ended']

export const PREFERENCE_TYPES = [...NOTIFICATION_TYPES, ...LOCAL_ONLY_TYPES]

export const NOTIFICATION_MODULE = {
  post_activity: 'Running',
  weekly_review: 'Running',
  friday_prep: 'Running',
  anomaly: 'Running',
  race_reminder: 'Running',
  product_update: 'Inventory',
  low_stock: 'Inventory',
  pr_achieved: 'Running',
  gear_mileage: 'Running',
  strava_disconnected: 'Running',
  restock_reminder: 'Inventory',
  event_analysis_ready: 'Trading',
  weekly_summary: 'Home',
  session_ended: 'Account',
}

// Shown in the notification section of the Settings page; keep in step with PREFERENCE_TYPES.
export const NOTIFICATION_LABEL = {
  post_activity: {
    title: 'Post-activity insight',
    description: 'An AI insight after each completed run',
  },
  weekly_review: { title: 'Weekly review', description: 'A weekly training summary' },
  friday_prep: { title: 'Friday race prep', description: 'A weekend plan every Friday' },
  anomaly: { title: 'Anomaly alerts', description: 'Unusual patterns in your training' },
  race_reminder: {
    title: 'Race reminders',
    description: '14, 7, 3, and 1 day before an upcoming race',
  },
  pr_achieved: { title: 'Personal records', description: 'When a run sets a new personal best' },
  gear_mileage: {
    title: 'Gear mileage',
    description: 'When shoes reach their usual replacement range',
  },
  low_stock: { title: 'Low stock', description: 'When a product runs low or runs out' },
  product_update: { title: 'Product updates', description: 'News about new app features' },
  strava_disconnected: {
    title: 'Strava disconnected',
    description: 'When the Strava link breaks and your runs stop syncing',
  },
  restock_reminder: {
    title: 'Restock reminder',
    description: 'When a product is about to run out, based on how fast you use it',
  },
  event_analysis_ready: {
    title: 'Event analysis ready',
    description: 'When the AI analysis of a trading event finishes',
  },
  weekly_summary: {
    title: 'Weekly summary',
    description: 'Monday morning: your week across Running, Trading, and Inventory',
  },
  session_ended: {
    title: 'Session ended',
    description: 'When you are signed out by accident while this tab is in the background',
  },
}
