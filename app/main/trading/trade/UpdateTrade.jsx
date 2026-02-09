"use client";

import { useState, useEffect, useCallback } from "react";
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
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { tradeSchema } from "@/schemas/trade";
import { updateTrade, fetchTradeOptions } from "@/lib/api/trade";
import { formatRupiah } from "@/lib/utils/currencyFormatter";
import CurrencyField from "@/components/ui/common/CurrencyField";
import DynamicSelectField from "@/components/ui/common/DynamicSelectField";
import DeleteTrade from "./DeleteTrade";

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

export default function UpdateTrade({ trade, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
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

    const { watch, setValue, control, reset } = form;

    // Auto-calculate realized gain & return%
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
                    ((gain / marginNum) * 100).toFixed(2) + "%",
                );
            }
        }
    }, [margin, proceeds, setValue]);

    // Fetch dropdown options
    const fetchOptionType = useCallback(async (type) => {
        try {
            setOptionsLoading((prev) => ({ ...prev, [type]: true }));
            const data = await fetchTradeOptions(type); // ✅ Uses improved function
            setOptions((prev) => ({ ...prev, [type]: data || [] }));
        } catch (error) {
            console.error(`Failed to load ${type}:`, error);
            toast.error(`Failed to load ${type} options`);
            setOptions((prev) => ({ ...prev, [type]: [] }));
        } finally {
            setOptionsLoading((prev) => ({ ...prev, [type]: false }));
        }
    }, []);

    // Reset form when trade changes
    useEffect(() => {
        if (trade) {
            reset({
                trade_date: new Date(trade.trade_date),
                ticker: trade.ticker,
                margin: trade.margin?.toString() || "",
                proceeds: trade.proceeds?.toString() || "",
                return_percent: trade.return_percent || "",
                realized_gain: trade.realized_gain?.toString() || "",
                stock_type_option: trade.stock_type_option || "",
                entry_session_option: trade.entry_session_option || "",
                entry_occasion_option: trade.entry_occasion_option || "",
                buy_reason_option: trade.buy_reason_option || "",
                sell_reason_option: trade.sell_reason_option || "",
                notes: trade.notes || "",
            });
            setServerError(null);

            // Fetch all options
            const optionTypes = [
                "stockType",
                "entrySession",
                "entryOccasion",
                "buyReason",
                "sellReason",
            ];
            optionTypes.forEach(fetchOptionType);
        }
    }, [trade, reset, fetchOptionType]);

    const onSubmit = async (values) => {
        setLoading(true);
        setServerError(null);

        try {
            const payload = {
                ...values,
                trade_date: values.trade_date.toISOString().split("T")[0],
            };

            await updateTrade(trade.id, payload);

            toast.success("Trade updated successfully! ✅");
            onUpdated?.();
        } catch (err) {
            console.error("Update error:", err);
            setServerError(err.message || "Failed to update trade");
        } finally {
            setLoading(false);
        }
    };

    if (!trade) return null;

    return (
        <Dialog open={!!trade} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh]">
                <DialogHeader className="text-left shrink-0">
                    <DialogTitle>✏️ Update Trade</DialogTitle>
                    <DialogDescription>
                        Adjust your trade details to keep your journal accurate
                        and insightful
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                                        <FormMessage />
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
                                                placeholder="e.g., BBCA, GOTO"
                                                className={`uppercase text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                    fieldState.error
                                                        ? "border-rose-500"
                                                        : ""
                                                }`}
                                            />
                                        </FormControl>
                                        <FormMessage className="font-medium">
                                            {fieldState.error?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Margin & Proceeds Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CurrencyField
                                    control={control}
                                    name="margin"
                                    label="Margin (Capital)"
                                    placeholder="e.g., 1000000"
                                />

                                <CurrencyField
                                    control={control}
                                    name="proceeds"
                                    label="Proceeds (Return)"
                                    placeholder="e.g., 1200000"
                                />
                            </div>

                            {/* Auto-calculated fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name="realized_gain"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                Realized Gain/Loss
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={formatRupiah(
                                                        field.value,
                                                    )}
                                                    disabled
                                                    className="font-medium bg-slate-50"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Auto-calculated 🧮
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />

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
                                                    className="font-medium bg-slate-50"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Auto-calculated 📊
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                ),
                            )}

                            {/* Notes */}
                            <FormField
                                control={control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Notes (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Trade insights, emotions, market conditions..."
                                                className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium min-h-[80px]"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Server Error Display */}
                            {serverError && (
                                <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-red-900 mb-1">
                                                ⚠️ Unable to Update Trade
                                            </p>
                                            <p className="text-sm text-red-800">
                                                {serverError}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="shrink-0 pt-4 flex-col sm:flex-row gap-2">
                            <DeleteTrade
                                trade={trade}
                                onDeleted={onUpdated}
                                onClose={onClose}
                            />

                            <div className="flex gap-2 flex-1 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="bg-transparent hover:bg-secondary-hover text-secondary-foreground hover:text-secondary-foreground border-none"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {loading ? "Updating..." : "Update Trade"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
