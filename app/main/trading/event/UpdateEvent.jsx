"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventSchema } from "@/schemas/event";
import { updateEvent } from "@/lib/api/event";

export default function UpdateEvent({ event, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    const form = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            event_description: "",
            impact_direction: "UP",
            event_date: new Date(),
        },
    });

    const { control, reset } = form;

    // Reset form saat event berubah
    useEffect(() => {
        if (event) {
            reset({
                event_description: event.event_description,
                impact_direction: event.impact_direction,
                event_date: new Date(event.event_date),
            });
            setServerError(null);
        }
    }, [event, reset]);

    const onSubmit = async (values) => {
        setLoading(true);
        setServerError(null);

        try {
            const payload = {
                event_description: values.event_description,
                impact_direction: values.impact_direction,
                event_date: values.event_date.toISOString().split("T")[0],
            };

            await updateEvent(event.id, payload);

            toast.success("Event updated successfully! ✅");
            onUpdated?.();
        } catch (err) {
            console.error("Update error:", err);
            setServerError(err.message || "Failed to update event");
        } finally {
            setLoading(false);
        }
    };

    if (!event) return null;

    return (
        <Dialog open={!!event} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh]">
                <DialogHeader className="text-left shrink-0">
                    <DialogTitle>✏️ Update Event</DialogTitle>
                    <DialogDescription>
                        Modify event details or mark as important
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {/* Event Description */}
                            <FormField
                                control={control}
                                name="event_description"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Event Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Event description"
                                                className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                                                    fieldState.error
                                                        ? "border-rose-500"
                                                        : ""
                                                }`}
                                                rows={4}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            What's happening in the market? 📰
                                        </p>
                                        <FormMessage className="font-medium">
                                            {fieldState.error?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Impact Direction */}
                            <FormField
                                control={control}
                                name="impact_direction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Impact Direction
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="min-w-full font-medium">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="UP">
                                                    📈 Bullish (UP)
                                                </SelectItem>
                                                <SelectItem value="DOWN">
                                                    📉 Bearish (DOWN)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            How will this affect the market? 🎯
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Event Date */}
                            <FormField
                                control={control}
                                name="event_date"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="font-medium">
                                            Event Date
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-medium",
                                                            fieldState.error &&
                                                                "border-rose-500",
                                                            !field.value &&
                                                                "text-slate-500",
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP",
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-xs text-muted-foreground">
                                            When is this event happening? 📅
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Server Error Display */}
                            {serverError && (
                                <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-red-900 mb-1">
                                                ⚠️ Unable to Update Event
                                            </p>
                                            <p className="text-sm text-red-800">
                                                {serverError}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="shrink-0 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                                className="text-violet-600 hover:bg-violet-100"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {loading ? "Updating..." : "Update Event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
