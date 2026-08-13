'use client'

import { useMemo, useState } from 'react'
import dagre from '@dagrejs/dagre'
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  FolderTree,
  Layers,
  Pencil,
  Plus,
  Tag as TagIcon,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Badge } from '@/components/base/Badge/Badge'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import CategoryNodeForm from './CategoryNodeForm'
import TickerNodeForm from './TickerNodeForm'
import DeleteNodeDialog from './DeleteNodeDialog'
import UninvestedCashCategoryForm from './UninvestedCashCategoryForm'

const NODE_WIDTH = 240
const ROOT_NODE_HEIGHT = 80
const CATEGORY_NODE_HEIGHT = 110
const TICKER_NODE_HEIGHT = 130
const CASH_NODE_HEIGHT = 110
const CASH_CATEGORY_NODE_HEIGHT = 90
const VIRTUAL_ROOT_ID = '__portfolio_root__'
const UNINVESTED_CASH_ID = '__uninvested_cash__'

function nodeHeightFor(n) {
  if (n.type === 'tickerNode') return TICKER_NODE_HEIGHT
  if (n.type === 'rootNode') return ROOT_NODE_HEIGHT
  if (n.type === 'cashNode') return CASH_NODE_HEIGHT
  if (n.type === 'cashCategoryNode') return CASH_CATEGORY_NODE_HEIGHT
  return CATEGORY_NODE_HEIGHT
}

// Main investment tree uses LR dagre layout.
// Cash branch (cash node + its categories) uses a separate RL dagre layout
// and is translated so the cash node sits to the LEFT of the portfolio root.
function getLayoutedElements(nodes, edges, cashNodeId, rootNodeId, cashCategoryIds) {
  const cashCategorySet = new Set(cashCategoryIds)

  const mainNodes = nodes.filter((n) => n.id !== cashNodeId && !cashCategorySet.has(n.id))
  const mainEdges = edges.filter((e) => e.target !== cashNodeId && !cashCategorySet.has(e.target))

  const gMain = new dagre.graphlib.Graph()
  gMain.setDefaultEdgeLabel(() => ({}))
  gMain.setGraph({ rankdir: 'LR', nodesep: 40, ranksep: 80 })
  mainNodes.forEach((n) => gMain.setNode(n.id, { width: NODE_WIDTH, height: nodeHeightFor(n) }))
  mainEdges.forEach((e) => gMain.setEdge(e.source, e.target))
  dagre.layout(gMain)

  const layoutedMain = mainNodes.map((n) => {
    const { x, y } = gMain.node(n.id)
    return { ...n, position: { x: x - NODE_WIDTH / 2, y: y - nodeHeightFor(n) / 2 } }
  })

  const rootPos = layoutedMain.find((n) => n.id === rootNodeId)?.position ?? { x: 0, y: 0 }

  // Cash branch: RL dagre (cash node is source → categories are targets)
  // In RL layout, source sits to the RIGHT, targets expand LEFT — exactly what we want.
  const cashNode = nodes.find((n) => n.id === cashNodeId)
  const cashCategoryNodes = nodes.filter((n) => cashCategorySet.has(n.id))

  const cashBranchNodes = cashNode ? [cashNode, ...cashCategoryNodes] : []

  let layoutedCash = []

  if (cashNode && cashBranchNodes.length > 0) {
    if (cashCategoryNodes.length === 0) {
      // No categories: position cash node directly to the left of portfolio root
      const cashX = rootPos.x - NODE_WIDTH - 80
      const cashY = rootPos.y + (ROOT_NODE_HEIGHT - CASH_NODE_HEIGHT) / 2
      layoutedCash = [{ ...cashNode, position: { x: cashX, y: cashY } }]
    } else {
      const gCash = new dagre.graphlib.Graph()
      gCash.setDefaultEdgeLabel(() => ({}))
      // RL: cash (source, rank 0) is rightmost; categories (targets) expand left
      gCash.setGraph({ rankdir: 'RL', nodesep: 40, ranksep: 80 })
      cashBranchNodes.forEach((n) =>
        gCash.setNode(n.id, { width: NODE_WIDTH, height: nodeHeightFor(n) })
      )
      cashCategoryNodes.forEach((cat) => gCash.setEdge(cashNodeId, cat.id))
      dagre.layout(gCash)

      // Translate: cash node center aligns to the left of portfolio root
      const cashInDagre = gCash.node(cashNodeId)
      const targetCashX = rootPos.x - NODE_WIDTH - 80
      const targetCashY = rootPos.y + (ROOT_NODE_HEIGHT - CASH_NODE_HEIGHT) / 2
      const offsetX = targetCashX - (cashInDagre.x - NODE_WIDTH / 2)
      const offsetY = targetCashY - (cashInDagre.y - CASH_NODE_HEIGHT / 2)

      layoutedCash = cashBranchNodes.map((n) => {
        const { x, y } = gCash.node(n.id)
        return {
          ...n,
          position: { x: x - NODE_WIDTH / 2 + offsetX, y: y - nodeHeightFor(n) / 2 + offsetY },
        }
      })
    }
  }

  return { nodes: [...layoutedMain, ...layoutedCash], edges }
}

