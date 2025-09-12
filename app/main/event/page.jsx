"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import EventTable from "./EventTable";
import LoadingComponent from "../../LoadingComponent";

export default function EventPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/event/list", {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data.success) setEvents(data.eventList);
            } catch (err) {
                toast.error("Failed to fetch events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-6 py-6 xl:py-20 max-w-full sm:max-w-xl md:max-w-5xl xl:max-w-7xl">
            <Link href="/main/dashboard">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white hover:text-white">
                    <ChevronLeft />
                    Back
                </Button>
            </Link>

            {loading ? (
                <div className="flex flex-1 items-center justify-center">
                    <LoadingComponent description="Loading all fees..." />
                </div>
            ) : (
                <EventTable events={events} />
            )}
        </main>
    );
}
