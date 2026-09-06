import { requireAuth } from '@/lib/auth/utils'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { NavShellProvider } from './components/NavShellProvider'
import { UserProfileProvider } from './components/UserProfileProvider'
import NextTopLoader from 'nextjs-toploader'

export default async function MainLayout({ children }) {
  const user = await requireAuth()

  return (
    <UserProfileProvider>
      <NextTopLoader color="var(--color-violet-600)" height={3} showSpinner={false} />
      <NavShellProvider>
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col min-w-0">
            <Navbar user={user} />
            <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
          </div>
        </div>
      </NavShellProvider>
    </UserProfileProvider>
  )
}
