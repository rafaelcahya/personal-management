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

const BACKGROUND_COLORS = [
    "bg-cyan-50",
    "bg-red-50",
    "bg-orange-50",
    "bg-yellow-50",
    "bg-lime-50",
    "bg-indigo-50",
    "bg-pink-50",
];

function EventList() {
    const [eventList, setEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [randomColors, setRandomColors] = useState([]);

    useEffect(() => {
        fetch("/api/event/list")
            .then((r) => r.json())
            .then((d) => {
                if (d.success) {
                    setEventList(d.eventList);
                    // Generate random colors for each event
                    const colors = d.eventList
                        .slice(0, 5)
                        .map(
                            () =>
                                BACKGROUND_COLORS[
                                    Math.floor(
                                        Math.random() * BACKGROUND_COLORS.length
                                    )
                                ]
                        );
                    setRandomColors(colors);
                }
            })
            .catch(toast.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col gap-2 bg-white rounded-xl shadow-lg shadow-gray-500/5 space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-bold">Event List</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
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
                                <div
                                    className={`
                                    flex flex-col justify-between 
                                    rounded-xl space-y-4 h-full p-6
                                    ${
                                        randomColors[index] ||
                                        BACKGROUND_COLORS[0]
                                    }
                                    transition-all duration-300
                                `}
                                >
                                    {/* Description */}
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-5 min-h-[100px]">
                                        {event.event_description}
                                    </p>

                                    {/* Impact */}
                                    <div className="flex items-center gap-2">
                                        {event.impact_direction === "UP" ? (
                                            <p className="text-green-600 dark:text-green-400 text-xs font-semibold bg-green-100/80 dark:bg-green-900/50 border border-green-200/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                                                Market Bullish
                                            </p>
                                        ) : (
                                            <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold bg-rose-100/80 dark:bg-rose-900/50 border border-rose-200/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                                                Market Bearish
                                            </p>
                                        )}
                                    </div>
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
