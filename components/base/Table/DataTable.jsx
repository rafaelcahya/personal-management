'use client'
import { useState, useMemo, Fragment } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table'
import { Skeleton } from '../Skeleton/Skeleton'

function SortIcon({ column, sortColumn, sortDirection }) {
  if (sortColumn !== column)
    return <ChevronsUpDown className="size-3.5 text-gray-300 ml-1 inline" />
  if (sortDirection === 'asc') return <ChevronUp className="size-3.5 text-violet-600 ml-1 inline" />
  if (sortDirection === 'desc')
    return <ChevronDown className="size-3.5 text-violet-600 ml-1 inline" />
  return <ChevronsUpDown className="size-3.5 text-gray-300 ml-1 inline" />
}

function SkeletonCell({ width }) {
  return (
    <TableCell>
      <Skeleton className="h-4 rounded" style={{ width: width || '80%' }} />
    </TableCell>
  )
}

function PrevButton({ disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center size-7 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label="Previous page"
    >
      <ChevronLeft className="size-4" />
    </button>
  )
}

function NextButton({ disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center size-7 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label="Next page"
    >
      <ChevronRight className="size-4" />
    </button>
  )
}

function PageInfo({ safePage, totalPages }) {
  return (
    <span className="text-xs text-gray-600 min-w-[80px] text-center">
      Page {safePage} of {totalPages}
    </span>
  )
}

function PaginationControls({ safePage, totalPages, variant, onPrev, onNext }) {
  const prevDisabled = safePage === 1
  const nextDisabled = safePage === totalPages

  if (variant === 'full') {
    return (
      <div className="grid grid-cols-3 items-center px-1">
        <div>
          <PrevButton disabled={prevDisabled} onClick={onPrev} />
        </div>
        <div className="flex justify-center">
          <PageInfo safePage={safePage} totalPages={totalPages} />
        </div>
        <div className="flex justify-end">
          <NextButton disabled={nextDisabled} onClick={onNext} />
        </div>
      </div>
    )
  }

  const wrapperClass = cn(
    'flex items-center gap-2 px-1',
    variant === 'center' && 'justify-center',
    variant === 'right' && 'justify-end',
    variant === 'left' && 'justify-start'
  )

  return (
    <div className={wrapperClass}>
      <PrevButton disabled={prevDisabled} onClick={onPrev} />
      <PageInfo safePage={safePage} totalPages={totalPages} />
      <NextButton disabled={nextDisabled} onClick={onNext} />
    </div>
  )
}

