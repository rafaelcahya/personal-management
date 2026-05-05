import { format } from "date-fns";
import SkeletonRows from "../components/SkeletonRows";

export default function NeglectedProducts({ items, loading }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-800">
                    😴 Neglected Products
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Active products not used in 30+ days
                </p>
            </div>
            <div className="px-2 py-2">
                {loading ? (
                    <SkeletonRows count={3} />
                ) : items.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-sm text-slate-400">
                            No neglected products — you&apos;re on top of it! 👏
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-8">No</th>
                                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                                    <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Last Used</th>
                                    <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Days Since Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => {
                                    const days = item.days_since_used;
                                    let daysBadgeClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
                                    if (days > 90) daysBadgeClass = "bg-red-100 text-red-700 border-red-200";
                                    else if (days > 60) daysBadgeClass = "bg-orange-100 text-orange-700 border-orange-200";

                                    return (
                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-100 hover:bg-violet-50/30 transition-colors"
                                        >
                                            <td className="py-3 px-3 text-slate-400 text-xs">{index + 1}</td>
                                            <td className="py-3 px-3">
                                                <p className="text-xs text-slate-400">{item.brand || "—"}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <p className="font-medium text-slate-700 truncate max-w-[120px] sm:max-w-none">{item.product}</p>
                                                    {item.type && (
                                                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{item.type}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-right hidden md:table-cell">
                                                {item.last_used ? (
                                                    <span className="text-sm text-slate-600">
                                                        {format(new Date(item.last_used), "dd MMM yyyy")}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 italic text-xs">Never used</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                {days == null ? (
                                                    <span className="text-red-500 font-medium text-xs">—</span>
                                                ) : (
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${daysBadgeClass}`}>
                                                        {days}d ago
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
