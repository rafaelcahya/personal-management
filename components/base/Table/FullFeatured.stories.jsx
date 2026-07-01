'use client'
import { useState } from 'react'
import { MoreHorizontal, PackageOpen } from 'lucide-react'
import { DataTable } from './DataTable'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Table/Full Featured' }
export default meta

const data = [
  {
    id: 1,
    ticker: 'BBCA',
    name: 'Bank Central Asia',
    sector: 'Financials',
    price: 9250,
    qty: 100,
    avgPrice: 8900,
  },
  {
    id: 2,
    ticker: 'TLKM',
    name: 'Telkom Indonesia',
    sector: 'Telecom',
    price: 3120,
    qty: 200,
    avgPrice: 3300,
  },
  {
    id: 3,
    ticker: 'ASII',
    name: 'Astra International',
    sector: 'Consumer Disc.',
    price: 5400,
    qty: 150,
    avgPrice: 5100,
  },
  {
    id: 4,
    ticker: 'BMRI',
    name: 'Bank Mandiri',
    sector: 'Financials',
    price: 6750,
    qty: 75,
    avgPrice: 6200,
  },
  {
    id: 5,
    ticker: 'UNVR',
    name: 'Unilever Indonesia',
    sector: 'Consumer Staples',
    price: 2800,
    qty: 300,
    avgPrice: 2950,
  },
  {
    id: 6,
    ticker: 'ICBP',
    name: 'Indofood CBP',
    sector: 'Consumer Staples',
    price: 9100,
    qty: 50,
    avgPrice: 8800,
  },
  {
    id: 7,
    ticker: 'GGRM',
    name: 'Gudang Garam',
    sector: 'Consumer Staples',
    price: 18500,
    qty: 20,
    avgPrice: 20000,
  },
  {
    id: 8,
    ticker: 'INDF',
    name: 'Indofood Sukses',
    sector: 'Consumer Staples',
    price: 6800,
    qty: 120,
    avgPrice: 6500,
  },
]

function FullFeaturedDemo() {
  const [selected, setSelected] = useState([])

  const columns = [
    {
      id: 'ticker',
      header: 'Ticker',
      cell: (row) => <span className="font-mono font-semibold text-gray-900">{row.ticker}</span>,
      sortable: true,
      width: 90,
    },
    {
      id: 'name',
      header: 'Name',
      cell: (row) => row.name,
      sortable: true,
    },
    {
      id: 'sector',
      header: 'Sector',
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
          {row.sector}
        </span>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      cell: (row) => `Rp ${row.price.toLocaleString()}`,
      sortable: true,
      align: 'right',
    },
    {
      id: 'qty',
      header: 'Qty',
      cell: (row) => row.qty,
      sortable: true,
      align: 'right',
    },
    {
      id: 'pl',
      header: 'P&L',
      cell: (row) => {
        const pl = (row.price - row.avgPrice) * row.qty
        return (
          <span className={pl >= 0 ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
            {pl >= 0 ? '+' : ''}Rp {pl.toLocaleString()}
          </span>
        )
      },
      sortable: true,
      align: 'right',
    },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="size-4" />
        </button>
      ),
      width: 44,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        data={data}
        rowId="id"
        columns={columns}
        searchable
        searchKeys={['ticker', 'name', 'sector']}
        sortable
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
        expandable
        expandContent={(row) => (
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
            <div>
              <span className="text-gray-400">Avg price</span>
              <p className="font-medium text-gray-800">Rp {row.avgPrice.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-400">Current price</span>
              <p className="font-medium text-gray-800">Rp {row.price.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-400">Total value</span>
              <p className="font-medium text-gray-800">
                Rp {(row.price * row.qty).toLocaleString()}
              </p>
            </div>
          </div>
        )}
        pagination
        pageSize={5}
        stickyHeader
        emptyState={
          <div className="py-12 flex flex-col items-center gap-2">
            <PackageOpen className="size-8 text-gray-300" />
            <p className="text-sm text-gray-500">No positions found</p>
          </div>
        }
      />
      {selected.length > 0 && (
        <p className="text-xs text-gray-500">
          {selected.length} row{selected.length > 1 ? 's' : ''} selected · IDs:{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">{selected.join(', ')}</code>
        </p>
      )}
    </div>
  )
}

export const FullFeatured = {
  name: 'Full Featured',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        All features enabled simultaneously: search, sort, select, expand, pagination, sticky
        header, and a custom empty state. This is the closest to a real app usage.
      </p>

      <FullFeaturedDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<DataTable
  data={positions}
  rowId="id"
  columns={columns}
  searchable
  searchKeys={['ticker', 'name', 'sector']}
  sortable
  selectable
  selectedRows={selected}
  onSelectionChange={setSelected}
  expandable
  expandContent={(row) => <PositionDetail position={row} />}
  pagination
  pageSize={5}
  stickyHeader
  emptyState={<EmptyPortfolio />}
/>`}</code>
      </pre>
    </div>
  ),
}
