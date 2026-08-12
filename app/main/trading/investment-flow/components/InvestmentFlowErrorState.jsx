import Card, { CardContent } from '@/components/base/Card/Card'
import State from '@/components/base/State/State'

export default function InvestmentFlowErrorState({ onRetry }) {
  return (
    <Card>
      <CardContent id="investmentFlowErrorState_investmentFlowPage">
        <State
          variant="error"
          title="Failed to load investment flow"
          description="Check your connection and try again"
          action={{ label: 'Try again', onClick: onRetry }}
        />
      </CardContent>
    </Card>
  )
}
