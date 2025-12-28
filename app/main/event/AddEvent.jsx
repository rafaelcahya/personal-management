"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { eventSchema } from "@/schemas/event";
import { addEvent } from "@/lib/api/event";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function AddEvent({ onAdded }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            event_date: new Date(),
            event_description: "",
            impact_direction: "",
        },
    });

    const { control, handleSubmit, reset } = form;

    const handleAddNewEvent = async (values) => {
        setLoading(true);
        try {
            await addEvent(values);
            toast.success("New event added successfully!");
            setOpen(false);
            onAdded?.();
            reset();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
                    id="addNewEventBtn"
                >
                    Add New Event
                </Button>
            </DialogTrigger>

            <DialogContent
                id="addNewEventDialogForm"
                className="sm:max-w-lg overflow-y-auto font-semibold"
            >
                <DialogHeader>
                    <DialogTitle>Add Market Event</DialogTitle>
                    <DialogDescription>
                        Capture key events that drive stock movements and
                        influence your strategy.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleAddNewEvent)}
                        className="space-y-6"
                    >
                        {/* Event Description */}
                        <FormField
                            control={control}
                            name="event_description"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Event description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            id="eventDescriptionField"
                                            placeholder="e.g. Event description"
                                            className={cn(
                                                "focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 h-[150px]",
                                                fieldState.error &&
                                                    "border-rose-500"
                                            )}
                                        ></Textarea>
                                    </FormControl>
                                    <FormMessage id="eventDescriptionMsg">
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
                                    <FormLabel className="font-semibold">
                                        Impact Direction
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
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
                                            <SelectItem value="UP" className="font-semibold">
                                                Up
                                            </SelectItem>
                                            <SelectItem value="DOWN" className="font-semibold">
                                                Down
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage id="impactDescription">
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
                                    <FormLabel className="font-semibold">
                                        Event Date
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-semibold",
                                                    fieldState.error &&
                                                        "border-rose-500 text-trade-loss",
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
                                                onSelect={(date) =>
                                                    field.onChange(
                                                        date || new Date()
                                                    )
                                                }
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
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    id="cancelNewEventBtn"
                                    className="font-semibold text-secondary-foreground bg-transparent hover:bg-secondary-hover"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                id="submitNewEventBtn"
                                disabled={loading}
                                className="font-semibold bg-primary hover:bg-primary-hover text-primary-foreground"
                            >
                                {loading ? "Submitting..." : "Submit new event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
