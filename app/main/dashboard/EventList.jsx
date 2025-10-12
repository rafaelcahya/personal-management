"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingComponent from "../../LoadingComponent";
import { TrendingDown, TrendingUp } from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

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
        <div className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 border dark:border-none bg-white dark:bg-[#111214] rounded-xl space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-bold">Event List</p>
                    <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">
                        Track key political, economic, and global events that
                        move the market.
                    </p>
                </div>
                <Link href="/main/event" prefetch={false} id="eventBtn">
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white hover:text-white font-semibold">
                        Event
                    </Button>
                </Link>
            </div>

            {loading ? (
                <LoadingComponent description="Loading event list..." />
            ) : (
                <Carousel
                    opts={{ align: "start", loop: true }}
                    className="w-full"
                >
                    <CarouselContent>
                        {eventList?.slice(0, 5).map((event, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="border rounded-xl p-4 bg-white dark:bg-[#1a1b1e] shadow-sm space-y-3 h-full">
                                    {event.impact_direction === "UP" ? (
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-100 dark:bg-green-500/15 text-green-500 p-2 rounded-full inline-flex">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <p className="text-green-500 text-sm font-semibold">
                                                Market Bullish
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="bg-red-100 dark:bg-red-500/15 text-rose-500 p-2 rounded-full inline-flex">
                                                <TrendingDown className="w-5 h-5" />
                                            </div>
                                            <p className="text-rose-500 text-sm font-semibold">
                                                Market Bearish
                                            </p>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-3">
                                        {event.event_description}
                                    </p>

                                    {/* Impact */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">
                                            {event.impact_direction === "UP" ? (
                                                <p className="bg-green-100 dark:bg-green-500/15 text-green-500 px-2 py-1 rounded-full text-xs font-semibold">
                                                    {event.impact_direction}
                                                </p>
                                            ) : (
                                                <p className="bg-red-100 dark:bg-red-500/15 text-rose-500 px-2 py-1 rounded-full text-xs font-semibold">
                                                    {event.impact_direction}
                                                </p>
                                            )}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        {new Intl.DateTimeFormat("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }).format(new Date(event.event_date))}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-4">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
            )}
        </div>
    );
}

export default EventList;
