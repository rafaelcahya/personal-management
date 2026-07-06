'use client'

import { CalendarDays } from 'lucide-react'
import Card from '@/components/base/Card/Card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/base/Accordion/Accordion.jsx'
import { renderMarkdown } from './utils'

function getFirstTwoLines(content) {
  if (!content) return ''
  const lines = content.split('\n').filter((l) => l.trim().length > 0)
  return lines.slice(0, 2).join(' ')
}

export default function WeeklyReviewCard({ weeklyReview }) {
  return (
    <Card
      id="weeklyReviewCard_aiCoachPage"
      aria-label="Latest weekly review"
      className="overflow-visible"
      as="section"
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="weekly-review" className="border-0">
          <AccordionTrigger className="px-4 py-3 items-center hover:no-underline hover:bg-slate-50 focus-visible:ring-violet-200 focus-visible:ring-inset">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <CalendarDays className="h-4 w-4 text-violet-500 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">Weekly Review</p>
                {weeklyReview?.content && (
                  <p className="text-xs text-slate-400 truncate line-clamp-2 whitespace-normal mt-0.5">
                    {getFirstTwoLines(weeklyReview.content)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2 mr-2">
              {weeklyReview?.created_at && (
                <p className="text-xs text-slate-400 hidden sm:block">
                  {new Date(weeklyReview.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-3 border-t border-slate-100">
            <div id="weeklyReviewCardBody_aiCoachPage">
              {!weeklyReview ? (
                <p className="text-sm text-slate-400">
                  No weekly review available yet. Reviews are generated automatically every Sunday.
                </p>
              ) : (
                <>
                  {weeklyReview.created_at && (
                    <p className="text-xs text-slate-400 mb-3 sm:hidden">
                      {new Date(weeklyReview.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  {renderMarkdown(weeklyReview.content)}
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
