"use client";

import { useEffect, useState } from "react";
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
import AddEvent from "./AddEvent";
import UpdateEvent from "./UpdateEvent";

import { highlightKeyword } from "@/lib/utils/highlightKeyword";

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
        <div className="shadow shadow-black/5 border-none bg-white/70 backdrop-blur-3xl flex flex-col flex-1 p-6 rounded-2xl overflow-hidden space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-0 sm:gap-20">
                <div>
                    <p className="text-lg font-semibold tracking-[0.010em]">
                        Event List
                    </p>
                    <p className="text-sm text-gray-500">
                        Track key political, economic, and global events that
                        move the market.
                    </p>
                </div>
                <div className="hidden sm:block">
                    <AddEvent onAdded={fetchEvents} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Search Input */}
                <Input
                    type="text"
                    placeholder="Search event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                />

                {/* Impact Filter */}
                <Select value={impactFilter} onValueChange={setImpactFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Impacts" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="ALL">All Impacts</SelectItem>
                            <SelectItem value="UP">Up</SelectItem>
                            <SelectItem value="DOWN">Down</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative w-full flex-1 overflow-y-auto mt-4">
                <Table noWrapper>
                    <TableHeader className="bg-violet-50 sticky top-0 z-10">
                        <TableRow className=" border-none">
                            <TableHead className="w-1/2 min-w-[50%] max-w-[50%] rounded-l-xl">
                                Event Description
                            </TableHead>
                            <TableHead>Impact Direction</TableHead>
                            <TableHead className="rounded-r-xl">
                                Event Date
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredEvents.map((event, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-violet-50 cursor-pointer"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <TableCell className="w-[50%] min-w-[50%] max-w-[50%] whitespace-normal">
                                    {highlightKeyword(
                                        event.event_description,
                                        searchTerm,
                                        "bg-violet-200 text-violet-600 font-semibold"
                                    )}
                                </TableCell>
                                <TableCell>{event.impact_direction}</TableCell>
                                <TableCell className="pr-6 py-4">
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
