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
]

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
}

// Shown in the notification section of the Settings page; keep in step with NOTIFICATION_TYPES.
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
}
