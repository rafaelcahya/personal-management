export default function ProductBrandTableHeader({ brands = [] }) {
    return (
        <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">
                🏷️ Product Brands
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                Your complete brand management hub. Keep track of all your
                favorite brands, monitor their status, and add important notes
                to remember what makes each one special. You're currently
                managing{" "}
                <span className="font-semibold text-violet-600">
                    {brands.length}
                </span>{" "}
                awesome {brands.length === 1 ? "brand" : "brands"}!
            </p>
        </div>
    );
}