function RootNodeCard({ data }) {
  const { rootTotal } = data
  return (
    <div
      id="treeViewRootNode_investmentFlowPage"
      className="border-2 border-violet-300 rounded-xl bg-violet-50 shadow-sm p-3 w-[240px]"
    >
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Left} id="left" />
      <div className="flex items-center gap-2 min-w-0">
        <Layers className="size-4 text-violet-600 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-violet-800 truncate">Portfolio</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-violet-600 whitespace-nowrap">{formatRupiah(rootTotal)}</span>
        <Badge className="bg-violet-200 text-violet-800 border-transparent" size="sm">
          100%
        </Badge>
      </div>
    </div>
  )
}

function CategoryNodeCard({ data }) {
  const { node, onAddCategory, onAddTicker, onEdit, onDelete } = data

  return (
    <div
      id={`treeViewCategoryNode_${node.id}_investmentFlowPage`}
      className="border rounded-xl bg-white shadow-sm p-3 w-[240px]"
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="flex items-center gap-2 min-w-0">
        <FolderTree className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800 truncate" title={node.name}>
          {node.name}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatRupiah(node.computedNominal)}
        </span>
        <Badge className="bg-violet-100 text-violet-700 border-transparent" size="sm">
          {node.percentage.toFixed(1)}%
        </Badge>
      </div>

      <div className="flex items-center gap-1 mt-3">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Add category under ${node.name}`}
          id={`treeViewAddCategoryBtn_${node.id}_investmentFlowPage`}
          onClick={() => onAddCategory(node.id)}
        >
          <FolderTree className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Add node under ${node.name}`}
          id={`treeViewAddTickerBtn_${node.id}_investmentFlowPage`}
          onClick={() => onAddTicker(node.id)}
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit ${node.name}`}
          id={`treeViewEditBtn_${node.id}_investmentFlowPage`}
          onClick={() => onEdit(node)}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${node.name}`}
          id={`treeViewDeleteBtn_${node.id}_investmentFlowPage`}
          onClick={() => onDelete(node)}
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function TickerNodeCard({ data }) {
  const { node, onAddTicker, onEdit, onDelete } = data

  return (
    <div
      id={`treeViewTickerNode_${node.id}_investmentFlowPage`}
      className="border rounded-xl bg-white shadow-sm p-3 w-[240px]"
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="flex items-center gap-2 min-w-0">
        <TrendingUp className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800 truncate" title={node.name}>
          {node.name}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatRupiah(node.computedNominal)}
        </span>
        <Badge className="bg-violet-100 text-violet-700 border-transparent" size="sm">
          {node.percentage.toFixed(1)}%
        </Badge>
      </div>

      {node.notes && (
        <p className="text-xs text-muted-foreground truncate mt-1" title={node.notes}>
          {node.notes}
        </p>
      )}

      <div className="flex items-center gap-1 mt-3">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Add node under ${node.name}`}
          id={`treeViewAddNodeBtn_${node.id}_investmentFlowPage`}
          onClick={() => onAddTicker(node.id)}
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit ${node.name}`}
          id={`treeViewEditBtn_${node.id}_investmentFlowPage`}
          onClick={() => onEdit(node)}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${node.name}`}
          id={`treeViewDeleteBtn_${node.id}_investmentFlowPage`}
          onClick={() => onDelete(node)}
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function CashNodeCard({ data }) {
  const { amount, percentage, onEdit, onAddCategory, hasCategories } = data

  return (
    <div
      id="treeViewUninvestedCashNode_investmentFlowPage"
      className="border rounded-xl bg-white shadow-sm p-3 w-[240px]"
    >
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Left} id="left" />

      <div className="flex items-center gap-2 min-w-0">
        <Wallet className="size-4 text-emerald-500 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800 truncate">Uninvested Cash</span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500 whitespace-nowrap">{formatRupiah(amount)}</span>
        <Badge className="bg-emerald-100 text-emerald-700 border-transparent" size="sm">
          {percentage.toFixed(1)}%
        </Badge>
      </div>

      <div className="flex items-center gap-1 mt-3">
        {!hasCategories && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit uninvested cash"
            id="treeViewUninvestedCashEditBtn_investmentFlowPage"
            onClick={onEdit}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Add cash pool"
          id="treeViewUninvestedCashAddCategoryBtn_investmentFlowPage"
          onClick={onAddCategory}
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function CashCategoryNodeCard({ data }) {
  const { category, onEdit, onDelete } = data

  return (
    <div
      id={`treeViewCashCategoryNode_${category.id}_investmentFlowPage`}
      className="border border-emerald-200 rounded-xl bg-emerald-50 shadow-sm p-3 w-[240px]"
    >
      <Handle type="target" position={Position.Right} />

      <div className="flex items-center gap-2 min-w-0">
        <Wallet className="size-4 text-emerald-400 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800 truncate" title={category.name}>
          {category.name}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatRupiah(category.nominal)}
        </span>
      </div>

      <div className="flex items-center gap-1 mt-3">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit ${category.name}`}
          id={`treeViewCashCategoryEditBtn_${category.id}_investmentFlowPage`}
          onClick={() => onEdit(category)}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${category.name}`}
          id={`treeViewCashCategoryDeleteBtn_${category.id}_investmentFlowPage`}
          onClick={() => onDelete(category)}
        >
          <Trash2 className="size-3.5 text-rose-400" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

const nodeTypes = {
  rootNode: RootNodeCard,
  categoryNode: CategoryNodeCard,
  tickerNode: TickerNodeCard,
  cashNode: CashNodeCard,
  cashCategoryNode: CashCategoryNodeCard,
}

export default function InvestmentFlowTreeView({
  flatNodes,
  rootTotal,
  createNode,
  updateNode,
  deleteNode,
  uninvestedCash,
  uninvestedCashPct,
  onEditUninvestedCash,
  cashCategories = [],
  createCashCategory,
  updateCashCategory,
  deleteCashCategory,
}) {
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
  const [cashCategoryFormState, setCashCategoryFormState] = useState({
    open: false,
    mode: 'create',
    category: null,
  })
  const [deleteCashCategoryTarget, setDeleteCashCategoryTarget] = useState(null)

  const openAddCategory = (parentId) =>
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

  const openAddCashCategory = () =>
    setCashCategoryFormState({ open: true, mode: 'create', category: null })

  const openEditCashCategory = (category) =>
    setCashCategoryFormState({ open: true, mode: 'edit', category })

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

  const handleCashCategorySubmit = async (values) => {
    if (cashCategoryFormState.mode === 'edit') {
      return updateCashCategory(cashCategoryFormState.category.id, values)
    }
    return createCashCategory(values)
  }

  const deleteTargetWithChildren = useMemo(() => {
    if (!deleteTarget) return null
    const hasChildren = flatNodes.some((n) => n.parent_id === deleteTarget.id)
    return { ...deleteTarget, children: hasChildren ? [{}] : [] }
  }, [deleteTarget, flatNodes])

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const virtualRoot = {
      id: VIRTUAL_ROOT_ID,
      type: 'rootNode',
      position: { x: 0, y: 0 },
      data: { rootTotal },
    }

    const hasCategories = cashCategories.length > 0

    const cashNode = {
      id: UNINVESTED_CASH_ID,
      type: 'cashNode',
      position: { x: 0, y: 0 },
      data: {
        amount: uninvestedCash,
        percentage: uninvestedCashPct,
        onEdit: onEditUninvestedCash,
        onAddCategory: openAddCashCategory,
        hasCategories,
      },
    }

    const cashCategoryRfNodes = cashCategories.map((cat) => ({
      id: cat.id,
      type: 'cashCategoryNode',
      position: { x: 0, y: 0 },
      data: {
        category: cat,
        onEdit: openEditCashCategory,
        onDelete: setDeleteCashCategoryTarget,
      },
    }))

    const rfNodes = [
      virtualRoot,
      cashNode,
      ...cashCategoryRfNodes,
      ...flatNodes.map((node) => ({
        id: node.id,
        type: node.node_type === 'category' ? 'categoryNode' : 'tickerNode',
        position: { x: 0, y: 0 },
        data: {
          node,
          onAddCategory: openAddCategory,
          onAddTicker: openAddTicker,
          onEdit: openEdit,
          onDelete: setDeleteTarget,
        },
      })),
    ]

    const rfEdges = flatNodes
      .filter((node) => node.parent_id)
      .map((node) => ({
        id: `e-${node.parent_id}-${node.id}`,
        source: node.parent_id,
        target: node.id,
        type: 'smoothstep',
      }))

    const rootEdges = flatNodes
      .filter((node) => !node.parent_id)
      .map((node) => ({
        id: `e-${VIRTUAL_ROOT_ID}-${node.id}`,
        source: VIRTUAL_ROOT_ID,
        target: node.id,
        sourceHandle: 'right',
        type: 'smoothstep',
      }))

    // Cash node exits from the LEFT of Portfolio root
    const cashEdge = {
      id: `e-${VIRTUAL_ROOT_ID}-${UNINVESTED_CASH_ID}`,
      source: VIRTUAL_ROOT_ID,
      target: UNINVESTED_CASH_ID,
      sourceHandle: 'left',
      targetHandle: 'right',
      type: 'smoothstep',
    }

    // Edges from cash node to each category (cash node is source, categories are targets)
    const cashCategoryEdges = cashCategories.map((cat) => ({
      id: `e-${UNINVESTED_CASH_ID}-${cat.id}`,
      source: UNINVESTED_CASH_ID,
      target: cat.id,
      sourceHandle: 'left',
      type: 'smoothstep',
    }))

    const cashCategoryIds = cashCategories.map((c) => c.id)

    return getLayoutedElements(
      rfNodes,
      [...rootEdges, ...rfEdges, cashEdge, ...cashCategoryEdges],
      UNINVESTED_CASH_ID,
      VIRTUAL_ROOT_ID,
      cashCategoryIds
    )
  }, [
    flatNodes,
    rootTotal,
    uninvestedCash,
    uninvestedCashPct,
    onEditUninvestedCash,
    cashCategories,
  ])

  return (
    <div
      id="investmentFlowTreeCanvas_investmentFlowPage"
      className="h-[calc(100dvh-18rem)] lg:h-[calc(100dvh-14rem)] min-h-[400px] w-full bg-slate-50"
    >
      <ReactFlow nodes={layoutedNodes} edges={layoutedEdges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>

      <CategoryNodeForm
        idPrefix="treeViewCategoryNodeForm"
        open={categoryFormState.open}
        onOpenChange={(open) => setCategoryFormState((prev) => ({ ...prev, open }))}
        mode={categoryFormState.mode}
        initialValues={categoryFormState.node}
        onSubmit={handleCategorySubmit}
      />

      <TickerNodeForm
        idPrefix="treeViewTickerNodeForm"
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
        node={deleteTargetWithChildren}
        onConfirm={deleteNode}
      />

      <UninvestedCashCategoryForm
        idPrefix="treeViewCashCategoryForm"
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
        onConfirm={(id) => deleteCashCategory(id)}
      />
    </div>
  )
}
