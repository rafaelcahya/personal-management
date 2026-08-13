'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Loader2, ShieldCheck } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/base/Card/Card'
import { toast } from 'sonner'

function VerifyMfaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (code.length !== 6) return

    setLoading(true)
    setError(null)

    try {
      const { data: factorsData, error: factorsErr } = await supabase.auth.mfa.listFactors()
      if (factorsErr) throw factorsErr

      const totpFactor = factorsData?.totp?.[0]
      if (!totpFactor) throw new Error('No authenticator app found. Contact support.')

      const { data: challengeData, error: challengeErr } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      })
      if (challengeErr) throw challengeErr

      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challengeData.id,
        code,
      })
      if (verifyErr) throw verifyErr

      const next = searchParams.get('next') || '/main/inventory'
      const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/main/inventory'
      router.push(safeNext)
    } catch (err) {
      const msg =
        err.message?.includes('Invalid TOTP code') || err.message?.includes('invalid')
          ? 'Invalid code. Check your authenticator app and try again.'
          : err.message || 'Verification failed. Please try again.'
      setError(msg)
      toast.error(msg)
      setCode('')
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(val)
    setError(null)
  }

  return (
    <div id="verifyMfaPage" className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <LayoutDashboard className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-foreground tracking-wide">Personal Management</p>
        </div>

        <Card className="w-full">
          <CardHeader className="flex-col text-center gap-0">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-violet-600" aria-hidden="true" />
              </div>
            </div>
            <CardTitle className="text-lg">Two-factor authentication</CardTitle>
            <CardDescription className="text-sm">
              Open your authenticator app and enter the 6-digit code.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="mfaCode_verifyMfaPage"
                  className="text-sm font-medium text-foreground"
                >
                  Authentication code
                </label>
                <input
                  ref={inputRef}
                  id="mfaCode_verifyMfaPage"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  value={code}
                  onChange={handleCodeChange}
                  disabled={loading}
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 disabled:opacity-50"
                  aria-label="6-digit authentication code"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'mfaError_verifyMfaPage' : undefined}
                />
                {error && (
                  <p
                    id="mfaError_verifyMfaPage"
                    className="text-xs text-red-600"
                    role="alert"
                    aria-live="assertive"
                  >
                    {error}
                  </p>
                )}
              </div>

              <Button
                id="verifyMfaBtn_verifyMfaPage"
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Verifying…
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyMfaPage() {
  return (
    <Suspense>
      <VerifyMfaContent />
    </Suspense>
  )
}
