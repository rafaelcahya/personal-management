import { useState } from 'react'
import { generateRouteStrategy } from '@/lib/api/running'

export default function useRouteStrategy(initial = null) {
  const [aiStrategy, setAiStrategy] = useState(initial)
  const [strategyLoading, setStrategyLoading] = useState(false)
  const [strategyError, setStrategyError] = useState(null)

  async function generateStrategy(simulationId) {
    if (!simulationId) return
    setStrategyLoading(true)
    setStrategyError(null)
    try {
      setAiStrategy(await generateRouteStrategy(simulationId))
    } catch (err) {
      setStrategyError(err.message || 'Failed to generate strategy')
    } finally {
      setStrategyLoading(false)
    }
  }

  return {
    aiStrategy,
    setAiStrategy,
    strategyLoading,
    strategyError,
    setStrategyError,
    generateStrategy,
  }
}
