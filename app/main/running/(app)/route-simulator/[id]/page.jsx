'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AlertCircle, ArrowLeft, Mountain, SearchX } from 'lucide-react'
import Card, {
  CardContent,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
} from '@/components/base/Card/Card'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import PageHeader from '@/app/main/components/PageHeader'
import SimulationResult from '../components/SimulationResult'
import useRouteStrategy from '../hooks/useRouteStrategy'
import normalizeSimulation from '../utils/normalizeSimulation'
import { fetchRouteSimulation } from '@/lib/api/running'

const LIST_HREF = '/main/running/route-simulator'

export default function RouteSimulationDetailPage() {
  const { id } = useParams()
  const [simulation, setSimulation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const { aiStrategy, setAiStrategy, strategyLoading, strategyError, generateStrategy } =
    useRouteStrategy()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      const row = await fetchRouteSimulation(id)
      setSimulation(normalizeSimulation(row))
      setAiStrategy(row.ai_strategy ?? null)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        window.location.href = '/login'
        return
      }
      // Unknown, foreign and malformed ids all look the same to the user
      if (err.status === 404 || err.status === 400) setNotFound(true)
      else setError(err.message || 'Failed to load simulation')
    } finally {
      setLoading(false)
    }
  }, [id, setAiStrategy])

  useEffect(() => {
    load()
  }, [load])

  return (
    <main id="routeSimulationDetailPage" className="space-y-6">
      <PageHeader
        title={simulation?.name ?? 'Simulation'}
        backHref={LIST_HREF}
        breadcrumbs={[
          { label: 'Running', href: '/main/running/dashboard' },
          { label: 'Route Simulator', href: LIST_HREF },
          { label: simulation?.name ?? 'Detail' },
        ]}
      />

      {loading && (
        <div
          id="routeSimulationDetailLoading_routeSimulationDetailPage"
          role="status"
          className="space-y-4"
        >
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <span className="sr-only">Loading simulation</span>
        </div>
      )}

      {!loading && notFound && (
        <div
          id="routeSimulationNotFound_routeSimulationDetailPage"
          role="alert"
          className="flex flex-col items-center gap-3 py-20 text-center"
        >
          <SearchX className="size-6 text-slate-400" aria-hidden="true" />
          <p className="text-sm text-slate-500">
            This simulation was not found. It may have been deleted.
          </p>
          <Button
            id="notFoundBackBtn_routeSimulationDetailPage"
            asChild
            variant="ghost"
            className="text-violet-600"
          >
            <Link href={LIST_HREF}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Route Simulator
            </Link>
          </Button>
        </div>
      )}

      {!loading && error && (
        <div
          id="routeSimulationError_routeSimulationDetailPage"
          role="alert"
          className="flex flex-col items-center gap-3 py-20 text-center"
        >
          <AlertCircle className="size-6 text-red-400" aria-hidden="true" />
          <p className="text-sm text-slate-500">{error}</p>
          <Button
            id="retryBtn_routeSimulationDetailPage"
            variant="ghost"
            onClick={load}
            className="text-violet-600"
          >
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && !notFound && simulation && (
        <Card
          as="section"
          aria-label="Simulation result"
          id="routeSimulationResultCard_routeSimulationDetailPage"
        >
          <CardHeader>
            <CardIcon icon={Mountain} />
            <CardHeaderContent>
              <CardTitle>{simulation.name}</CardTitle>
              <CardDescription>
                Per-km plan that keeps your effort even across the climbs
              </CardDescription>
            </CardHeaderContent>
          </CardHeader>
          <CardContent>
            <SimulationResult
              result={simulation}
              simulationId={simulation.id}
              aiStrategy={aiStrategy}
              onSave={() => {}}
              saving={false}
              onGenerateStrategy={() => generateStrategy(simulation.id)}
              strategyLoading={strategyLoading}
              strategyError={strategyError}
            />
          </CardContent>
        </Card>
      )}
    </main>
  )
}
