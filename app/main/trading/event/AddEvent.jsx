"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Loader2, PlusIcon, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventSchema } from "@/schemas/event";
import { createEvent } from "@/lib/api/event";

export default function AddEvent({ onAdded }) {
    const [open, setOpen] = useState(false);
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

    const onSubmit = async (values) => {
        setLoading(true);
        setServerError(null);

        try {
            // Format date to ISO string
            const payload = {
                event_description: values.event_description,
                impact_direction: values.impact_direction,
                event_date: values.event_date.toISOString().split("T")[0],
            };

            await createEvent(payload);

            toast.success("Event created successfully! 🎉");
            setOpen(false);
            reset();
            onAdded?.();
        } catch (err) {
            console.error("Submit error:", err);
            setServerError(err.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setServerError(null);
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <PlusIcon />
                    <span>Add Event</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh]">
                <DialogHeader className="text-left shrink-0">
                    <DialogTitle>📅 Add Market Event</DialogTitle>
                    <DialogDescription>
                        Track events that may impact market movements
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
                                                placeholder="e.g., Federal Reserve announces interest rate decision, impacting USD strength and global equity markets"
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
                                                    <SelectValue placeholder="Select impact" />
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
                                                ⚠️ Unable to Create Event
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
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {loading ? "Creating..." : "Create Event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
