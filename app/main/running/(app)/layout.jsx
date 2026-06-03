import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RunningAppShell from './components/RunningAppShell'

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

  return <RunningAppShell>{children}</RunningAppShell>
}
