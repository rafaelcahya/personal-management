import NotificationsView from './components/NotificationsView'

export default function NotificationsPage() {
  return (
    <div id="notificationsPage" className="w-full px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">Alerts from Inventory, Trading, and Running</p>
      </div>
      <NotificationsView />
    </div>
  )
}
