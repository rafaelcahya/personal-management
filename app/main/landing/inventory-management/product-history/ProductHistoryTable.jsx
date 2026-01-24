import React, { useEffect, useState } from "react";
import { getProductHistory } from "@/lib/api/productHistory";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/common/Breadcrumbs";
import { Button } from "@/components/ui/button";

function ProductHistoryTable({ initialProductHistories }) {
    const [listProductHistory, setListProductHistory] = useState(
        initialProductHistories || [],
    );
    const [loading, setLoading] = useState(false);

    const fetchProductHistories = async () => {
        setLoading(true);
        try {
            const histories = await getProductHistory();
            setListProductHistory(histories);
        } catch (err) {
            console.error("Failed to fetch product histories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialProductHistories) {
            setListProductHistory(initialProductHistories);
        } else {
            fetchProductHistories();
        }
    }, [initialProductHistories]);
    return (
        <div className="flex flex-col h-full gap-y-3" id="productHistoryTable">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20 flex-shrink-0 pb-4">
                <div className="space-y-2">
                    <Breadcrumbs />
                    <div>
                        <p className="text-lg font-semibold">Product History</p>
                        <p className="text-sm text-slate-foreground w-full sm:w-3/4">
                            View complete stock movement records — track when
                            products were activated, depleted, and how each
                            adjustment impacts your inventory over time.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Link
                        href="/main/landing/inventory-management/dashboard"
                        className="hidden sm:block"
                    >
                        <Button className="bg-transparent hover:bg-secondary text-secondary-foreground font-medium">
                            Back
                        </Button>
                    </Link>
                </div>
            </header>
            <div className="flex-1 min-h-0 relative border shadow shadow-gray-200 rounded-2xl overflow-hidden flex flex-col">
                {loading ? (
                    <p className="text-center py-8 text-muted-foreground">
                        Loading...
                    </p>
                ) : !listProductHistory || listProductHistory.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                        No history available
                    </p>
                ) : (
                    <div className="flex flex-col h-full overflow-hidden">
                        <Table className="w-full table-auto">
                            <TableHeader className="bg-slate-100 sticky top-0 z-20">
                                <TableRow className="border-none">
                                    <TableHead className="py-2 text-slate-foreground text-center w-[50px] min-w-[50px] max-w-[50px]">
                                        #
                                    </TableHead>
                                    <TableHead className="text-slate-foreground">
                                        Product
                                    </TableHead>
                                    <TableHead className="text-slate-foreground">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-slate-foreground">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-slate-foreground">
                                        Start Usage Date
                                    </TableHead>
                                    <TableHead className="text-slate-foreground">
                                        End Usage Date
                                    </TableHead>
                                    <TableHead className="text-slate-foreground min-w-[250px] w-[250px] max-w-[250px]">
                                        Note
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listProductHistory.map((history, index) => (
                                    <TableRow
                                        key={history.id}
                                        className="border-dashed border-b last:border-b-0 hover:bg-slate-100 border-slate-200 transition-colors"
                                    >
                                        <TableCell className="text-slate-foreground text-center text-sm font-mono w-[50px] min-w-[50px] max-w-[50px]">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium whitespace-normal">
                                            {history.brand} {history.type}{" "}
                                            {history.product}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                                                    history.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-orange-100 text-orange-700"
                                                }`}
                                            >
                                                {history.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {history.quantity}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {new Date(
                                                history.start_usage_date,
                                            ).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {history.end_usage_date
                                                ? new Date(
                                                      history.end_usage_date,
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "2-digit",
                                                          month: "short",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : "-"}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            {history.note || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductHistoryTable;
