// Lightweight pub/sub so notification read-state changes in one place
// (e.g. the /main/notifications page) can update the navbar bell badge live.

const listeners = new Set()

export function emitNotificationsChanged() {
  listeners.forEach((fn) => fn())
}

export function onNotificationsChanged(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
