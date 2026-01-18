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

function ProductHistoryTable({ initialProductHistories }) {
    const [listProductHistory, setListProductHistory] = useState(
        initialProductHistories || []
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
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                    <p className="text-lg font-semibold">Product History</p>
                    <p className="text-sm text-slate-foreground">
                        Complete history of all product usage and adjustments
                    </p>
                </div>
            </div>
            {loading ? (
                <p className="text-center py-8 text-muted-foreground">
                    Loading...
                </p>
            ) : !listProductHistory || listProductHistory.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                    No history available
                </p>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Usage Date</TableHead>
                                <TableHead>Note</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listProductHistory.map((history) => (
                                <TableRow key={history.id}>
                                    <TableCell className="font-medium">
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
                                            history.usage_date
                                        ).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
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
    );
}

export default ProductHistoryTable;
