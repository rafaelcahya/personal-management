import { Pencil, StarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/base/Badge/Badge'
import Button from '@/components/base/Button/Button'
import Card, { CardContent } from '@/components/base/Card/Card.jsx'

export default function ProductInfoCard({
  product,
  onEdit,
  totalAdded,
  totalSpent,
  usageSessions,
  daysUntilEmpty,
}) {
  return (
    <Card
      id="productInfoCard_productDetailPage"
      className="bg-white border border-slate-200 shadow-sm"
    >
      <CardContent className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Left — product details */}
          <div className="flex flex-col gap-3 pr-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Product Information
              </p>
              <Button
                id="editProductBtn_productDetailPage"
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="text-xs font-medium h-7 px-2"
              >
                <Pencil className="size-3 mr-1" />
                Edit Product
              </Button>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Brand</p>
                  <p className="text-sm font-medium text-slate-800">{product.brand || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Product Name</p>
                  <p className="text-sm font-medium text-slate-800">{product.product || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Type</p>
                  <p className="text-sm font-medium text-slate-800">{product.type || '—'}</p>
                </div>
              </div>

              <div className="pt-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2.5">
                  Product Status
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Status</p>
                    <Badge
                      variant="outline"
                      className={
                        product.product_status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {product.product_status || '—'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Favorite</p>
                    <div className="flex items-center gap-1.5">
                      <StarIcon
                        className={`size-3.5 ${product.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                      />
                      <span className="text-sm font-medium text-slate-800">
                        {product.is_favorite ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — stock overview */}
          <div className="flex flex-col gap-3 pt-6 sm:pt-0 sm:pl-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Stock Overview
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Current Stock</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-slate-800 tabular-nums">
                    {product.quantity ?? 0}
                  </p>
                  {product.quantity === 0 && (
                    <>
                      <span className="text-slate-300">·</span>
                      <p className="text-xs text-red-500">Out of stock</p>
                    </>
                  )}
                  {product.quantity > 0 && product.quantity < 5 && (
                    <>
                      <span className="text-slate-300">·</span>
                      <p className="text-xs text-yellow-600">Low stock</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-0.5">In Use</p>
                <p className="text-sm font-medium text-slate-800 tabular-nums">
                  {product.usage_quantity ?? 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-0.5">Last Used</p>
                <p className="text-sm font-medium text-slate-800">
                  {product.usage_date ? format(new Date(product.usage_date), 'd MMM yyyy') : '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-0.5">Days Left</p>
                {daysUntilEmpty === null ? (
                  <p className="text-sm font-medium text-slate-400">—</p>
                ) : daysUntilEmpty === 0 ? (
                  <p className="text-sm font-medium text-red-500">Out of stock</p>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-sm font-medium tabular-nums ${daysUntilEmpty <= 7 ? 'text-orange-500' : 'text-slate-800'}`}
                    >
                      {daysUntilEmpty}d
                    </p>
                    {daysUntilEmpty <= 7 && (
                      <>
                        <span className="text-slate-300">·</span>
                        <p className="text-xs text-orange-500">restock soon</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-0.5">Total Added</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-slate-800 tabular-nums">{totalAdded}</p>
                  <span className="text-slate-300">·</span>
                  <p className="text-xs text-slate-400">all time</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-0.5">Total Spent</p>
                <p className="text-sm font-medium text-slate-800 tabular-nums">
                  Rp {totalSpent.toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-0.5">Usage Sessions</p>
                <p className="text-sm font-medium text-slate-800 tabular-nums">{usageSessions}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
