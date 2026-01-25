import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import LogRow from "./LogRow";

export default function ProductUsageLog({ log, onUpdate }) {
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader className="bg-violet-50/75">
                    <TableRow>
                        <TableHead>⚙️</TableHead>
                        <TableHead>Start Usage Date</TableHead>
                        <TableHead>End Usage Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!log || log.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center text-muted-foreground py-8"
                            >
                                <p className="font-semibold">
                                    📭 Nothing tracked yet!
                                </p>
                                <p>Hit "Record New Usage" to get started! 🚀</p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        log.map((item) => (
                            <LogRow
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
