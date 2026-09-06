'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FolderTree,
  GripVertical,
  MoreHorizontal,
  Move,
  Palette,
  Pencil,
  Plus,
  Tag as TagIcon,
  Trash2,
  X,
} from 'lucide-react'
import Button from '@/components/base/Button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/base/DropdownMenu/DropdownMenu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/Popover/Popover'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import { cn } from '@/lib/utils'

const HIGHLIGHT_COLORS = [
  { value: '#EF4444', label: 'Red' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#22C55E', label: 'Green' },
  { value: '#EAB308', label: 'Yellow' },
  { value: '#94A3B8', label: 'Grey' },
]

function HighlightPicker({ nodeId, highlightColor, onHighlight }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0 min-w-6 min-h-6"
          aria-label="Highlight color"
          onClick={(e) => e.stopPropagation()}
        >
          {highlightColor ? (
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: highlightColor }}
            />
          ) : (
            <Palette className="size-3.5 text-slate-400" aria-hidden="true" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" sideOffset={4} className="p-2 w-auto">
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2">
          Highlight
        </p>
        <div className="flex items-center gap-1.5">
          {HIGHLIGHT_COLORS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              onClick={() => {
                onHighlight(nodeId, highlightColor === value ? null : value)
                setOpen(false)
              }}
              className="w-5 h-5 rounded-full transition-transform hover:scale-110 shrink-0"
              style={{
                backgroundColor: value,
                outline: highlightColor === value ? `2px solid ${value}` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
          {highlightColor && (
            <button
              type="button"
              aria-label="Clear highlight"
              onClick={() => {
                onHighlight(nodeId, null)
                setOpen(false)
              }}
              className="w-5 h-5 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-50 shrink-0"
            >
              <X className="size-2.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function TreeNode({
  node,
  depth = 0,
  categoryOptions,
  onAddCategory,
  onAddTicker,
  onEdit,
  onDelete,
  onClosePosition,
  onMove,
  draggedId,
  onDragStart,
  onDragEnd,
  onDropOnCategory,
  hideAmounts = false,
  highlights = {},
  onHighlight,
}) {
  const [expanded, setExpanded] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)

  const isCategory = node.node_type === 'category'
  const hasChildren = node.children.length > 0
  // Only a leaf ticker that holds its own nominal represents a real position
  // that can be sold — categories, parents, and autosum tickers cannot.
  const canClose = !isCategory && !hasChildren && node.nominal != null
  const isBeingDragged = draggedId === node.id
  const highlightColor = highlights[node.id] ?? null

  // categories cannot be dropped onto themselves or their own descendants
  const otherCategoryOptions = categoryOptions.filter((opt) => opt.id !== node.id)

  const handleDragOver = (e) => {
    if (!draggedId || draggedId === node.id) return
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (!draggedId || draggedId === node.id) return
    onDropOnCategory(draggedId, node.id)
  }

  return (
    <div id={`treeNode_${node.id}_investmentFlowPage`} className="flex flex-col">
      <div
        className={cn(
          'group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors',
          isBeingDragged && 'opacity-40',
          isDragOver && 'bg-violet-50 ring-1 ring-violet-300'
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag handle — all nodes can be dragged; backend enforces cycle prevention */}
        <span
          aria-hidden="true"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = 'move'
            onDragStart(node.id)
          }}
          onDragEnd={onDragEnd}
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0 min-w-11 min-h-11 -m-2.5 flex items-center justify-center md:min-w-0 md:min-h-0 md:m-0 md:w-4 md:h-4"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </span>

        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 min-w-6 min-h-6"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
            id={`treeNodeToggle_${node.id}_investmentFlowPage`}
          >
            {expanded ? (
              <ChevronDown className="size-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="size-4" aria-hidden="true" />
            )}
          </Button>
        ) : (
          <span className="w-6 shrink-0" aria-hidden="true" />
        )}

        {/* Icon */}
        {isCategory ? (
          <FolderTree className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
        ) : (
          <TagIcon className="size-4 text-slate-400 shrink-0" aria-hidden="true" />
        )}

        {/* Name */}
        <span
          className={cn(
            'text-sm truncate min-w-0 flex-1',
            !highlightColor && (isCategory ? 'text-slate-800' : 'text-slate-700'),
            isCategory ? 'font-semibold' : 'font-medium'
          )}
          style={highlightColor ? { color: highlightColor } : undefined}
          title={node.name}
        >
          {node.name}
        </span>

        {/* Nominal + Percentage */}
        <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 hidden sm:inline">
          {hideAmounts ? '••••••' : formatRupiah(node.computedNominal)}
        </span>
        <span className="text-xs font-semibold text-violet-600 whitespace-nowrap shrink-0 w-14 text-right">
          {node.percentage.toFixed(1)}%
        </span>

        {/* Highlight color picker */}
        {onHighlight && (
          <HighlightPicker
            nodeId={node.id}
            highlightColor={highlightColor}
            onHighlight={onHighlight}
          />
        )}

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild id={`treeNodeActions_${node.id}_investmentFlowPage`}>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 min-w-11 min-h-11 md:min-w-8 md:min-h-8"
              aria-label={`Actions for ${node.name}`}
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {isCategory && (
              <DropdownMenuItem
                icon={Plus}
                label="Add Category"
                onSelect={() => onAddCategory(node.id)}
              />
            )}
            <DropdownMenuItem icon={Plus} label="Add Node" onSelect={() => onAddTicker(node.id)} />
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={Pencil} label="Edit" onSelect={() => onEdit(node)} />
            {canClose && onClosePosition && (
              <DropdownMenuItem
                icon={CircleDollarSign}
                label="Close Position"
                onSelect={() => onClosePosition(node)}
              />
            )}
            {otherCategoryOptions.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger icon={Move} label="Move to..." />
                <DropdownMenuSubContent>
                  {otherCategoryOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt.id}
                      label={opt.name}
                      onSelect={() => onMove(node.id, opt.id)}
                    />
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={Trash2} label="Delete" onSelect={() => onDelete(node)} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              categoryOptions={categoryOptions}
              onAddCategory={onAddCategory}
              onAddTicker={onAddTicker}
              onEdit={onEdit}
              onDelete={onDelete}
              onClosePosition={onClosePosition}
              onMove={onMove}
              draggedId={draggedId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDropOnCategory={onDropOnCategory}
              hideAmounts={hideAmounts}
              highlights={highlights}
              onHighlight={onHighlight}
            />
          ))}
        </div>
      )}
    </div>
  )
}
