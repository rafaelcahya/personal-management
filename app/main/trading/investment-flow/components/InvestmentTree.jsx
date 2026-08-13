'use client'

import { useState } from 'react'
import TreeNode from './TreeNode'

export default function InvestmentTree({
  tree,
  categoryOptions,
  onAddCategory,
  onAddTicker,
  onEdit,
  onDelete,
  onMove,
  hideAmounts = false,
  highlights = {},
  onHighlight,
}) {
  const [draggedId, setDraggedId] = useState(null)

  const handleDropOnCategory = (draggedNodeId, targetCategoryId) => {
    onMove(draggedNodeId, targetCategoryId)
    setDraggedId(null)
  }

  return (
    <div
      id="investmentTree_investmentFlowPage"
      role="tree"
      aria-label="Investment allocation tree"
      className="flex flex-col"
    >
      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          categoryOptions={categoryOptions}
          onAddCategory={onAddCategory}
          onAddTicker={onAddTicker}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          draggedId={draggedId}
          onDragStart={setDraggedId}
          onDragEnd={() => setDraggedId(null)}
          onDropOnCategory={handleDropOnCategory}
          hideAmounts={hideAmounts}
          highlights={highlights}
          onHighlight={onHighlight}
        />
      ))}
    </div>
  )
}
