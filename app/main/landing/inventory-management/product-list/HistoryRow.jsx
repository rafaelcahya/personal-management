import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import UpdateUsageForm from "./UpdateUsageForm";

export default function HistoryRow({ item, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const isActive = item.status === "active";

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
            <>
                <CollapsibleTrigger asChild>
                    <TableRow
                        className={cn(
                            "cursor-pointer transition-colors",
                            isOpen && "bg-violet-50",
                            isActive && "hover:bg-green-50",
                            !isActive && "hover:bg-slate-50",
                        )}
                    >
                        <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4 text-slate-500" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-slate-500" />
                                )}
                                {item.start_usage_date
                                    ? new Date(
                                          item.start_usage_date,
                                      ).toLocaleDateString("id-ID", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                      })
                                    : "-"}
                            </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                            {item.end_usage_date
                                ? new Date(
                                      item.end_usage_date,
                                  ).toLocaleDateString("id-ID", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                  })
                                : "-"}
                        </TableCell>
                        <TableCell>
                            <span
                                className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${
                                    isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-orange-100 text-orange-700"
                                }`}
                            >
                                {item.status}
                            </span>
                        </TableCell>
                        <TableCell className="font-mono">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm">
                                    {item.quantity} used
                                </span>
                                {item.remaining_quantity && (
                                    <span className="text-xs text-muted-foreground">
                                        {item.remaining_quantity} remaining
                                    </span>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                </CollapsibleTrigger>

                <CollapsibleContent asChild>
                    <TableRow className="bg-violet-50/50 hover:bg-violet-50/50">
                        <TableCell colSpan={4} className="p-6">
                            <UpdateUsageForm
                                historyItem={item}
                                onUpdate={onUpdate}
                                onCancel={() => setIsOpen(false)}
                            />
                        </TableCell>
                    </TableRow>
                </CollapsibleContent>
            </>
        </Collapsible>
    );
}
