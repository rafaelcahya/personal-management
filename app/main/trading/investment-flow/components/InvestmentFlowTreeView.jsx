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

const NODE_WIDTH = 240
const ROOT_NODE_HEIGHT = 80
const CATEGORY_NODE_HEIGHT = 110
const TICKER_NODE_HEIGHT = 130
const CASH_NODE_HEIGHT = 90
const VIRTUAL_ROOT_ID = '__portfolio_root__'
const UNINVESTED_CASH_ID = '__uninvested_cash__'

function nodeHeightFor(n) {
  if (n.type === 'tickerNode') return TICKER_NODE_HEIGHT
  if (n.type === 'rootNode') return ROOT_NODE_HEIGHT
  if (n.type === 'cashNode') return CASH_NODE_HEIGHT
  return CATEGORY_NODE_HEIGHT
}

// Category tree uses LR layout via dagre.
// Cash node is positioned manually below the portfolio root so it appears
// as a separate downward branch while categories extend to the right.
function getLayoutedElements(nodes, edges, cashNodeId, rootNodeId) {
  const mainNodes = nodes.filter((n) => n.id !== cashNodeId)
  const mainEdges = edges.filter((e) => e.target !== cashNodeId)

  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR', nodesep: 40, ranksep: 80 })
  mainNodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: nodeHeightFor(n) }))
  mainEdges.forEach((e) => g.setEdge(e.source, e.target))
  dagre.layout(g)

  const layoutedMain = mainNodes.map((n) => {
    const { x, y } = g.node(n.id)
    return { ...n, position: { x: x - NODE_WIDTH / 2, y: y - nodeHeightFor(n) / 2 } }
  })

  const rootPos = layoutedMain.find((n) => n.id === rootNodeId)?.position ?? { x: 0, y: 0 }
  const cashNode = nodes.find((n) => n.id === cashNodeId)
  const cashPositioned = {
    ...cashNode,
    position: { x: rootPos.x, y: rootPos.y + ROOT_NODE_HEIGHT + 80 },
  }

  return { nodes: [...layoutedMain, cashPositioned], edges }
}

function RootNodeCard({ data }) {
  const { rootTotal } = data
  return (
    <div
      id="treeViewRootNode_investmentFlowPage"
      className="border-2 border-violet-300 rounded-xl bg-violet-50 shadow-sm p-3 w-[240px]"
    >
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
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
  const { amount, percentage, onEdit } = data

  return (
    <div
      id="treeViewUninvestedCashNode_investmentFlowPage"
      className="border rounded-xl bg-white shadow-sm p-3 w-[240px]"
    >
      <Handle type="target" position={Position.Top} />

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
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Edit uninvested cash"
          id="treeViewUninvestedCashEditBtn_investmentFlowPage"
          onClick={onEdit}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
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

    const cashNode = {
      id: UNINVESTED_CASH_ID,
      type: 'cashNode',
      position: { x: 0, y: 0 },
      data: { amount: uninvestedCash, percentage: uninvestedCashPct, onEdit: onEditUninvestedCash },
    }

    const rfNodes = [
      virtualRoot,
      cashNode,
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

    // Edges from virtual root to all top-level category nodes (right branch)
    const rootEdges = flatNodes
      .filter((node) => !node.parent_id)
      .map((node) => ({
        id: `e-${VIRTUAL_ROOT_ID}-${node.id}`,
        source: VIRTUAL_ROOT_ID,
        target: node.id,
        sourceHandle: 'right',
        type: 'smoothstep',
      }))

    // Cash edge exits from bottom of Portfolio (downward branch)
    const cashEdge = {
      id: `e-${VIRTUAL_ROOT_ID}-${UNINVESTED_CASH_ID}`,
      source: VIRTUAL_ROOT_ID,
      target: UNINVESTED_CASH_ID,
      sourceHandle: 'bottom',
      type: 'smoothstep',
    }

    return getLayoutedElements(
      rfNodes,
      [...rootEdges, ...rfEdges, cashEdge],
      UNINVESTED_CASH_ID,
      VIRTUAL_ROOT_ID
    )
  }, [flatNodes, rootTotal, uninvestedCash, uninvestedCashPct, onEditUninvestedCash])

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
      />

      <DeleteNodeDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        node={deleteTargetWithChildren}
        onConfirm={deleteNode}
      />
    </div>
  )
}
