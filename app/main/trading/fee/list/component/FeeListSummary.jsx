'use client'

import { useMemo } from 'react'
import Card, { CardContent } from '@/components/base/Card/Card.jsx'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/base/Accordion/Accordion.jsx'
import { DollarSign, Receipt } from 'lucide-react'

export default function FeeListSummary({ feeCount, totalFee }) {
  const stats = [
    {
      id: 'totalTransactionsSummary_feePage',
      title: 'Total Transactions',
      value: feeCount,
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'totalFeesPaidSummary_feePage',
      title: 'Total Fees Paid',
      value: `Rp ${totalFee.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  return (
    <>
      {/* Desktop View - Always Visible Grid */}
      <div id="feeListSummaryDesktop_feePage" className="hidden sm:grid sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card id={`${stat.id}_desktopView`} key={index}>
              <CardContent className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-xl font-semibold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Mobile View - Accordion */}
      <Accordion
        type="single"
        collapsible
        variant="card"
        id="feeSummaryCollapsible_feePage"
        className="sm:hidden overflow-hidden"
      >
        <AccordionItem value="fee-summary">
          <AccordionTrigger id="feeSummaryCollapsibleTrigger_feePage">
            <div
              id="feeSummaryCollapsibleDefault_feePage"
              className="flex items-center gap-3 min-w-0 flex-1"
            >
              <div className="p-2 rounded-lg bg-red-50 shrink-0">
                <DollarSign className="size-4 text-red-600" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold truncate">Fee Summary</p>
                <p className="text-xs font-medium text-red-600 truncate">
                  Total: Rp {totalFee.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent id="feeSummaryCollapsibleContent_feePage">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    id={`${stat.id}_mobileView`}
                    className="p-3 rounded-lg border bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-md ${stat.bgColor}`}>
                        <Icon className={`size-3.5 ${stat.color}`} />
                      </div>
                      <p className="text-xs font-medium text-slate-600">{stat.title}</p>
                    </div>
                    <p className="text-lg font-bold ml-0.5">{stat.value}</p>
                  </div>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
