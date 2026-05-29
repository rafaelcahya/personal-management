'use client'

import { BrainCircuit } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AiCoachPlaceholder() {
  return (
    <section id="aiCoachCard" aria-label="AI Coach">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        AI Coach
      </h2>
      <Card className="border border-slate-200/70 shadow-sm py-4">
        <CardContent className="px-5 py-4 flex items-start gap-4">
          <div className="rounded-full bg-violet-50 p-3 shrink-0">
            <BrainCircuit className="w-6 h-6 text-violet-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Personalized coaching coming soon</p>
            <p className="text-xs text-slate-400 mt-1">
              AI insights coming soon — complete more activities to unlock personalized coaching.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
