"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchEventList } from "@/lib/api/event";
import { toast } from "sonner";
import EventListSummary from "./component/EventListSummary";
import EventTableHeader from "./component/EventTableHeader";
import EventsTable from "./EventTable";
import AddEvent from "./AddEvent";
import EventFilterDropdown from "./component/EventFilterDropdown";

const FILTER_STORAGE_KEY = "event-list-filter";

export default function EventsPageClient({ initialEvents }) {
    const [listEvent, setListEvent] = useState(initialEvents || []);
    const [filter, setFilter] = useState(null);

    // Load filter from localStorage on mount
    useEffect(() => {
        try {
            const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
            if (savedFilter) {
                setFilter(savedFilter === "null" ? null : savedFilter);
            }
        } catch (error) {
            console.error("Failed to load filter from localStorage:", error);
        }
    }, []);

    // Save filter to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(
                FILTER_STORAGE_KEY,
                filter === null ? "null" : filter,
            );
        } catch (error) {
            console.error("Failed to save filter to localStorage:", error);
        }
    }, [filter]);

    const fetchEvents = useCallback(async () => {
        try {
            const events = await fetchEventList();
            setListEvent(events || []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(err.message || "Failed to fetch events");
        }
    }, []);

    useEffect(() => {
        if (initialEvents && initialEvents.length > 0) {
            setListEvent(initialEvents);
        } else {
            fetchEvents();
        }
    }, [initialEvents, fetchEvents]);

    // Filter logic
    const filteredEvents = listEvent.filter((event) => {
        if (!filter) return true;

        switch (filter) {
            case "bullish":
                return event.impact_direction === "UP";
            case "bearish":
                return event.impact_direction === "DOWN";
            case "favorite":
                return event.is_favorite;
            case "upcoming":
                return new Date(event.event_date) >= new Date();
            case "past":
                return new Date(event.event_date) < new Date();
            default:
                return true;
        }
    });

    // Handle filter change with feedback
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);

        const messages = {
            null: "Showing all events",
            bullish: "Showing bullish events",
            bearish: "Showing bearish events",
            favorite: "Showing favorite events",
            upcoming: "Showing upcoming events",
            past: "Showing past events",
        };

        const toastTypes = {
            null: "success",
            bullish: "success",
            bearish: "success",
            favorite: "success",
            upcoming: "info",
            past: "info",
        };

        const message = messages[newFilter] || messages[null];
        const toastType = toastTypes[newFilter] || "success";

        toast[toastType](message);
    };

    return (
        <div className="flex flex-col h-full gap-5">
            <EventListSummary events={listEvent} />

            <div className="flex-1 min-h-0 relative border rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                        <div className="max-w-[500px]">
                            <EventTableHeader />
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
                            <EventFilterDropdown
                                filter={filter}
                                onFilterChange={handleFilterChange}
                                events={listEvent}
                            />

                            <AddEvent onAdded={fetchEvents} />
                        </div>
                    </div>

                    {listEvent.length === 0 ? (
                        <p className="text-center font-medium text-slate-foreground py-10">
                            No events yet. Start by adding a new event 🚀
                        </p>
                    ) : (
                        <EventsTable
                            events={filteredEvents}
                            allEvents={listEvent}
                            filter={filter}
                            setFilter={setFilter}
                            onEventsChange={setListEvent}
                            onRefresh={fetchEvents}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
