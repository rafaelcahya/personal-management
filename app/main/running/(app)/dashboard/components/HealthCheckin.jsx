'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeartPulse } from 'lucide-react'

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
      {logged ? (
        <Card className="border border-green-200 bg-green-50 shadow-sm py-0">
          <CardContent className="px-5 py-5">
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-700">Health Check-in</h3>
              </div>
              <p className="text-xs text-slate-400">Today's sleep, energy, and recovery metrics.</p>
            </div>
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
        <Card className="border border-slate-200/70 shadow-sm py-0">
          <CardContent className="px-5 py-5">
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-700">Health Check-in</h3>
              </div>
              <p className="text-xs text-slate-400">Today's sleep, energy, and recovery metrics.</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  You haven't logged today's health yet
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track sleep, energy, and recovery to improve coaching insights.
                </p>
              </div>
              <Link href="/main/running/settings" className="shrink-0">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white min-w-11">
                  Log today's health
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
