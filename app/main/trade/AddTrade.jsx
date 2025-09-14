"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { tradeSchema } from "@/schemas/trade";
import { addTrade } from "@/lib/api/trade";
import { fetchTradeOptions } from "@/lib/api/options";

import { formatRupiah } from "@/lib/utils/currencyFormatter";

const CurrencyInputField = ({ field, fieldState, placeholder }) => (
    <Input
        type="text"
        value={formatRupiah(field.value)}
        placeholder={placeholder}
        className={`text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
            fieldState.error ? "border-rose-500" : ""
        }`}
        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
    />
);

export default function AddNewTrade({ onAdded }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({
        entrySession: [],
        entryOccasion: [],
        buyReason: [],
        sellReason: [],
    });

    const form = useForm({
        resolver: zodResolver(tradeSchema),
        defaultValues: {
            trade_date: new Date(),
            ticker: "",
            margin: "",
            proceeds: "",
            return_percent: "",
            realized_gain: "",
            entry_session_option: "",
            entry_occasion_option: "",
            buy_reason_option: "",
            sell_reason_option: "",
            notes: "",
        },
    });
    const { watch, setValue, control, handleSubmit, reset } = form;

    // Hitung otomatis realized gain & return%
    const margin = watch("margin");
    const proceeds = watch("proceeds");

    useEffect(() => {
        const marginNum = parseFloat(margin);
        const proceedsNum = parseFloat(proceeds);

        if (!isNaN(marginNum) && !isNaN(proceedsNum)) {
            const gain = proceedsNum - marginNum;
            setValue("realized_gain", gain.toFixed(2));

            if (marginNum !== 0) {
                setValue(
                    "return_percent",
                    ((gain / marginNum) * 100).toFixed(2) + "%"
                );
            }
        } else {
            setValue("realized_gain", "");
            setValue("return_percent", "");
        }
    }, [margin, proceeds, setValue]);

    // Fetch dropdown options
    const fetchOptions = useCallback(async () => {
        const data = await fetchTradeOptions();
        setOptions(data);
    }, []);

    useEffect(() => {
        if (open) fetchOptions();
    }, [open, fetchOptions]);

    // Submit handler
    const handleAddNewTrade = async (values) => {
        setLoading(true);
        try {
            await addTrade(values);
            toast.success("New trade added successfully!");
            setOpen(false);
            onAdded?.();
            reset();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                    Add New Trade
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90svh] overflow-y-auto space-y-5">
                <DialogHeader className="text-left">
                    <DialogTitle>Add New Trade</DialogTitle>
                    <DialogDescription>
                        Record your latest trade details to keep track of
                        performance and insights.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleAddNewTrade)}
                        className="space-y-6"
                    >
                        {/* Trade Date */}
                        <FormField
                            control={control}
                            name="trade_date"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Trade Date</FormLabel>
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
                                                {field.value
                                                    ? format(field.value, "PPP")
                                                    : "Pick a date"}
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

                        {/* Ticker */}
                        <FormField
                            control={control}
                            name="ticker"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Ticker</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. AAPL"
                                            className={`uppercase text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                fieldState.error
                                                    ? "border-rose-500"
                                                    : ""
                                            }`}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Margin */}
                        <FormField
                            control={control}
                            name="margin"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Margin</FormLabel>
                                    <FormControl>
                                        <CurrencyInputField
                                            field={field}
                                            fieldState={fieldState}
                                            placeholder="e.g. 1000"
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Proceeds */}
                        <FormField
                            control={control}
                            name="proceeds"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Proceeds</FormLabel>
                                    <FormControl>
                                        <CurrencyInputField
                                            field={field}
                                            fieldState={fieldState}
                                            placeholder="e.g. 2000"
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Realized Gain */}
                        <FormField
                            control={control}
                            name="realized_gain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Realized Gain</FormLabel>
                                    <FormDescription>
                                        Calculated automatically from Margin &
                                        Proceeds
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            value={formatRupiah(field.value)}
                                            disabled
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Return % */}
                        <FormField
                            control={control}
                            name="return_percent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Return %</FormLabel>
                                    <FormControl>
                                        <Input value={field.value} disabled />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Dropdown Options */}
                        {[
                            {
                                name: "entry_session_option",
                                label: "Entry Session",
                                data: options.entrySession,
                                key: "entry_session_options",
                            },
                            {
                                name: "entry_occasion_option",
                                label: "Entry Occasion",
                                data: options.entryOccasion,
                                key: "entry_occasion_option",
                            },
                            {
                                name: "buy_reason_option",
                                label: "Buy Reason",
                                data: options.buyReason,
                                key: "buy_reason_options",
                            },
                            {
                                name: "sell_reason_option",
                                label: "Sell Reason",
                                data: options.sellReason,
                                key: "sell_reason_options",
                            },
                        ].map(({ name, label, data, key }) => (
                            <FormField
                                key={name}
                                control={control}
                                name={name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{label}</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger className="min-w-full">
                                                    <SelectValue
                                                        placeholder={`Select ${label}`}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent
                                                    className="w-auto max-w-[90vw] min-w-[200px] overflow-auto"
                                                    style={{
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {data.map((opt) => (
                                                        <SelectItem
                                                            key={opt.id}
                                                            value={opt[key]}
                                                            className="whitespace-normal break-words"
                                                        >
                                                            {opt[key]}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        ))}

                        {/* Notes */}
                        <FormField
                            control={control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Additional notes"
                                            className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-violet-600 hover:bg-violet-700 dark:text-white"
                            >
                                {loading ? "Submitting..." : "Submit new trade"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
