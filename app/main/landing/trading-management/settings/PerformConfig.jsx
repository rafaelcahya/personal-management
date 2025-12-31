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
} from "@/components/ui/form";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function PerformConfig() {
    const [loading, setLoading] = useState(false);
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
                }
            } catch (err) {
                toast.error(err.message || "Failed to load settings");
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
            if (!res.ok) toast.error(data.error || "Failed");
            else {
                toast.success("Changes applied successfully!");
            }
        } catch (err) {
            toast.error("Something went wrong");
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-lg">
            <div className="px-5 py-4">
                <p className="font-medium">Performance Configurations</p>
                <p className="text-sm font-medium text-gray-foreground">
                    Configure Initial Margin and Risk-Free Rate to keep your
                    trading metrics accurate.
                </p>
            </div>
            <Separator />

            <Form {...form}>
                <form
                    onSubmit={handleSubmit(handleSetSettings)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="flex-1 px-5 py-4 space-y-6 overflow-y-auto">
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
                                            {...field}
                                            value={
                                                field.value
                                                    ? `Rp. ${Number(
                                                          field.value
                                                      ).toLocaleString(
                                                          "id-ID"
                                                      )}`
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const raw =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                field.onChange(raw);
                                            }}
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="bi_risk_free_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        BI Risk Free Rate
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.replace(
                                                        /[^0-9.,]/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

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
                                            {...field}
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.replace(
                                                        /[^0-9.,]/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="margin_of_error"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Margin of Error (%)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.replace(
                                                        /[^0-9.,]/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-2 border-t px-5 py-3 bg-background">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary-hoverfont-medium"
                        >
                            {loading ? "Submitting..." : "Save changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
