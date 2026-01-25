import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import UsageCompletionForm from "./UsageCompletionForm";

export default function LogRow({ item, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const isActive = item.status === "active";

    return (
        <>
            <TableRow
                className={cn(
                    "cursor-pointer transition-colors",
                    isOpen && "bg-violet-50/75",
                    isActive && "hover:bg-violet-50/75",
                    !isActive && "hover:bg-slate-50/50",
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <TableCell>
                    <div className="flex items-center gap-2">
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                        )}
                    </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                    {item.start_usage_date
                        ? new Date(item.start_usage_date).toLocaleDateString(
                              "id-ID",
                              {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                              },
                          )
                        : "-"}
                </TableCell>
                <TableCell className="font-mono text-sm">
                    {item.end_usage_date
                        ? new Date(item.end_usage_date).toLocaleDateString(
                              "id-ID",
                              {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                              },
                          )
                        : "-"}
                </TableCell>
                <TableCell>
                    <span
                        className={cn(
                            "px-2 py-0.5 rounded-md text-xs font-semibold capitalize",
                            isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700",
                        )}
                    >
                        {item.status}
                    </span>
                </TableCell>
                <TableCell className="font-mono">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm">{item.quantity} used</span>
                        {item.remaining_quantity && (
                            <span className="text-xs text-muted-foreground">
                                {item.remaining_quantity} remaining
                            </span>
                        )}
                    </div>
                </TableCell>
            </TableRow>

            {isOpen && (
                <TableRow className="bg-violet-50/50 hover:bg-violet-50/50">
                    <TableCell colSpan={5} className="p-6">
                        <UsageCompletionForm
                            historyItem={item}
                            onUpdate={onUpdate}
                            onCancel={() => setIsOpen(false)}
                        />
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}
