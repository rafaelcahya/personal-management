"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FilePenLine,
    MoreHorizontalIcon,
    StarIcon,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { favoriteEvent } from "@/lib/api/event";
import UpdateEvent from "./UpdateEvent";
import DeleteEvent from "./DeleteEvent";

export default function EventTable({
    events,
    allEvents,
    onEventsChange,
    onRefresh,
}) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loadingFavorite, setLoadingFavorite] = useState(null);

    const handleToggleFavorite = async (event) => {
        const newFavoriteStatus = !event.is_favorite;
        const previousState = [...allEvents];
        setLoadingFavorite(event.id);

        // Optimistic update
        onEventsChange((prev) => {
            const updated = prev.map((e) =>
                e.id === event.id
                    ? { ...e, is_favorite: newFavoriteStatus }
                    : e,
            );
            // Sort: favorites first
            return updated.sort((a, b) => {
                if (a.is_favorite === b.is_favorite) return 0;
                return a.is_favorite ? -1 : 1;
            });
        });

        try {
            await favoriteEvent(event.id, newFavoriteStatus);

            toast.success(
                newFavoriteStatus
                    ? "Event added to favorites"
                    : "Event removed from favorites",
            );
        } catch (error) {
            // Rollback on error
            onEventsChange(previousState);
            toast.error(error.message || "Failed to update favorite status");
        } finally {
            setLoadingFavorite(null);
        }
    };

    return (
        <>
            <Table className="w-full table-auto">
                <TableHeader className="bg-slate-100 sticky top-0 z-20">
                    <TableRow className="border-none">
                        <TableHead className="py-2 text-slate-foreground rounded-l-lg w-[50%]">
                            Event Description
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-center w-[15%]">
                            Impact
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-center w-[20%]">
                            Event Date
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-center rounded-r-lg w-[15%]">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map((event) => {
                        const isUpcoming =
                            new Date(event.event_date) >= new Date();
                        const isBullish = event.impact_direction === "UP";
                        const isLongDescription =
                            event.event_description.length > 120;

                        return (
                            <TableRow
                                key={event.id}
                                className="hover:bg-slate-100"
                            >
                                <TableCell className="w-[50%] py-3">
                                    <TooltipProvider>
                                        <Tooltip delayDuration={300}>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-start gap-3 cursor-help">
                                                    {event.is_favorite && (
                                                        <StarIcon className="size-4 fill-yellow-400 text-yellow-400 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-sm leading-relaxed line-clamp-3 whitespace-normal">
                                                            {
                                                                event.event_description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            {isLongDescription && (
                                                <TooltipContent
                                                    side="bottom"
                                                    align="start"
                                                    className="max-w-md p-3"
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">
                                                        {
                                                            event.event_description
                                                        }
                                                    </p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="text-center w-[15%]">
                                    <div className="flex items-center justify-center">
                                        <Badge
                                            variant="outline"
                                            className={`${
                                                isBullish
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-red-50 text-red-700 border-red-200"
                                            }`}
                                        >
                                            {isBullish ? (
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 mr-1" />
                                            )}
                                            {isBullish ? "Bullish" : "Bearish"}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center text-sm w-[20%]">
                                    <div>
                                        <p className="font-medium">
                                            {new Date(
                                                event.event_date,
                                            ).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                        <p
                                            className={`text-xs mt-0.5 ${
                                                isUpcoming
                                                    ? "text-blue-600 font-medium"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {isUpcoming ? "Upcoming" : "Past"}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center w-[15%]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 mx-auto outline-none hover:bg-slate-200"
                                            >
                                                <MoreHorizontalIcon />
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setSelectedEvent(event)
                                                }
                                                className="hover:bg-violet-50 hover:outline-none focus:bg-violet-50 cursor-pointer"
                                            >
                                                <FilePenLine className="h-4 w-4 mr-2" />
                                                Update Event
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleToggleFavorite(event)
                                                }
                                                disabled={
                                                    loadingFavorite === event.id
                                                }
                                                className="hover:bg-violet-50 hover:outline-none focus:bg-violet-50 cursor-pointer"
                                            >
                                                <StarIcon
                                                    className={`size-4 mr-2 ${
                                                        event.is_favorite
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : ""
                                                    }`}
                                                />
                                                {event.is_favorite
                                                    ? "Remove from Favorites"
                                                    : "Add to Favorites"}
                                            </DropdownMenuItem>

                                            {!event.deleted_at && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                        className="p-0"
                                                    >
                                                        <DeleteEvent
                                                            event={event}
                                                            onDeleted={
                                                                onRefresh
                                                            }
                                                        />
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {selectedEvent && (
                <UpdateEvent
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onUpdated={async () => {
                        await onRefresh();
                        setSelectedEvent(null);
                    }}
                />
            )}
        </>
    );
}
