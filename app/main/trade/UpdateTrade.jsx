"use client";

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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import safeDate from "@/lib/utils/safeDate";
import TradeDelete from "./DeleteTrade";

import { tradeSchema } from "@/schemas/trade";
import { fetchTradeOptions } from "@/lib/api/options";
import { updateTrade } from "@/lib/api/trade";

export default function TradeUpdate({ trade, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({
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

    useEffect(() => {
        if (trade) {
            reset({
                trade_date: safeDate(trade.trade_date),
                ticker: trade.ticker ?? "",
                margin: trade.margin?.toString() ?? "",
                proceeds: trade.proceeds?.toString() ?? "",
                return_percent: trade.return_percent ?? "",
                realized_gain: trade.realized_gain?.toString() ?? "",
                entry_session_option: trade.entry_session_option ?? "",
                entry_occasion_option: trade.entry_occasion_option ?? "",
                buy_reason_option: trade.buy_reason_option ?? "",
                sell_reason_option: trade.sell_reason_option ?? "",
                notes: trade.notes ?? "",
            });
        }
    }, [trade, reset]);

    const margin = watch("margin");
    const proceeds = watch("proceeds");
    const realized_gain = watch("realized_gain");

    // auto calculate realized gain
    useEffect(() => {
        const marginNum = parseFloat(margin);
        const proceedsNum = parseFloat(proceeds);
        if (!isNaN(marginNum) && !isNaN(proceedsNum)) {
            setValue("realized_gain", (proceedsNum - marginNum).toFixed(2));
        } else {
            setValue("realized_gain", "");
        }
    }, [margin, proceeds, setValue]);

    // auto calculate return %
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

    // fetch dropdown options
    useEffect(() => {
        (async () => {
            const data = await fetchTradeOptions();
            setOptions(data);
        })();
    }, []);

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
            toast.error(err);
            toast.error(err.message || "Something went wrong");
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
                    <DialogDescription className="font-semibold text-slate-500">
                        Edit your trade details to keep performance insights
                        accurate.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleUpdate)}
                        className="space-y-6"
                    >
                        <FormField
                            control={control}
                            name="trade_date"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="font-semibold">
                                        Trade Date
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-semibold",
                                                    fieldState.error &&
                                                        "border-rose-500 text-rose-500",
                                                    !field.value &&
                                                        "text-slate-500"
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
                                    <FormLabel className="font-semibold">
                                        Ticker
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. AAPL"
                                            className={`uppercase text-sm font-semibold focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                fieldState.error
                                                    ? "border-rose-500"
                                                    : ""
                                            }`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Margin */}
                        <FormField
                            control={control}
                            name="margin"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Margin
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            value={
                                                field.value
                                                    ? `Rp. ${Number(
                                                          field.value
                                                      ).toLocaleString(
                                                          "id-ID"
                                                      )}`
                                                    : ""
                                            }
                                            placeholder="e.g. 1000"
                                            className={`text-sm font-semibold focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                fieldState.error
                                                    ? "border-rose-500"
                                                    : ""
                                            }`}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Proceeds */}
                        <FormField
                            control={control}
                            name="proceeds"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Proceeds
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            value={
                                                field.value
                                                    ? `Rp. ${Number(
                                                          field.value
                                                      ).toLocaleString(
                                                          "id-ID"
                                                      )}`
                                                    : ""
                                            }
                                            placeholder="e.g. 1000"
                                            className={`text-sm font-semibold focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                fieldState.error
                                                    ? "border-rose-500"
                                                    : ""
                                            }`}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Realized Gain */}
                        <FormField
                            control={control}
                            name="realized_gain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Realized Gain
                                    </FormLabel>
                                    <FormDescription className="font-medium text-slate-500">
                                        This value is calculated automatically
                                        based on Margin and Proceeds.
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            className="font-semibold text-slate-900"
                                            value={
                                                field.value
                                                    ? `Rp. ${Number(
                                                          field.value
                                                      ).toLocaleString(
                                                          "id-ID"
                                                      )}`
                                                    : ""
                                            }
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Return % */}
                        <FormField
                            control={control}
                            name="return_percent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Return %
                                    </FormLabel>
                                    <FormDescription className="font-medium text-slate-500">
                                        This value is calculated automatically
                                        based on Margin and Realized Gain.
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            value={field.value}
                                            disabled
                                            className="font-semibold text-slate-900"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Entry Session Option */}
                        <FormField
                            control={control}
                            name="entry_session_option"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Entry Session Option
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="min-w-full font-semibold">
                                                <SelectValue placeholder="Select entry session" />
                                            </SelectTrigger>
                                            <SelectContent className="font-semibold">
                                                {options.entrySession.map(
                                                    (opt) => (
                                                        <SelectItem
                                                            key={opt.id}
                                                            value={
                                                                opt.entry_session_options
                                                            }
                                                        >
                                                            {
                                                                opt.entry_session_options
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Entry Occasion Option */}
                        <FormField
                            control={control}
                            name="entry_occasion_option"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Entry Occasion Option
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="min-w-full font-semibold">
                                                <SelectValue placeholder="Select entry occasion" />
                                            </SelectTrigger>
                                            <SelectContent className="font-semibold">
                                                {options.entryOccasion.map(
                                                    (opt) => (
                                                        <SelectItem
                                                            key={opt.id}
                                                            value={
                                                                opt.entry_occasion_option
                                                            }
                                                        >
                                                            {
                                                                opt.entry_occasion_option
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Buy Reason */}
                        <FormField
                            control={control}
                            name="buy_reason_option"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Buy Reason
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="min-w-full whitespace-normal text-left font-semibold">
                                                <SelectValue placeholder="Select buy reason" />
                                            </SelectTrigger>
                                            <SelectContent className="font-semibold">
                                                {options.buyReason.map(
                                                    (opt) => (
                                                        <SelectItem
                                                            key={opt.id}
                                                            value={
                                                                opt.buy_reason_options
                                                            }
                                                        >
                                                            {
                                                                opt.buy_reason_options
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Sell Reason */}
                        <FormField
                            control={control}
                            name="sell_reason_option"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Sell Reason
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="min-w-full whitespace-normal text-left font-semibold">
                                                <SelectValue placeholder="Select sell reason" />
                                            </SelectTrigger>
                                            <SelectContent className="font-semibold">
                                                {options.sellReason.map(
                                                    (opt) => (
                                                        <SelectItem
                                                            key={opt.id}
                                                            value={
                                                                opt.sell_reason_options
                                                            }
                                                        >
                                                            {
                                                                opt.sell_reason_options
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Notes */}
                        <FormField
                            control={control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">
                                        Notes
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Additional notes"
                                            className="text-sm font-semibold focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
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
                                            className="text-violet-600 font-semibold bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="font-semibold bg-violet-600 hover:bg-violet-700 dark:text-white"
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
