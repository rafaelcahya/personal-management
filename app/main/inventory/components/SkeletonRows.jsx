export default function SkeletonRows({ count = 5 }) {
    return (
        <div className="space-y-1">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse flex items-center gap-3 py-3 px-3 border-b border-slate-100"
                >
                    <div className="h-3 bg-slate-200 rounded w-4"></div>
                    <div className="h-3 bg-slate-200 rounded flex-1"></div>
                    <div className="h-3 bg-slate-200 rounded w-20 hidden sm:block"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                    <div className="h-5 bg-slate-200 rounded-full w-14 hidden sm:block"></div>
                </div>
            ))}
        </div>
    );
}
