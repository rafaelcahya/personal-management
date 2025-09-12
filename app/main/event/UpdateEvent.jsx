"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { eventSchema } from "@/schemas/event";
import { updateEvent } from "@/lib/api/event";
import safeDate from "@/lib/utils/safeDate";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import DeleteEvent from "./DeleteEvent";

export default function UpdateEvent({ event, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {},
    });

    const { control, handleSubmit, reset } = form;

    useEffect(() => {
        if (event) {
            reset({
                event_description: event.event_description?.toString() ?? "",
                impact_direction: event.impact_direction ?? "",
                event_date: safeDate(event.event_date),
            });
        }
    }, [event, reset]);

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                event_date: values.event_date
                    ? format(values.event_date, "yyyy-MM-dd")
                    : null,
            };
            await updateEvent(event.id, payload);
            toast.success("Event updated successfully!");
            onUpdated?.();
            onClose();
        } catch (err) {
            toast.error(err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!event) return null;

    return (
        <Dialog open={!!event} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Event</DialogTitle>
                    <DialogDescription>
                        Adjust event information to reflect the latest market
                        impact and refine your trading analysis.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleUpdate)}
                        className="space-y-6"
                    >
                        {/* Event Description */}
                        <FormField
                            control={control}
                            name="event_description"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Event description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="e.g. Event description"
                                            className={cn(
                                                "text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500",
                                                fieldState.error &&
                                                    "border-rose-500"
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Impact Direction */}
                        <FormField
                            control={control}
                            name="impact_direction"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Impact Direction</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className={cn(
                                                    "text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 w-full",
                                                    fieldState.error &&
                                                        "border-rose-500"
                                                )}
                                            >
                                                <SelectValue placeholder="Select impact" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="UP">
                                                Up
                                            </SelectItem>
                                            <SelectItem value="DOWN">
                                                Down
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Event Date */}
                        <FormField
                            control={control}
                            name="event_date"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Event Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    fieldState.error &&
                                                        "border-rose-500 text-rose-500",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
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
                                                className="calendar-02"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <div className="flex justify-between w-full">
                                <DeleteEvent
                                    event={event}
                                    onDeleted={onUpdated}
                                    onClose={onClose}
                                />
                                <div className="space-x-2">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            className="text-violet-600 bg-white hover:bg-purple-50"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-violet-600 hover:bg-violet-700"
                                    >
                                        {loading
                                            ? "Updating..."
                                            : "Update Event"}
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
