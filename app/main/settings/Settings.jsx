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
    DialogTrigger,
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
} from "@/components/ui/form";
import { toast } from "sonner";

export default function Settings() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm({
        defaultValues: {
            initial_margin: "",
            bi_risk_free_rate: "",
            personal_risk_free_rate: "",
        },
    });
    const { control, handleSubmit, reset } = form;

    // Fetch existing settings
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("/api/settings/list");
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
                    });
                }
            } catch (err) {
                toast.error(err);
            }
        }
        fetchSettings();
    }, [reset]);

    // Submit
    const handleSetSettings = async (values) => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (!res.ok) toast.error(data.error || "Failed");
            else {
                toast.success("Changes applied successfully!");
                setOpen(false);
            }
        } catch (err) {
            toast.error("Something went wrong");
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-transparent hover:bg-white text-violet-600">
                    Settings
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Performance configurations</DialogTitle>
                    <DialogDescription>
                        Configure Initial Margin and Risk-Free Rate to keep your
                        trading metrics accurate.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleSetSettings)}
                        className="space-y-6"
                    >
                        {/* Initial Margin */}
                        <FormField
                            control={control}
                            name="initial_margin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Initial Margin</FormLabel>
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
                                            className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* BI Risk Free Rate */}
                        <FormField
                            control={control}
                            name="bi_risk_free_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BI Risk Free Rate</FormLabel>
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
                                            className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Personal Risk Free Rate */}
                        <FormField
                            control={control}
                            name="personal_risk_free_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
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
                                            className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="text-violet-600 bg-white hover:bg-violet-50"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-violet-600 hover:bg-violet-700"
                            >
                                {loading ? "Submitting..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
