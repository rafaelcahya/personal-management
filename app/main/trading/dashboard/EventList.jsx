"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoadingComponent from "../../../LoadingComponent";

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
    const [randomCardIndices, setRandomCardIndices] = useState([]);

    useEffect(() => {
        fetch("/api/trade/event/list")
            .then((r) => r.json())
            .then((d) => {
                if (d.success) {
                    setEventList(d.events);
                    // Simple random colors
                    const indices = Array.from(
                        { length: 5 },
                        () => Math.floor(Math.random() * 7) + 1
                    );
                    setRandomCardIndices(indices);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-card rounded-2xl p-6 border border-gray-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                    <p className="text-lg font-semibold text-foreground">
                        Event List
                    </p>
                    <p className="text-sm text-slate-foreground">
                        Track key political, economic, and global events that
                        move the market.
                    </p>
                </div>
                <Link
                    href="/main/trading/event"
                    id="eventBtn"
                >
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                        Event
                    </Button>
                </Link>
            </div>

            {/* Simple Carousel */}
            {loading ? (
                <LoadingComponent description="Loading events..." />
            ) : (
                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                        {eventList?.slice(0, 5).map((event, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3 pl-4"
                            >
                                <div className="h-max p-6 rounded-xl border transition-all duration-200">
                                    {/* Description */}
                                    <p className="font-medium text-foreground text-sm leading-relaxed line-clamp-4 mb-4 h-[140px]">
                                        {event.event_description}
                                    </p>

                                    {/* Impact Badge */}
                                    <div className="flex items-center gap-2">
                                        {event.impact_direction === "UP" ? (
                                            <span className="text-trade-profit-foreground bg-trade-profit px-3 py-1 rounded-full text-xs font-semibold">
                                                Bullish
                                            </span>
                                        ) : (
                                            <span className="text-trade-loss-foreground bg-trade-loss px-3 py-1 rounded-full text-xs font-semibold">
                                                Bearish
                                            </span>
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
