'use client'

import { CheckCircle2, AlertTriangle, XCircle, Smartphone } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'

const PERMISSION_TEXT = {
  granted: { label: 'Allowed', tone: 'text-success' },
  denied: { label: 'Blocked', tone: 'text-destructive' },
  default: { label: 'Not asked yet', tone: 'text-slate-500' },
  unsupported: { label: 'Not supported in this browser', tone: 'text-slate-500' },
}

const ERROR_TEXT = {
  subscription_expired: 'the subscription expired',
  push_rejected: 'the push service rejected the message',
  vapid_not_configured: 'push keys are not configured on the server',
  endpoint_not_allowed: 'the subscription points to an unsupported push service',
  invalid_subscription: 'the stored subscription is invalid',
  push_send_failed: 'sending failed',
}

export const errorText = (code) => ERROR_TEXT[code] ?? 'sending failed'

function formatWhen(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function deviceState(status, deviceEndpoint) {
  if (!status?.enabled || !status.endpoint)
    return { key: 'none', label: 'Not subscribed', icon: XCircle, tone: 'text-slate-500' }
  if (deviceEndpoint && deviceEndpoint === status.endpoint)
    return {
      key: 'this',
      label: 'This device is subscribed',
      icon: CheckCircle2,
      tone: 'text-success',
    }
  return {
    key: 'other',
    label: 'Another device is subscribed',
    icon: AlertTriangle,
    tone: 'text-warning',
  }
}

export default function PushStatusPanel({
  permission,
  status,
  loading,
  error,
  onRetry,
  deviceEndpoint,
  onTest,
  testing,
  testResult,
}) {
  if (loading) {
    return (
      <div id="pushStatusLoading_settingsPage" className="mx-5 mb-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-48 rounded" />
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-9 w-44 rounded" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        id="pushStatusError_settingsPage"
        role="alert"
        className="mx-5 mb-4 flex flex-col items-start gap-2"
      >
        <p className="text-xs text-destructive">Couldn&apos;t load the push status.</p>
        <Button id="pushStatusRetryBtn_settingsPage" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  const perm = PERMISSION_TEXT[permission] ?? PERMISSION_TEXT.unsupported
  const device = deviceState(status, deviceEndpoint)
  const DeviceIcon = device.icon
  const canTest = permission === 'granted' && device.key === 'this'
  const lastSuccess = formatWhen(status?.last_success?.created_at)
  const lastFailure = status?.last_failure

  return (
    <div
      id="pushStatusPanel_settingsPage"
      className="mx-5 mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col gap-2"
    >
      <dl className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        <dt className="text-slate-500">Browser permission</dt>
        <dd id="pushPermissionStatus_settingsPage" className={`font-medium ${perm.tone}`}>
          {perm.label}
        </dd>

        <dt className="text-slate-500">This device</dt>
        <dd
          id="pushDeviceStatus_settingsPage"
          className={`font-medium flex items-center gap-1 ${device.tone}`}
        >
          <DeviceIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {device.label}
        </dd>

        <dt className="text-slate-500">Last delivered</dt>
        <dd id="pushLastSuccess_settingsPage" className="text-slate-700">
          {lastSuccess ? `${lastSuccess} (${status.last_success.source})` : 'Never'}
        </dd>

        {lastFailure && (
          <>
            <dt className="text-slate-500">Last problem</dt>
            <dd id="pushLastFailure_settingsPage" className="text-destructive">
              {formatWhen(lastFailure.created_at)} — {errorText(lastFailure.error)}
              {lastFailure.status_code ? ` (${lastFailure.status_code})` : ''} ·{' '}
              {lastFailure.source}
            </dd>
          </>
        )}
      </dl>

      {permission === 'denied' && (
        <p id="pushBlockedHelp_settingsPage" className="text-xs text-slate-600">
          Notifications are blocked for this site. Open the site settings (the lock or tune icon
          next to the address bar), allow Notifications, reload the page, then turn push on again.
        </p>
      )}

      {device.key === 'other' && permission === 'granted' && (
        <p id="pushOtherDeviceHelp_settingsPage" className="text-xs text-slate-600">
          Only one device can receive pushes for now. Turn push off and on again here to move them
          to this device.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button
          id="sendTestPushBtn_settingsPage"
          variant="secondary"
          onClick={onTest}
          disabled={!canTest || testing}
          className="min-h-11 sm:min-h-9"
        >
          <Smartphone className="h-4 w-4" aria-hidden="true" />
          {testing ? 'Sending…' : 'Send test notification'}
        </Button>
        {testResult && (
          <p
            id="sendTestPushResult_settingsPage"
            role="status"
            className={`text-xs ${testResult.ok ? 'text-success' : 'text-destructive'}`}
          >
            {testResult.message}
          </p>
        )}
      </div>
    </div>
  )
}
