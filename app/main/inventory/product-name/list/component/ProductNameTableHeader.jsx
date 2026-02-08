export default function ProductNameTableHeader({ names = [] }) {
    return (
        <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">
                📝 Product Names
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                Organize and manage your product catalog. Track product name
                statuses, maintain detailed notes, and keep your inventory
                nomenclature consistent. Currently managing{" "}
                <span className="font-semibold text-violet-600">
                    {names.length}
                </span>{" "}
                product {names.length === 1 ? "name" : "names"}.
            </p>
        </div>
    );
}
