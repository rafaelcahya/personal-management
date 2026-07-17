'use client'

import { useCallback, useEffect, useState } from 'react'
import { Microscope } from 'lucide-react'
import PageHeader from '@/app/main/components/PageHeader'
import Card, { CardContent } from '@/components/base/Card/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/Tabs/Tabs'
import Combobox from '@/components/base/Combobox/Combobox'
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@/components/base/EmptyState/EmptyState'
import {
  fetchResearchCorporateEvents,
  fetchResearchOverview,
  fetchResearchTechnicals,
  searchSymbols,
} from '@/lib/api/research'
import OverviewTab from './components/OverviewTab'
import TechnicalsTab from './components/TechnicalsTab'
import CorporateEventsTab from './components/CorporateEventsTab'

const INIT_STATE = { data: null, loading: false, error: null }

const portfolioOptions = (tickers) =>
  tickers.map((t) => ({ value: t, label: t, symbol: t, description: 'Portfolio' }))

export default function ResearchPageClient({ tickers }) {
  const [ticker, setTicker] = useState(tickers[0] ?? null)
  const [comboValue, setComboValue] = useState(
    tickers[0] ? { value: tickers[0], label: tickers[0] } : null
  )
  const [overviewState, setOverviewState] = useState(INIT_STATE)
  const [techState, setTechState] = useState(INIT_STATE)
  const [corpState, setCorpState] = useState(INIT_STATE)

  const fetchSection = useCallback((fn, setState) => {
    return async (t) => {
      setState({ data: null, loading: true, error: null })
      try {
        const data = await fn(t)
        setState({ data, loading: false, error: null })
      } catch (err) {
        setState({ data: null, loading: false, error: err.message || 'Failed to load data' })
      }
    }
  }, [])

  const fetchOverview = useCallback(fetchSection(fetchResearchOverview, setOverviewState), [
    fetchSection,
  ])
  const fetchTechnicals = useCallback(fetchSection(fetchResearchTechnicals, setTechState), [
    fetchSection,
  ])
  const fetchCorporate = useCallback(fetchSection(fetchResearchCorporateEvents, setCorpState), [
    fetchSection,
  ])

  function handleTickerChange(option) {
    setComboValue(option)
    setTicker(option?.value ?? null)
  }

  useEffect(() => {
    if (!ticker) return
    fetchOverview(ticker)
    fetchTechnicals(ticker)
    fetchCorporate(ticker)
  }, [ticker])

  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader
        title="Research"
        description="Analyst intelligence, technicals, and corporate events for US stocks"
        breadcrumbs={[{ label: 'Trading', href: '/main/trading/dashboard' }, { label: 'Research' }]}
      />

      <Card>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <Microscope className="size-4 text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-600 shrink-0">Ticker</span>
          <Combobox
            id="tickerSelector_researchPage"
            value={comboValue}
            onChange={handleTickerChange}
            options={portfolioOptions(tickers)}
            onSearch={searchSymbols}
            placeholder="Select or search ticker…"
            searchPlaceholder="Type to search Finnhub…"
            emptyText="No results found"
            clearable
            className="w-64"
          />
          <span className="text-xs text-slate-400 ml-auto shrink-0">Finnhub · US stocks only</span>
        </div>

        <CardContent className="p-5">
          {!ticker ? (
            <EmptyState>
              <EmptyStateIcon icon={Microscope} />
              <EmptyStateTitle>No ticker selected</EmptyStateTitle>
              <EmptyStateDescription>
                Search any US stock ticker above to view research data.
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            <Tabs defaultValue="overview">
              <TabsList variant="underline">
                <TabsTrigger id="overviewTab_researchPage" value="overview">
                  Overview
                </TabsTrigger>
                <TabsTrigger id="technicalsTab_researchPage" value="technicals">
                  Technicals
                </TabsTrigger>
                <TabsTrigger id="corporateEventsTab_researchPage" value="corporate-events">
                  Corporate Events
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab
                  ticker={ticker}
                  state={overviewState}
                  onRetry={() => fetchOverview(ticker)}
                />
              </TabsContent>

              <TabsContent value="technicals">
                <TechnicalsTab
                  ticker={ticker}
                  state={techState}
                  onRetry={() => fetchTechnicals(ticker)}
                />
              </TabsContent>

              <TabsContent value="corporate-events">
                <CorporateEventsTab
                  ticker={ticker}
                  state={corpState}
                  onRetry={() => fetchCorporate(ticker)}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
