'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  ShieldCheck,
  ShieldOff,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/base/Button/Button'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { toast } from 'sonner'

const STEP_IDLE = 'idle'
const STEP_SCAN = 'scan'
const STEP_CONFIRM_DISABLE = 'confirm_disable'

export default function TwoFactorSection() {
  const supabase = createClient()

  const [factor, setFactor] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState(null)

  const [step, setStep] = useState(STEP_IDLE)
  const [enrollData, setEnrollData] = useState(null)
  const [enrollLoading, setEnrollLoading] = useState(false)

  const [code, setCode] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState(null)

  const [disableLoading, setDisableLoading] = useState(false)
  const [disableError, setDisableError] = useState(null)

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadStatus()
  }, [])

  async function loadStatus() {
    setStatusLoading(true)
    setStatusError(null)
    try {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) throw error
      setFactor(data?.totp?.[0] ?? null)
    } catch (err) {
      setStatusError(err.message || 'Failed to load MFA status')
    } finally {
      setStatusLoading(false)
    }
  }

  async function handleStartEnroll() {
    setEnrollLoading(true)
    setVerifyError(null)
    try {
      // Remove any leftover unverified factors from previous incomplete attempts
      const { data: existing } = await supabase.auth.mfa.listFactors()
      const unverified = existing?.totp?.filter((f) => f.status === 'unverified') ?? []
      for (const f of unverified) {
        await supabase.auth.mfa.unenroll({ factorId: f.id })
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      })
      if (error) throw error
      setEnrollData(data)
      setStep(STEP_SCAN)
      setCode('')
    } catch (err) {
      toast.error('Failed to start setup. Please try again.')
    } finally {
      setEnrollLoading(false)
    }
  }

  async function handleVerifyEnroll(e) {
    e.preventDefault()
    if (code.length !== 6) return

    setVerifyLoading(true)
    setVerifyError(null)
    try {
      const { data: challengeData, error: challengeErr } = await supabase.auth.mfa.challenge({
        factorId: enrollData.id,
      })
      if (challengeErr) throw challengeErr

      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId: enrollData.id,
        challengeId: challengeData.id,
        code,
      })
      if (verifyErr) throw verifyErr

      toast.success('Two-factor authentication enabled.')
      setStep(STEP_IDLE)
      setEnrollData(null)
      setCode('')
      await loadStatus()
    } catch (err) {
      const msg =
        err.message?.toLowerCase().includes('invalid') ||
        err.message?.toLowerCase().includes('totp')
          ? 'Invalid code. Check your authenticator app and try again.'
          : err.message || 'Verification failed.'
      setVerifyError(msg)
      setCode('')
    } finally {
      setVerifyLoading(false)
    }
  }

  async function handleDisable() {
    if (!factor) return
    setDisableLoading(true)
    setDisableError(null)
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id })
      if (error) throw error
      toast.success('Two-factor authentication disabled.')
      setStep(STEP_IDLE)
      setFactor(null)
    } catch (err) {
      setDisableError(err.message || 'Failed to disable. Please try again.')
    } finally {
      setDisableLoading(false)
    }
  }

  function handleCancelEnroll() {
    setStep(STEP_IDLE)
    setEnrollData(null)
    setCode('')
    setVerifyError(null)
  }

  async function handleCopySecret() {
    if (!enrollData?.totp?.secret) return
    await navigator.clipboard.writeText(enrollData.totp.secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isEnabled = !!factor

  return (
    <Card as="section" aria-label="Two-factor authentication" id="twoFactorSection_security">
      <CardHeader>
        <CardIcon icon={KeyRound} />
        <CardHeaderContent>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security using an authenticator app
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="p-0">
        {statusLoading ? (
          <div id="twoFactorLoading_security" className="px-5 py-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-56 rounded" />
          </div>
        ) : statusError ? (
          <div className="px-5 py-4">
            <p className="text-sm text-red-600">{statusError}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={loadStatus}>
              Retry
            </Button>
          </div>
        ) : step === STEP_IDLE ? (
          <div className="flex flex-col divide-y divide-slate-100">
            {/* Status row */}
            <div
              id={isEnabled ? 'twoFactorEnabledState_security' : 'twoFactorDisabledState_security'}
              className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                {isEnabled ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Enabled</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Your account is protected with an authenticator app.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldOff className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Not enabled</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Protect your account with Google Authenticator, Authy, or any TOTP app.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isEnabled ? (
                <Button
                  id="disableMfaBtn_security"
                  variant="outline"
                  className="shrink-0 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-200"
                  onClick={() => {
                    setStep(STEP_CONFIRM_DISABLE)
                    setDisableError(null)
                  }}
                >
                  <ShieldOff className="w-4 h-4 mr-2" aria-hidden="true" />
                  Disable
                </Button>
              ) : (
                <Button
                  id="enableMfaBtn_security"
                  onClick={handleStartEnroll}
                  disabled={enrollLoading}
                  className="shrink-0"
                >
                  {enrollLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                      Setting up…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" aria-hidden="true" />
                      Enable
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : step === STEP_SCAN ? (
          /* Enrollment: scan QR + enter code */
          <div className="px-5 py-5 flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium text-slate-800 mb-1">Step 1 — Scan this QR code</p>
              <p className="text-xs text-slate-500 mb-4">
                Open your authenticator app (Google Authenticator, Authy, etc.) and scan the QR code
                below.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div
                  id="mfaQrCode_security"
                  className="p-3 border border-slate-200 rounded-xl bg-white inline-block"
                >
                  {enrollData?.totp?.uri ? (
                    <QRCodeSVG value={enrollData.totp.uri} size={160} level="M" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                    Manual entry key
                  </p>
                  <div className="flex items-center gap-2">
                    <code
                      id="mfaSecret_security"
                      className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 break-all"
                    >
                      {enrollData?.totp?.secret}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleCopySecret}
                      aria-label="Copy secret key"
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleVerifyEnroll} className="flex flex-col gap-3">
              <p className="text-sm font-medium text-slate-800">Step 2 — Enter the 6-digit code</p>
              <div className="flex flex-col gap-1.5">
                <input
                  id="mfaVerifyCode_security"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    setVerifyError(null)
                  }}
                  disabled={verifyLoading}
                  className="w-40 text-center text-xl font-mono tracking-[0.4em] px-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium disabled:opacity-50"
                  aria-label="6-digit code from authenticator app"
                  aria-invalid={!!verifyError}
                />
                {verifyError && (
                  <div
                    className="flex items-center gap-1.5 text-xs text-red-600"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {verifyError}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  id="confirmEnrollBtn_security"
                  type="submit"
                  disabled={verifyLoading || code.length !== 6}
                >
                  {verifyLoading ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                      Verifying…
                    </>
                  ) : (
                    'Activate'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelEnroll}
                  disabled={verifyLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : step === STEP_CONFIRM_DISABLE ? (
          /* Disable confirmation */
          <div id="disableConfirmState_security" className="px-5 py-4 flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Disable two-factor authentication?
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Your account will only be protected by your Google account password.
                </p>
              </div>
            </div>

            {disableError && (
              <div
                className="flex items-center gap-1.5 text-sm text-red-600"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {disableError}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                id="confirmDisableBtn_security"
                variant="destructive"
                onClick={handleDisable}
                disabled={disableLoading}
              >
                {disableLoading ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                    Disabling…
                  </>
                ) : (
                  'Yes, disable'
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(STEP_IDLE)
                  setDisableError(null)
                }}
                disabled={disableLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
