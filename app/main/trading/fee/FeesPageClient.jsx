'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchFeeSummary, fetchFeeList } from '@/lib/api/fee'
import { toast } from 'sonner'
import FeeListSummary from './list/component/FeeListSummary'
import FeeMetricStrip from './list/component/FeeMetricStrip'
import FeePagination from './list/component/FeePagination'
import FeeTableSkeleton from './list/component/FeeTableSkeleton'
import FeeErrorState from './list/component/FeeErrorState'
import PageHeader from '../../components/PageHeader'
import FeeTableHeader from './list/component/FeeTableHeader'
import FeesTable from './list/FeesTable'
import AddFee from './AddFee'

export default function FeesPageClient() {
  const [listFee, setListFee] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [summary, setSummary] = useState({ feeCount: 0, totalFee: 0 })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const isMounted = useRef(true)
  const tableRef = useRef(null)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const fetchSummary = useCallback(async () => {
    try {
      const data = await fetchFeeSummary()
      if (!isMounted.current) return
      setSummary(data)
    } catch (err) {
      console.error('Summary fetch error:', err)
    }
  }, [])

  const fetchFees = useCallback(async (targetPage = 1) => {
    try {
      setIsLoading(true)
      setIsError(false)
      const result = await fetchFeeList({ page: targetPage, limit: 15 })
      if (!isMounted.current) return
      setListFee(result.fees || [])
      setTotal(result.total ?? 0)
      setTotalPages(result.totalPages ?? 1)
      setPage(result.page ?? targetPage)
    } catch (err) {
      if (!isMounted.current) return
      console.error('Fetch error:', err)
      setIsError(true)
      toast.error(err.message || 'Failed to fetch fees')
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFees(1)
    fetchSummary()
  }, [])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchFees(newPage)
    tableRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchFees(page), fetchSummary()])
  }, [fetchFees, fetchSummary, page])

  const handleAdded = useCallback(async () => {
    await Promise.all([fetchFees(1), fetchSummary()])
  }, [fetchFees, fetchSummary])

  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader
        title="Fees"
        description="Track and manage your trading fees"
        breadcrumbs={[{ label: 'Trading', href: '/main/trading/dashboard' }, { label: 'Fees' }]}
      />

      {/* Summary Cards */}
      <FeeListSummary feeCount={summary.feeCount} totalFee={summary.totalFee} />

      {/* Main Table Container */}
      <div className="flex-1 min-h-0 relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <FeeTableHeader action={<AddFee onAdded={handleAdded} />} />

        <div className="px-5 pt-3">
          <FeeMetricStrip feeCount={summary.feeCount} totalFee={summary.totalFee} />
        </div>

        {isLoading ? (
          <div className="px-5 pb-5">
            <FeeTableSkeleton />
          </div>
        ) : isError ? (
          <FeeErrorState onRetry={() => fetchFees(page)} />
        ) : listFee.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-center font-medium text-slate-600 text-lg">No fees yet</p>
            <p className="text-center text-slate-500 text-sm">
              Start by adding your first fee to track expenses! 💰
            </p>
          </div>
        ) : (
          <div ref={tableRef} className="overflow-auto flex-1">
            <FeesTable fees={listFee} onFeesChange={setListFee} onRefresh={handleRefresh} />
          </div>
        )}

        <FeePagination
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
