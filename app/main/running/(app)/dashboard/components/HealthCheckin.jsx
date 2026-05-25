'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const HEALTH_LABELS = {
  sleep_hours: 'Sleep',
  sleep_quality: 'Sleep quality',
  morning_energy: 'Energy',
  mood: 'Mood',
  soreness_level: 'Soreness',
}

export default function HealthCheckin({ data }) {
  const { logged, data: healthData } = data

  return (
    <section id="healthCheckinCard" aria-label="Health check-in">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Health Check-in
      </h2>
      {logged ? (
        <Card className="border border-green-200 bg-green-50 shadow-sm">
          <CardContent className="px-5 py-4">
            <p className="text-sm font-semibold text-green-700 mb-3">Today's health logged</p>
            {healthData ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(HEALTH_LABELS).map(([key, label]) => {
                  const val = healthData[key]
                  if (val == null) return null
                  return (
                    <div key={key} className="flex flex-col gap-0.5">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className="text-sm font-medium text-slate-800">{val}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Health details unavailable.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200/70 shadow-sm">
          <CardContent className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-700">
                You haven't logged today's health yet
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Track sleep, energy, and recovery to improve coaching insights.
              </p>
            </div>
            <Link href="/main/running/settings" className="shrink-0">
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white min-h-11 min-w-11"
              >
                Log today's health
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
