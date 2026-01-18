import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ProductHistoryTable({ history }) {
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>Usage Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!history || history.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center text-muted-foreground py-8"
                            >
                                No history available
                            </TableCell>
                        </TableRow>
                    ) : (
                        history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono text-sm">
                                    {new Date(
                                        item.usage_date
                                    ).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${
                                            item.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-orange-100 text-orange-700"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </TableCell>
                                <TableCell className="font-mono">
                                    {item.quantity}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
