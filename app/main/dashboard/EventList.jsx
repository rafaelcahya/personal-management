"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingComponent from "../../LoadingComponent";

function EventList() {
    const [eventList, setEventList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/event/list")
            .then((r) => r.json())
            .then((d) => {
                d.success && setEventList(d.eventList);
            })
            .catch(toast.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="shadow-black/5 shadow-lg border-none bg-white backdrop-blur-2xl rounded-xl space-y-4 p-6 overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-semibold tracking-[0.010em]">
                        Event List
                    </p>
                    <p className="text-sm text-gray-500">
                        Track key political, economic, and global events that
                        move the market.
                    </p>
                </div>
                <Link href="/main/event" prefetch={false}>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white hover:text-white">
                        Event
                    </Button>
                </Link>
            </div>

            {loading ? (
                <LoadingComponent description="Loading fee list..." />
            ) : (
                <Table>
                    <TableHeader className="bg-violet-50 rounded-xl">
                        <TableRow className="border-none">
                            <TableHead className="rounded-l-lg w-[400px] md:w-1/2">
                                Event Description
                            </TableHead>
                            <TableHead>Impact Direction</TableHead>
                            <TableHead className="rounded-r-lg">
                                Event Date
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {eventList.slice(0, 10).map((event, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-violet-50"
                            >
                                <TableCell className="whitespace-normal">
                                    {event.event_description}
                                </TableCell>
                                <TableCell>{event.impact_direction}</TableCell>
                                <TableCell className="py-4">
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
            )}
        </div>
    );
}

export default EventList;
