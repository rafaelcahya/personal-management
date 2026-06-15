import { requireAuth } from '@/lib/auth/utils'
import Sidebar from './components/Sidebar'
import NextTopLoader from 'nextjs-toploader'

export default async function MainLayout({ children }) {
  const user = await requireAuth()

  return (
    <>
      <NextTopLoader color="#7c3aed" height={3} showSpinner={false} />
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar user={user} />
        {/* pt-14 on mobile to clear the fixed top bar; removed on md+ */}
        <main className="flex-1 overflow-y-auto min-w-0 pt-14 md:pt-0">{children}</main>
      </div>
    </>
  )
}
