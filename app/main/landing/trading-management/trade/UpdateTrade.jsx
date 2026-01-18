"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import safeDate from "@/lib/utils/safeDate";

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
import { Input } from "@/components/ui/input";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

import { tradeSchema } from "@/schemas/trade";
import { updateTrade } from "@/lib/api/trade";
import { formatRupiah } from "@/lib/utils/currencyFormatter";

import CurrencyField from "@/components/ui/common/CurrencyField";
import DynamicSelectField from "@/components/ui/common/DynamicSelectField";
import TradeDelete from "./DeleteTrade";

const OPTION_APIS = {
    stockType: "/api/trade/options/stock-type",
    entrySession: "/api/trade/options/entry-session",
    entryOccasion: "/api/trade/options/entry-occasion",
    buyReason: "/api/trade/options/buy-reason",
    sellReason: "/api/trade/options/sell-reason",
};

const SELECT_CONFIG = [
    {
        name: "stock_type_option",
        label: "Stock Type",
        apiKey: "stockType",
        displayField: "stock_type_option",
    },
    {
        name: "entry_session_option",
        label: "Entry Session",
        apiKey: "entrySession",
        displayField: "entry_session_option",
    },
    {
        name: "entry_occasion_option",
        label: "Entry Occasion",
        apiKey: "entryOccasion",
        displayField: "entry_occasion_option",
    },
    {
        name: "buy_reason_option",
        label: "Buy Reason",
        apiKey: "buyReason",
        displayField: "buy_reason_option",
    },
    {
        name: "sell_reason_option",
        label: "Sell Reason",
        apiKey: "sellReason",
        displayField: "sell_reason_option",
    },
];

export default function TradeUpdate({ trade, onClose, onUpdated }) {
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
        defaultValues: {},
    });

    const { watch, setValue, control, handleSubmit, reset } = form;

    // Fetch individual option type
    const fetchOptionType = useCallback(async (type) => {
        try {
            setOptionsLoading((prev) => ({ ...prev, [type]: true }));
            const response = await fetch(OPTION_APIS[type]);
            const data = await response.json();

            setOptions((prev) => ({
                ...prev,
                [type]: data.options || data.option || [],
            }));
        } catch (error) {
            console.error(`Failed to load ${type}:`, error);
            setOptions((prev) => ({ ...prev, [type]: [] }));
        } finally {
            setOptionsLoading((prev) => ({ ...prev, [type]: false }));
        }
    }, []);

    // Fetch all options on mount
    useEffect(() => {
        const optionTypes = Object.keys(OPTION_APIS);
        Promise.all(optionTypes.map(fetchOptionType));
    }, [fetchOptionType]);

    // Populate form when trade changes
    useEffect(() => {
        if (trade) {
            const formData = {
                trade_date: safeDate(trade.trade_date),
                ticker: trade.ticker ?? "",
                margin: trade.margin?.toString() ?? "",
                proceeds: trade.proceeds?.toString() ?? "",
                return_percent: trade.return_percent ?? "",
                realized_gain: trade.realized_gain?.toString() ?? "",
                stock_type_option: trade.stock_type_option ?? "",
                entry_session_option: trade.entry_session_option ?? "",
                entry_occasion_option: trade.entry_occasion_option ?? "",
                buy_reason_option: trade.buy_reason_option ?? "",
                sell_reason_option: trade.sell_reason_option ?? "",
                notes: trade.notes ?? "",
            };

            reset(formData);
        }
    }, [trade, reset]);

    // Auto-calculation realized gain
    const margin = watch("margin");
    const proceeds = watch("proceeds");

    useEffect(() => {
        const marginNum = parseFloat(margin);
        const proceedsNum = parseFloat(proceeds);
        if (!isNaN(marginNum) && !isNaN(proceedsNum)) {
            setValue("realized_gain", (proceedsNum - marginNum).toFixed(2));
        } else {
            setValue("realized_gain", "");
        }
    }, [margin, proceeds, setValue]);

    // Auto-calculation return %
    const realized_gain = watch("realized_gain");

    useEffect(() => {
        const marginNum = parseFloat(margin);
        const gainNum = parseFloat(realized_gain);
        if (!isNaN(marginNum) && marginNum !== 0 && !isNaN(gainNum)) {
            setValue(
                "return_percent",
                ((gainNum / marginNum) * 100).toFixed(2) + "%"
            );
        } else {
            setValue("return_percent", "");
        }
    }, [realized_gain, margin, setValue]);

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                trade_date: values.trade_date
                    ? format(values.trade_date, "yyyy-MM-dd")
                    : null,
            };

            await updateTrade(trade.id, payload);
            toast.success("Trade updated successfully!");
            onClose();
            onUpdated?.();
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!trade) return null;

    return (
        <Dialog open={!!trade} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90svh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Trade</DialogTitle>
                    <DialogDescription className="font-medium text-slate-foreground">
                        Edit your trade details to keep performance insights
                        accurate.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleUpdate)}
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
                                                        "border-rose-500",
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

                        {/* Ticker */}
                        <FormField
                            control={control}
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
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Margin */}
                        <CurrencyField
                            control={control}
                            name="margin"
                            label="Margin"
                            placeholder="1000"
                        />

                        {/* Proceeds */}
                        <CurrencyField
                            control={control}
                            name="proceeds"
                            label="Proceeds"
                            placeholder="2000"
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
                                    <FormDescription className="font-medium">
                                        Calculated automatically from Margin &
                                        Realized Gain
                                    </FormDescription>
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

                        {/* Dynamic Select Fields */}
                        {SELECT_CONFIG.map(
                            ({ name, label, apiKey, displayField }) => (
                                <DynamicSelectField
                                    key={name}
                                    control={control}
                                    name={name}
                                    label={label}
                                    options={options[apiKey]}
                                    loading={optionsLoading[apiKey]}
                                    displayField={displayField}
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
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <div className="flex justify-between w-full">
                                <TradeDelete
                                    trade={trade}
                                    onDeleted={onUpdated}
                                    onClose={onClose}
                                />
                                <div className="space-x-2">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary hover:bg-primary-hover"
                                    >
                                        {loading
                                            ? "Updating..."
                                            : "Update Trade"}
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
