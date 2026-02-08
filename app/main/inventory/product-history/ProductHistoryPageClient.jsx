"use client";

import { useState } from "react";
import ProductHistoryTable from "./ProductHistoryTable";
import ProductHistoryTableHeader from "./component/ProductHistoryTableHeader";
import ProductHistoryFilterDropdown from "./component/ProductHistoryFilterDropdown";

export default function ProductHistoryPageClient({ initialHistory }) {
    const [history, setHistory] = useState(initialHistory);
    const [filterStatus, setFilterStatus] = useState(null);

    const handleFilter = (status) => {
        setFilterStatus(status);
    };

    return (
        <div className="flex flex-col h-full gap-5">
            <div className="flex-1 min-h-0 relative border rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                        <div className="max-w-2xl">
                            <ProductHistoryTableHeader histories={history} />
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                            <ProductHistoryFilterDropdown
                                filter={filterStatus}
                                onFilterChange={handleFilter}
                                productHistories={history}
                            />
                        </div>
                    </div>

                    {history.length === 0 ? (
                        <p className="text-center font-medium text-slate-foreground py-10">
                            No history records yet. Start using products to see
                            history 🚀
                        </p>
                    ) : (
                        <ProductHistoryTable
                            productHistories={history}
                            filterStatus={filterStatus}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
