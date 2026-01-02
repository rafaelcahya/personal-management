import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function DynamicSelectField({
    control,
    name,
    label,
    options,
    loading,
    displayField = "name",
    message
}) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel className="font-medium">{label}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={String(field.value || "")} // ✅ Force string + handle null
                    >
                        <FormControl>
                            <SelectTrigger className="min-w-full font-medium">
                                <SelectValue
                                    placeholder={
                                        loading
                                            ? "Loading..."
                                            : `Select ${label}`
                                    }
                                />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-auto max-w-[90vw] min-w-[200px]">
                            {loading || !options?.length ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    {loading
                                        ? "Loading options..."
                                        : "No options available"}
                                </div>
                            ) : (
                                options
                                    .filter(
                                        (opt) => opt?.id && opt[displayField]
                                    )
                                    .map((opt) => {
                                        const displayText =
                                            opt[displayField] ||
                                            `ID: ${opt.id}`;
                                        return (
                                            <SelectItem
                                                key={opt.id}
                                                value={String(
                                                    opt[displayField]
                                                )} // ✅ Use displayField value
                                                className="font-medium"
                                            >
                                                {displayText}
                                            </SelectItem>
                                        );
                                    })
                            )}
                        </SelectContent>
                    </Select>
                    <FormMessage id={message}>{fieldState.error?.message}</FormMessage>
                </FormItem>
            )}
        />
    );
}
