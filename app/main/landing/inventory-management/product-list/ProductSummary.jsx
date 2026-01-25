import { cn } from "@/lib/utils";

export default function ProductSummary({ product }) {
    if (!product) return null;

    return (
        <div className="space-y-2 p-3 bg-violet-50/75 rounded-lg border border-violet-100 text-sm w-full sm:w-1/3">
            <div className="space-y-1">
                <p className="text-slate-500">Product</p>
                <p className="font-medium text-slate-800">
                    {product.brand} {product.type} {product.product}
                </p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500">Total Quantity</p>
                <p className="font-mono font-semibold text-slate-900">
                    {product.quantity}
                </p>
            </div>
            <div className="space-y-1">
                <p className="text-slate-500">Current Usage</p>
                <p className="font-mono font-semibold text-slate-900">
                    {product.usage_quantity}
                </p>
            </div>
            <div className="space-y-1 items-center">
                <p className="text-slate-500">Status</p>
                <span
                    className={cn(
                        "px-2 py-0.5 rounded-md text-xs font-semibold capitalize",
                        product.product_status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700",
                    )}
                >
                    {product.product_status}
                </span>
            </div>
        </div>
    );
}
