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
    FormDescription,
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

    const form = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            event_description: "",
            impact_direction: "UP",
            event_date: new Date(),
        },
    });

    const { control, handleSubmit, reset } = form;

    const handleAddEvent = async (values) => {
        setLoading(true);
        try {
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
            console.error(err);
            toast.error(err.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild id="addNewEventBtn">
                <Button>
                    <PlusIcon />
                    <span>Add Event</span>
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-md flex flex-col max-h-[90vh]"
                id="addNewEventDialogForm"
            >
                <DialogHeader className="text-left shrink-0">
                    <DialogTitle>📅 Add Market Event</DialogTitle>
                    <DialogDescription className="text-slate-600">
                        Track events that may impact market movements
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleAddEvent)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                                                id="eventDescriptionField"
                                                className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                                                    fieldState.error
                                                        ? "border-rose-500"
                                                        : ""
                                                }`}
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            What's happening in the market? 📰
                                        </FormDescription>
                                        <FormMessage className="font-medium">
                                            {fieldState.error?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Impact Direction & Event Date Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Impact Direction */}
                                <FormField
                                    control={control}
                                    name="impact_direction"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                Impact Direction
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        id="impactDirectionField"
                                                        className={`w-full font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 ${
                                                            fieldState.error
                                                                ? "border-rose-500"
                                                                : ""
                                                        }`}
                                                    >
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
                                            <FormDescription className="text-xs">
                                                How will this affect the market?
                                                🎯
                                            </FormDescription>
                                            <FormMessage className="font-medium">
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
                                            <FormLabel className="font-medium">
                                                Event Date
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            id="eventDateField"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600",
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
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription className="text-xs">
                                                When is this event happening? 📅
                                            </FormDescription>
                                            <FormMessage className="font-medium">
                                                {fieldState.error?.message}
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="shrink-0 pt-4">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
                                    id="cancelNewEventBtn"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={loading}
                                id="submitNewEventBtn"
                            >
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
