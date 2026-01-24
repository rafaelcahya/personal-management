import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import HistoryRow from "./HistoryRow";

export default function ProductHistoryTable({ history, onUpdate }) {
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>Start Usage Date</TableHead>
                        <TableHead>End Usage Date</TableHead>
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
                                No usage history recorded yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        history.map((item) => (
                            <HistoryRow
                                key={item.id}
                                item={item}
                                onUpdate={onUpdate}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
