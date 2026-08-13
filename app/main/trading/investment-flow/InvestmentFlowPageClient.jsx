'use client'

import { useState } from 'react'
import { GitBranch, List, Plus, Share2 } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card'
import PageHeader from '@/app/main/components/PageHeader'
import { useInvestmentFlow } from './hooks/useInvestmentFlow'
import InvestmentTree from './components/InvestmentTree'
import InvestmentFlowTreeView from './components/InvestmentFlowTreeView'
import CategoryNodeForm from './components/CategoryNodeForm'
import TickerNodeForm from './components/TickerNodeForm'
import DeleteNodeDialog from './components/DeleteNodeDialog'
import UninvestedCashNode from './components/UninvestedCashNode'
import UninvestedCashForm from './components/UninvestedCashForm'
import UninvestedCashCategoryForm from './components/UninvestedCashCategoryForm'
import InvestmentFlowEmptyState from './components/InvestmentFlowEmptyState'
import InvestmentFlowSkeleton from './components/InvestmentFlowSkeleton'
import InvestmentFlowErrorState from './components/InvestmentFlowErrorState'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import { cn } from '@/lib/utils'

const PAGE_HEADER = (
  <PageHeader
    title="Investment Flow"
    description="Visualize how your portfolio is allocated across categories and tickers"
    breadcrumbs={[{ label: 'Trading' }, { label: 'Investment Flow' }]}
  />
)

