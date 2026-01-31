"use client";

export default function ProductTableHeader({ listProduct }) {
    return (
        <>
            {/* Info Bar */}
            <div className="space-y-2 mb-4">
                <div>
                    <p className="text-lg font-semibold">Product List</p>
                    <p className="text-sm text-slate-600 mt-1">
                        Manage your inventory products and stock levels. Star
                        your favorites for quick access, track usage, and
                        monitor stock quantities.
                    </p>
                </div>

                {/* Dynamic Status Bar */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                        📦 <p className="font-medium">{listProduct.length}</p>{" "}
                        total products
                    </span>
                    <p>•</p>
                    <span className="flex items-center gap-1">
                        ⭐{" "}
                        <p className="font-medium">
                            {listProduct.filter((p) => p.is_favorite).length}
                        </p>{" "}
                        favorites
                    </span>
                </div>
            </div>
        </>
    );
}
