"use client";

import { useEffect, useState } from "react";
import { fetchProductHistory } from "@/lib/api/productHistory";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function ProductHistoryTable({
    productHistories: initialProductHistories,
    filterStatus,
}) {
    const [listProductHistory, setListProductHistory] = useState(
        initialProductHistories || [],
    );
    const [loading, setLoading] = useState(false);

    const filteredHistories = (listProductHistory || []).filter((history) => {
        if (!filterStatus) return true;
        return history.status === filterStatus;
    });

    const fetchProductHistories = async () => {
        setLoading(true);
        try {
            const histories = await fetchProductHistory();
            setListProductHistory(histories);
        } catch (err) {
            console.error("Failed to fetch product histories:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-200";
            case "inactive":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "completed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-slate-100 text-slate-800 border-slate-200";
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
        <>
            {loading ? (
                <p className="text-center py-10 text-muted-foreground">
                    Loading history...
                </p>
            ) : filteredHistories.length === 0 ? (
                <div className="text-center font-medium text-slate-foreground py-10">
                    <p>
                        {filterStatus
                            ? `No ${filterStatus} history found`
                            : "No history records yet. Start using products to see history 🚀"}
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-auto">
                    <Table className="w-full table-auto">
                        <TableHeader className="bg-slate-100 sticky top-0 z-20">
                            <TableRow className="border-none">
                                <TableHead className="py-2 text-slate-foreground rounded-l-lg text-center w-[40px]">
                                    #
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground w-[250px]">
                                    Product
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground text-center w-[100px]">
                                    Status
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground text-center w-[80px]">
                                    Quantity
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground text-center w-[130px]">
                                    Start Date
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground text-center w-[130px]">
                                    End Date
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground rounded-r-lg">
                                    Note
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredHistories.map((history, index) => (
                                <TableRow
                                    key={history.id}
                                    className="hover:bg-slate-100"
                                >
                                    <TableCell className="text-center text-sm font-mono w-[40px]">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="font-semibold w-[250px]">
                                        <div className="min-w-0">
                                            <p className="truncate">
                                                {history.brand}
                                            </p>
                                            <p className="text-slate-500 text-sm truncate">
                                                {history.type} {history.product}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center w-[100px]">
                                        <Badge
                                            className={cn(
                                                "capitalize",
                                                getStatusClasses(
                                                    history.status,
                                                ),
                                            )}
                                        >
                                            {history.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-mono font-medium w-[80px]">
                                        {history.quantity}
                                    </TableCell>
                                    <TableCell className="text-center text-sm w-[130px]">
                                        {new Date(
                                            history.start_usage_date,
                                        ).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell className="text-center text-sm w-[130px]">
                                        {history.end_usage_date
                                            ? new Date(
                                                  history.end_usage_date,
                                              ).toLocaleDateString("id-ID", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <p className="line-clamp-2 text-sm text-slate-600">
                                            {history.note || "-"}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    );
}

export default ProductHistoryTable;
