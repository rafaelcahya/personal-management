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
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            const events = await fetchEventList();
            setListEvent(events || []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(err.message || "Failed to fetch events");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialEvents && initialEvents.length > 0) {
            setListEvent(initialEvents);
        } else {
            fetchEvents();
        }
    }, [initialEvents, fetchEvents]);

    const filteredEvents = listEvent.filter((event) => {
        if (!filter) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);

        switch (filter) {
            case "bullish":
                return event.impact_direction === "UP";
            case "bearish":
                return event.impact_direction === "DOWN";
            case "favorite":
                return event.is_favorite === true;
            case "upcoming":
                return eventDate >= today;
            case "past":
                return eventDate < today;
            default:
                return true;
        }
    });

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);

        const filterMessages = {
            null: "Showing all events 📅",
            bullish: "Showing bullish events 📈",
            bearish: "Showing bearish events 📉",
            favorite: "Showing favorite events ⭐",
            upcoming: "Showing upcoming events 🔜",
            past: "Showing past events 📜",
        };

        const message = filterMessages[newFilter] || filterMessages.null;
        toast.success(message);
    };

    return (
        <div className="flex flex-col h-full gap-5">
            {/* Summary Cards */}
            <EventListSummary events={listEvent} />

            {/* Main Table Container */}
            <div className="flex-1 min-h-0 relative border border-slate-200/50 shadow-slate-100 rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    {/* Header Section */}
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

                    {/* Table or Empty State */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="size-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                            <p className="text-sm text-slate-600 font-medium">
                                Loading events...
                            </p>
                        </div>
                    ) : listEvent.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <p className="text-center font-medium text-slate-600 text-lg">
                                No events yet
                            </p>
                            <p className="text-center text-slate-500 text-sm">
                                Start by adding your first market event to
                                track! 📅
                            </p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <p className="text-center font-medium text-slate-600 text-lg">
                                No events match this filter
                            </p>
                            <p className="text-center text-slate-500 text-sm">
                                Try a different filter or add a new event 🔍
                            </p>
                        </div>
                    ) : (
                        <EventsTable
                            events={filteredEvents}
                            allEvents={listEvent}
                            onEventsChange={setListEvent}
                            onRefresh={fetchEvents}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