export default function InvestmentFlowPageClient() {
  const {
    tree,
    enrichedFlatNodes,
    rootTotal,
    uninvestedCash,
    cashCategories,
    isLoading,
    isError,
    reload,
    categoryOptions,
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    updateUninvestedCash,
    createCashCategory,
    updateCashCategory,
    deleteCashCategory,
  } = useInvestmentFlow()

  const [viewMode, setViewMode] = useState('list')
  const [categoryFormState, setCategoryFormState] = useState({
    open: false,
    mode: 'create',
    parentId: null,
    node: null,
  })
  const [tickerFormState, setTickerFormState] = useState({
    open: false,
    mode: 'create',
    parentId: null,
    node: null,
  })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uninvestedCashFormOpen, setUninvestedCashFormOpen] = useState(false)
  const [cashCategoryFormState, setCashCategoryFormState] = useState({
    open: false,
    mode: 'create',
    category: null,
  })
  const [deleteCashCategoryTarget, setDeleteCashCategoryTarget] = useState(null)

  const uninvestedCashPct = rootTotal > 0 ? (uninvestedCash / rootTotal) * 100 : 0

  const openAddCategory = (parentId = null) =>
    setCategoryFormState({ open: true, mode: 'create', parentId, node: null })

  const openAddTicker = (parentId) =>
    setTickerFormState({ open: true, mode: 'create', parentId, node: null })

  const openEdit = (node) => {
    if (node.node_type === 'category') {
      setCategoryFormState({ open: true, mode: 'edit', parentId: node.parent_id, node })
    } else {
      setTickerFormState({ open: true, mode: 'edit', parentId: node.parent_id, node })
    }
  }

  const handleCategorySubmit = async (values) => {
    if (categoryFormState.mode === 'edit') {
      return updateNode(categoryFormState.node.id, { name: values.name })
    }
    return createNode({
      parent_id: categoryFormState.parentId,
      node_type: 'category',
      name: values.name,
    })
  }

  const handleTickerSubmit = async (values) => {
    const { nominalType, ...rest } = values
    if (nominalType === 'autosum') {
      if (tickerFormState.mode === 'edit') {
        return updateNode(tickerFormState.node.id, {
          name: rest.name,
          node_type: 'category',
          nominal: null,
          notes: null,
          uninvested_cash_category_id: null,
        })
      }
      return createNode({
        parent_id: tickerFormState.parentId,
        node_type: 'category',
        name: rest.name,
      })
    }
    if (tickerFormState.mode === 'edit') {
      return updateNode(tickerFormState.node.id, { ...rest, node_type: 'ticker' })
    }
    return createNode({ parent_id: tickerFormState.parentId, node_type: 'ticker', ...rest })
  }

  const handleMove = (nodeId, newParentId) => moveNode(nodeId, newParentId)

  const openAddCashCategory = () =>
    setCashCategoryFormState({ open: true, mode: 'create', category: null })

  const openEditCashCategory = (category) =>
    setCashCategoryFormState({ open: true, mode: 'edit', category })

  const handleCashCategorySubmit = async (values) => {
    if (cashCategoryFormState.mode === 'edit') {
      return updateCashCategory(cashCategoryFormState.category.id, values)
    }
    return createCashCategory(values)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {PAGE_HEADER}
        <InvestmentFlowSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {PAGE_HEADER}
        <InvestmentFlowErrorState onRetry={reload} />
      </div>
    )
  }

  return (
    <main className="space-y-6">
      {PAGE_HEADER}

      {tree.length === 0 ? (
        <div className="space-y-6">
          <InvestmentFlowEmptyState onAddCategory={() => openAddCategory(null)} />
          <Card id="uninvestedCashCard_investmentFlowPage">
            <CardContent>
              <UninvestedCashNode
                amount={uninvestedCash}
                percentage={uninvestedCashPct}
                onEdit={() => setUninvestedCashFormOpen(true)}
                categories={cashCategories}
                onAddCategory={openAddCashCategory}
                onEditCategory={openEditCashCategory}
                onDeleteCategory={setDeleteCashCategoryTarget}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card id="investmentFlowTreeCard_investmentFlowPage">
          <CardHeader>
            <CardIcon icon={GitBranch} />
            <CardHeaderContent>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Total: {formatRupiah(rootTotal)}</CardDescription>
            </CardHeaderContent>
            <CardAction className="flex items-center gap-2">
              <div
                role="group"
                aria-label="Toggle view mode"
                className="flex items-center gap-1 rounded-md border p-0.5"
              >
                <Button
                  id="investmentFlowListViewBtn_investmentFlowPage"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                  className={cn(
                    viewMode === 'list'
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  <List className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  id="investmentFlowTreeViewBtn_investmentFlowPage"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Tree canvas view"
                  aria-pressed={viewMode === 'tree'}
                  onClick={() => setViewMode('tree')}
                  className={cn(
                    viewMode === 'tree'
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  <Share2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <Button
                id="investmentFlowAddCategoryBtn_investmentFlowPage"
                size="sm"
                onClick={() => openAddCategory(null)}
              >
                <Plus className="size-4" />
                <span className="hidden sm:inline">Add Category</span>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className={cn(viewMode === 'tree' && 'p-0 overflow-hidden')}>
            {viewMode === 'tree' ? (
              <InvestmentFlowTreeView
                flatNodes={enrichedFlatNodes}
                rootTotal={rootTotal}
                createNode={createNode}
                updateNode={updateNode}
                deleteNode={deleteNode}
                uninvestedCash={uninvestedCash}
                uninvestedCashPct={uninvestedCashPct}
                onEditUninvestedCash={() => setUninvestedCashFormOpen(true)}
                cashCategories={cashCategories}
                createCashCategory={createCashCategory}
                updateCashCategory={updateCashCategory}
                deleteCashCategory={deleteCashCategory}
              />
            ) : (
              <>
                <InvestmentTree
                  tree={tree}
                  categoryOptions={categoryOptions}
                  onAddCategory={openAddCategory}
                  onAddTicker={openAddTicker}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onMove={handleMove}
                />
                <UninvestedCashNode
                  amount={uninvestedCash}
                  percentage={uninvestedCashPct}
                  onEdit={() => setUninvestedCashFormOpen(true)}
                  categories={cashCategories}
                  onAddCategory={openAddCashCategory}
                  onEditCategory={openEditCashCategory}
                  onDeleteCategory={setDeleteCashCategoryTarget}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      <CategoryNodeForm
        open={categoryFormState.open}
        onOpenChange={(open) => setCategoryFormState((prev) => ({ ...prev, open }))}
        mode={categoryFormState.mode}
        initialValues={categoryFormState.node}
        onSubmit={handleCategorySubmit}
      />
      <TickerNodeForm
        open={tickerFormState.open}
        onOpenChange={(open) => setTickerFormState((prev) => ({ ...prev, open }))}
        mode={tickerFormState.mode}
        initialValues={tickerFormState.node}
        onSubmit={handleTickerSubmit}
        cashCategories={cashCategories}
      />
      <DeleteNodeDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        node={deleteTarget}
        onConfirm={deleteNode}
      />
      <UninvestedCashForm
        open={uninvestedCashFormOpen}
        onOpenChange={setUninvestedCashFormOpen}
        initialAmount={uninvestedCash}
        onSubmit={async (values) => {
          const ok = await updateUninvestedCash(values.amount)
          if (ok) setUninvestedCashFormOpen(false)
        }}
      />

      <UninvestedCashCategoryForm
        open={cashCategoryFormState.open}
        onOpenChange={(open) => setCashCategoryFormState((prev) => ({ ...prev, open }))}
        mode={cashCategoryFormState.mode}
        initialValues={cashCategoryFormState.category}
        onSubmit={handleCashCategorySubmit}
      />

      <DeleteNodeDialog
        open={Boolean(deleteCashCategoryTarget)}
        onOpenChange={(open) => !open && setDeleteCashCategoryTarget(null)}
        node={deleteCashCategoryTarget ? { ...deleteCashCategoryTarget, children: [] } : null}
        onConfirm={deleteCashCategory}
      />
    </main>
  )
}
