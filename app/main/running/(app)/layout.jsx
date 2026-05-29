import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RunningAppLayout({ children }) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) redirect('/login')

  const { data: rtUser } = await supabase
    .from('rt_users')
    .select('onboarding_complete')
    .eq('id', user.id)
    .maybeSingle()

  if (!rtUser?.onboarding_complete) {
    redirect('/main/running/onboarding')
  }

  return (
    <div className="relative">
      <div className="w-full max-w-5xl xl:max-w-7xl mx-auto px-4 pb-6 lg:py-8">
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
