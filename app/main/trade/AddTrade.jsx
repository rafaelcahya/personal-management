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

import { formatRupiah } from "@/lib/utils/currencyFormatter";

const CurrencyInputField = ({ field, fieldState, placeholder }) => (
    <Input
        type="text"
        value={formatRupiah(field.value)}
        placeholder={placeholder}
        className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
            fieldState.error ? "border-rose-500" : ""
        }`}
        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
    />
);

const OPTION_APIS = {
    stockType: "/api/options/stock-type",
    entrySession: "/api/options/entry-session",
    entryOccasion: "/api/options/entry-occasion",
    buyReason: "/api/options/buy-reason",
    sellReason: "/api/options/sell-reason",
};

export default function AddNewTrade({ onAdded }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState({
        stockType: false,
        entrySession: false,
        entryOccasion: false,
        buyReason: false,
        sellReason: false,
    });

    const [options, setOptions] = useState({
        stockType: [],
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
            stock_type_option: "",
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
    const fetchOptionType = useCallback(async (type) => {
        try {
            setOptionsLoading((prev) => ({ ...prev, [type]: true }));

            const response = await fetch(OPTION_APIS[type]);
            const data = await response.json();

            if (data.success) {
                setOptions((prev) => ({
                    ...prev,
                    [type]: data.option,
                }));
            }
        } catch (error) {
            toast.error(`Failed to load ${type} options`);
        } finally {
            setOptionsLoading((prev) => ({ ...prev, [type]: false }));
        }
    }, []);

    // Fetch semua options saat dialog open
    const fetchAllOptions = useCallback(async () => {
        const optionTypes = Object.keys(OPTION_APIS);
        await Promise.all(optionTypes.map(fetchOptionType));
    }, [fetchOptionType]);

    useEffect(() => {
        if (open) {
            fetchAllOptions();
        }
    }, [open, fetchAllOptions]);

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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    id="addNewTradeBtn"
                    className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium"
                >
                    Add New Trade
                </Button>
            </DialogTrigger>
            <DialogContent
                id="addNewTradeDialogForm"
                className="sm:max-w-2xl max-h-[90svh] overflow-y-auto space-y-5"
            >
                <DialogHeader className="text-left font-medium">
                    <DialogTitle>Add New Trade</DialogTitle>
                    <DialogDescription className="font-normal text-gray-foreground">
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
                                    <FormLabel className="font-medium">
                                        Trade Date
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-medium",
                                                    fieldState.error &&
                                                        "border-rose-500 text-trade-loss-foreground",
                                                    !field.value &&
                                                        "text-slate-500"
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
                            id="ticker"
                            name="ticker"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Ticker
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. AAPL"
                                            className={`uppercase text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                fieldState.error
                                                    ? "border-rose-500"
                                                    : ""
                                            }`}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        id="tickerMessage"
                                        className="font-medium"
                                    >
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Margin */}
                        <FormField
                            control={control}
                            id="margin"
                            name="margin"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Margin
                                    </FormLabel>
                                    <FormControl>
                                        <CurrencyInputField
                                            field={field}
                                            fieldState={fieldState}
                                            placeholder="e.g. 1000"
                                        />
                                    </FormControl>
                                    <FormMessage
                                        id="marginMessage"
                                        className="font-medium"
                                    >
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Proceeds */}
                        <FormField
                            control={control}
                            id="proceeds"
                            name="proceeds"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Proceeds
                                    </FormLabel>
                                    <FormControl>
                                        <CurrencyInputField
                                            field={field}
                                            fieldState={fieldState}
                                            placeholder="e.g. 2000"
                                        />
                                    </FormControl>
                                    <FormMessage
                                        id="proceedsMessage"
                                        className="font-medium"
                                    >
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
                                    <FormLabel className="font-medium">
                                        Realized Gain
                                    </FormLabel>
                                    <FormDescription className="font-medium">
                                        Calculated automatically from Margin &
                                        Proceeds
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            value={formatRupiah(field.value)}
                                            disabled
                                            className="font-medium"
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
                                    <FormLabel className="font-medium">
                                        Return %
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            value={field.value}
                                            disabled
                                            className="font-medium"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Dropdown Options */}
                        {[
                            {
                                name: "stock_type_option",
                                label: "Stock Type",
                                options: options.stockType,
                                loading: optionsLoading.stockType,
                                optionKey: "stock_type_option",
                                id_message: "stockTypeOptionMessage",
                            },
                            {
                                name: "entry_session_option",
                                label: "Entry Session",
                                options: options.entrySession,
                                loading: optionsLoading.entrySession,
                                optionKey: "entry_session_options",
                                id_message: "entrySessionOptionMessage",
                            },
                            {
                                name: "entry_occasion_option",
                                label: "Entry Occasion",
                                options: options.entryOccasion,
                                loading: optionsLoading.entryOccasion,
                                optionKey: "entry_occasion_option",
                                id_message: "entryOccasionOptionMessage",
                            },
                            {
                                name: "buy_reason_option",
                                label: "Buy Reason",
                                options: options.buyReason,
                                loading: optionsLoading.buyReason,
                                optionKey: "buy_reason_options",
                                id_message: "buyReasonOptionMessage",
                            },
                            {
                                name: "sell_reason_option",
                                label: "Sell Reason",
                                options: options.sellReason,
                                loading: optionsLoading.sellReason,
                                optionKey: "sell_reason_options",
                                id_message: "sellReasonOptionMessage",
                            },
                        ].map(
                            ({
                                name,
                                label,
                                options: optData,
                                loading,
                                optionKey,
                                id_message,
                            }) => (
                                <FormField
                                    key={name}
                                    control={control}
                                    name={name}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                {label}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="min-w-full font-medium">
                                                        <SelectValue
                                                            placeholder={
                                                                loading
                                                                    ? "Loading..."
                                                                    : `Select ${label}`
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent className="w-auto max-w-[90vw] min-w-[200px]">
                                                        {loading ? (
                                                            <div className="p-8 text-center text-muted-foreground">
                                                                Loading
                                                                options...
                                                            </div>
                                                        ) : optData.length ===
                                                          0 ? (
                                                            <SelectItem
                                                                value=""
                                                                disabled
                                                            >
                                                                No options
                                                                available
                                                            </SelectItem>
                                                        ) : (
                                                            optData.map(
                                                                (opt) => (
                                                                    <SelectItem
                                                                        key={
                                                                            opt.id
                                                                        }
                                                                        value={
                                                                            opt[
                                                                                optionKey
                                                                            ]
                                                                        }
                                                                        className="whitespace-normal break-words font-medium"
                                                                    >
                                                                        {
                                                                            opt[
                                                                                optionKey
                                                                            ]
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage id={id_message}>
                                                {fieldState.error?.message}
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                            )
                        )}
                        {/* Notes */}
                        <FormField
                            control={control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Notes
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Additional notes"
                                            className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    id="cancelNewTradeBtn"
                                    type="button"
                                    className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                id="submitNewTradeBtn"
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary-hover dark:text-white font-medium"
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
