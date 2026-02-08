export default function ProductHistoryTableHeader({ histories = [] }) {
    return (
        <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">
                📊 Product History
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                Track your complete inventory movement timeline. Monitor when
                products were activated, used, and depleted. Review historical
                data to understand usage patterns and make informed restocking
                decisions. Currently tracking{" "}
                <span className="font-semibold text-violet-600">
                    {histories.length}
                </span>{" "}
                {histories.length === 1 ? "record" : "records"}.
            </p>
        </div>
    );
}
