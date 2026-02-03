"use client";

import { useEffect, useState } from "react";
import EventTable from "./EventTable";
import LoadingComponent from "../../../LoadingComponent";

export default function EventPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/trade/event/list");
                const data = await res.json();
                if (data.success) setEvents(data.events);
            } catch (err) {
                console.error("Failed to fetch events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                {/* Layer 1: Gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-blue-50/50 to-orange-100/50"></div>

                {/* Layer 2: Frosted glass noise */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent backdrop-blur-lg"></div>
            </div>
            {loading ? (
                <div className="flex flex-1 items-center justify-center">
                    <LoadingComponent description="Loading all events..." />
                </div>
            ) : (
                <EventTable events={events} />
            )}
        </main>
    );
}