export function DataTable({
  data = [],
  rowId = 'id',
  columns = [],
  searchable,
  searchKeys = [],
  sortable,
  selectable,
  expandable,
  expandContent,
  pagination,
  pageSize = 10,
  paginationVariant = 'full',
  stickyHeader,
  loading,
  emptyState,
  sort: sortProp,
  onSortChange,
  selectedRows: selectedRowsProp,
  onSelectionChange,
  className,
}) {
  const isControlledSort = sortProp !== undefined
  const isControlledSelection = selectedRowsProp !== undefined

  const [internalSortColumn, setInternalSortColumn] = useState(null)
  const [internalSortDirection, setInternalSortDirection] = useState(null)
  const [internalSelectedRows, setInternalSelectedRows] = useState(new Set())
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const sortColumn = isControlledSort ? sortProp?.column : internalSortColumn
  const sortDirection = isControlledSort ? sortProp?.direction : internalSortDirection
  const selectedRows = isControlledSelection ? new Set(selectedRowsProp) : internalSelectedRows

  function handleSort(colId) {
    let nextDirection
    if (sortColumn !== colId) {
      nextDirection = 'asc'
    } else if (sortDirection === 'asc') {
      nextDirection = 'desc'
    } else if (sortDirection === 'desc') {
      nextDirection = null
    } else {
      nextDirection = 'asc'
    }

    const nextSort = nextDirection ? { column: colId, direction: nextDirection } : null
    if (isControlledSort) {
      onSortChange?.(nextSort)
    } else {
      setInternalSortColumn(nextDirection ? colId : null)
      setInternalSortDirection(nextDirection)
    }
    setCurrentPage(1)
  }

  function handleSelectRow(id) {
    const next = new Set(selectedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    if (isControlledSelection) {
      onSelectionChange?.([...next])
    } else {
      setInternalSelectedRows(next)
    }
  }

  function handleSelectAll(visibleIds) {
    const allSelected = visibleIds.every((id) => selectedRows.has(id))
    const next = new Set(selectedRows)
    if (allSelected) {
      visibleIds.forEach((id) => next.delete(id))
    } else {
      visibleIds.forEach((id) => next.add(id))
    }
    if (isControlledSelection) {
      onSelectionChange?.([...next])
    } else {
      setInternalSelectedRows(next)
    }
  }

  function handleExpandRow(id) {
    const next = new Set(expandedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedRows(next)
  }

  const filtered = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return data
    const q = searchQuery.trim().toLowerCase()
    return data.filter((row) =>
      searchKeys.some((key) =>
        String(row[key] ?? '')
          .toLowerCase()
          .includes(q)
      )
    )
  }, [data, searchable, searchQuery, searchKeys])

  const sorted = useMemo(() => {
    if (!sortable || !sortColumn || !sortDirection) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sortColumn]
      const bv = b[sortColumn]
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDirection === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortable, sortColumn, sortDirection])

  const totalPages = pagination ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    if (!pagination) return sorted
    const start = (safePage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, pagination, safePage, pageSize])

  const visibleIds = paginated.map((row) => row[rowId])
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedRows.has(id))
  const someVisibleSelected = visibleIds.some((id) => selectedRows.has(id)) && !allVisibleSelected

  const skeletonRows = Array.from({ length: pageSize })

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {searchable && (
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-9 pr-3 h-9 rounded-md border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600"
          />
        </div>
      )}

      <div
        className={cn(
          'rounded-lg border border-gray-200 overflow-hidden',
          stickyHeader && 'max-h-96 overflow-y-auto'
        )}
      >
        <Table>
          <TableHeader sticky={stickyHeader}>
            <TableRow>
              {selectable && (
                <TableHead width={40}>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someVisibleSelected
                    }}
                    onChange={() => handleSelectAll(visibleIds)}
                    className="size-4 rounded border-gray-300 accent-violet-600 cursor-pointer"
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {expandable && <TableHead width={40} />}
              {columns.map((col) => (
                <TableHead
                  key={col.id}
                  align={col.align}
                  width={col.width}
                  className={cn(
                    sortable && col.sortable && 'cursor-pointer select-none hover:text-gray-700'
                  )}
                  onClick={sortable && col.sortable ? () => handleSort(col.id) : undefined}
                >
                  {col.header}
                  {sortable && col.sortable && (
                    <SortIcon
                      column={col.id}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                    />
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              skeletonRows.map((_, i) => (
                <TableRow key={i}>
                  {selectable && (
                    <TableCell>
                      <Skeleton className="size-4 rounded" />
                    </TableCell>
                  )}
                  {expandable && <TableCell />}
                  {columns.map((col) => (
                    <SkeletonCell key={col.id} />
                  ))}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}>
                  {emptyState ?? (
                    <div className="py-12 text-center text-sm text-gray-400">No data</div>
                  )}
                </td>
              </tr>
            ) : (
              paginated.map((row) => {
                const id = row[rowId]
                const isSelected = selectedRows.has(id)
                const isExpanded = expandedRows.has(id)
                return (
                  <Fragment key={id}>
                    <TableRow
                      selected={isSelected}
                      clickable={expandable}
                      onClick={expandable ? () => handleExpandRow(id) : undefined}
                    >
                      {selectable && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(id)}
                            className="size-4 rounded border-gray-300 accent-violet-600 cursor-pointer"
                            aria-label="Select row"
                          />
                        </TableCell>
                      )}
                      {expandable && (
                        <TableCell>
                          <ChevronRight
                            className={cn(
                              'size-4 text-gray-400 transition-transform',
                              isExpanded && 'rotate-90'
                            )}
                          />
                        </TableCell>
                      )}
                      {columns.map((col) => (
                        <TableCell key={col.id} align={col.align}>
                          {col.cell(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandable && isExpanded && (
                      <tr className="bg-gray-50">
                        <td
                          colSpan={columns.length + (selectable ? 1 : 0) + 1}
                          className="px-4 py-3"
                        >
                          {expandContent?.(row)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && !loading && sorted.length > 0 && (
        <PaginationControls
          safePage={safePage}
          totalPages={totalPages}
          variant={paginationVariant}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
    </div>
  )
}
