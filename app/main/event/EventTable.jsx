"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddEvent from "./AddEvent";
import UpdateEvent from "./UpdateEvent";
import { highlightKeyword } from "@/lib/utils/highlightKeyword";
import Breadcrumbs from "../../../components/ui/common/Breadcrumbs";
import { TrendingDown, TrendingUp } from "lucide-react";

function EventTable({ events: initialEvents }) {
    const [eventList, setEventList] = useState(initialEvents || []);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [impactFilter, setImpactFilter] = useState("");

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/event/list", { cache: "no-store" });
            const data = await res.json();
            if (data.success) setEventList(data.eventList);
        } catch (err) {
            toast.error("Failed to fetch events:", err);
        }
    };

    const filteredEvents = eventList
        .filter((event) =>
            event.event_description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .filter((event) =>
            !impactFilter || impactFilter === "ALL"
                ? true
                : event.impact_direction === impactFilter
        );

    useEffect(() => {
        setEventList(initialEvents);
    }, [initialEvents]);

    return (
        <div className="shadow-[0_0_75px_16px_rgba(202,213,226,0.5)] dark:shadow-none border-slate-200 border dark:border-none bg-white dark:bg-[#111214] rounded-xl flex flex-col flex-1 px-4 sm:px-6 py-6 overflow-hidden space-y-5">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20 font-semibold">
                <div className="space-y-2">
                    <Breadcrumbs />
                    <div>
                        <p className="text-lg">Event List</p>
                        <p className="text-sm text-gray-500">
                            Track key political, economic, and global events
                            that move the market.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Link href="/main/dashboard" className="hidden sm:block">
                        <Button className="font-semibold bg-transparent hover:bg-purple-50 dark:hover:bg-purple-500/5 text-purple-600">
                            Back
                        </Button>
                    </Link>
                    <div className="hidden sm:block">
                        <AddEvent onAdded={fetchEvents} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Search Input */}
                <Input
                    type="text"
                    placeholder="Search event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 font-semibold focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm py-2"
                />

                {/* Impact Filter */}
                <Select value={impactFilter} onValueChange={setImpactFilter}>
                    <SelectTrigger className="font-semibold w-full sm:w-48">
                        <SelectValue placeholder="All Impacts" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem className="font-semibold" value="ALL">
                                All Impacts
                            </SelectItem>
                            <SelectItem className="font-semibold" value="UP">
                                Up
                            </SelectItem>
                            <SelectItem className="font-semibold" value="DOWN">
                                Down
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative w-full flex-1 overflow-y-auto mt-4">
                <Table noWrapper>
                    <TableHeader className="bg-gray-50 dark:bg-[#0e0f11] sticky top-0 z-10">
                        <TableRow className="border-none">
                            <TableHead className="font-semibold min-w-[400px] rounded-l-lg">
                                Event Description
                            </TableHead>
                            <TableHead className="font-semibold w-[200px] min-w-[200px]">
                                Impact Direction
                            </TableHead>
                            <TableHead className="font-semibold w-[200px] min-w-[200px] rounded-r-lg">
                                Event Date
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredEvents.map((event, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-gray-50 dark:hover:bg-[#0e0f11] rounded-l-lg cursor-pointer"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <TableCell className="font-semibold whitespace-normal">
                                    {highlightKeyword(
                                        event.event_description,
                                        searchTerm,
                                        "bg-violet-100 text-violet-600 font-medium"
                                    )}
                                </TableCell>
                                <TableCell className="flex items-center gap-2 font-semibold">
                                    {event.impact_direction}{" "}
                                    {event.impact_direction === "UP" ? (
                                        <div className="bg-trade-profit text-trade-profit-foreground p-2 rounded-full inline-flex">
                                            <TrendingDown className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="bg-trade-loss text-trade-loss-foreground p-2 rounded-full inline-flex">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-semibold pr-6 py-4">
                                    {new Intl.DateTimeFormat("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(new Date(event.event_date))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <UpdateEvent
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onUpdated={fetchEvents}
                />
            </div>
        </div>
    );
}

export default EventTable;
