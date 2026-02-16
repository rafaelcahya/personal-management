"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function DynamicSelectField({
    control,
    name,
    label,
    options = [],
    loading = false,
    displayField,
    placeholder = "Select an option",
}) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="w-full">
                    <FormLabel className="font-medium">{label}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={loading}
                    >
                        <FormControl>
                            <SelectTrigger
                                className={`w-full text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                    fieldState.error ? "border-rose-500" : ""
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        <span className="text-slate-500">
                                            Loading...
                                        </span>
                                    </div>
                                ) : (
                                    <SelectValue placeholder={placeholder} />
                                )}
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                            {!loading && options.length === 0 ? (
                                <div className="p-4 text-sm text-slate-500 text-center">
                                    No options available
                                </div>
                            ) : (
                                options.map((option) => (
                                    <SelectItem
                                        key={option.id}
                                        id={`${name}-option-${option.id}`}
                                        value={option[displayField]}
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        {option[displayField]}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    <FormMessage id={`${name}-errorMessage`} className="font-medium">
                        {fieldState.error?.message}
                    </FormMessage>
                </FormItem>
            )}
        />
    );
}
