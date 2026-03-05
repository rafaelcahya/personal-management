"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Info, Loader2 } from "lucide-react";

export default function PerformConfig({ onClose }) {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const form = useForm({
        defaultValues: {
            initial_margin: "",
            bi_risk_free_rate: "",
            personal_risk_free_rate: "",
            margin_of_error: "",
        },
    });
    const { control, handleSubmit, reset } = form;

    useEffect(() => {
        async function fetchSettings() {
            try {
                setFetchLoading(true);
                const res = await fetch("/api/trade/settings/list");
                const data = await res.json();

                if (res.ok && data?.settingsList) {
                    reset({
                        initial_margin:
                            data.settingsList.initial_margin?.toString() || "",
                        bi_risk_free_rate:
                            data.settingsList.bi_risk_free_rate?.toString() ||
                            "",
                        personal_risk_free_rate:
                            data.settingsList.personal_risk_free_rate?.toString() ||
                            "",
                        margin_of_error:
                            data.settingsList.margin_of_error?.toString() || "",
                    });
                } else if (!res.ok) {
                    toast.error(data.error || "Failed to load settings");
                }
            } catch (err) {
                console.error(err.message || "Failed to load settings");
                toast.error("Failed to load settings");
            } finally {
                setFetchLoading(false);
            }
        }
        fetchSettings();
    }, [reset]);

    const handleSetSettings = async (values) => {
        setLoading(true);
        try {
            const res = await fetch("/api/trade/settings/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to update settings");
            } else {
                toast.success("Settings updated successfully!");
                onClose?.()
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader2 className="size-8 animate-spin text-violet-600" />
                <p className="text-sm text-slate-600">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-5 py-4">
                <p className="font-semibold text-base">
                    Performance Configuration
                </p>
                <p className="text-sm text-slate-600 mt-1">
                    Configure trading metrics parameters for accurate
                    performance analysis
                </p>
            </div>
            <Separator />

            <Form {...form}>
                <form
                    onSubmit={handleSubmit(handleSetSettings)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="flex-1 px-5 py-4 space-y-5 overflow-y-auto max-h-[60vh]">
                        {/* Initial Margin */}
                        <FormField
                            control={control}
                            name="initial_margin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Initial Margin
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Rp 10.000.000"
                                            {...field}
                                            value={
                                                field.value
                                                    ? `Rp ${Number(field.value).toLocaleString("id-ID")}`
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const raw =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    );
                                                field.onChange(raw);
                                            }}
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Starting capital for your trading
                                        account
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        {/* BI Risk Free Rate */}
                        <FormField
                            control={control}
                            name="bi_risk_free_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium flex items-center gap-1.5">
                                        BI Risk Free Rate
                                        <Info className="size-3.5 text-slate-400" />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="6.5"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const cleaned =
                                                    e.target.value.replace(
                                                        /[^0-9.,]/g,
                                                        "",
                                                    );
                                                field.onChange(cleaned);
                                            }}
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Bank Indonesia reference rate (in %)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        {/* Personal Risk Free Rate */}
                        <FormField
                            control={control}
                            name="personal_risk_free_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Personal Risk Free Rate
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="8.0"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const cleaned =
                                                    e.target.value.replace(
                                                        /[^0-9.,]/g,
                                                        "",
                                                    );
                                                field.onChange(cleaned);
                                            }}
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Your personal target return rate (in %)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        {/* Margin of Error */}
                        <FormField
                            control={control}
                            name="margin_of_error"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Margin of Error
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="10"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => {
                                                const cleaned =
                                                    e.target.value.replace(
                                                        /[^0-9.,]/g,
                                                        "",
                                                    );
                                                field.onChange(cleaned);
                                            }}
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Safety buffer for risk calculations (in
                                        %)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 border-t px-5 py-3 bg-slate-50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-violet-600 hover:bg-violet-700"
                        >
                            {loading && (
                                <Loader2 className="size-4 mr-2 animate-spin" />
                            )}
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
