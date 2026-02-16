import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils/currencyFormatter";

export default function CurrencyField({
    control,
    idField,
    name,
    label,
    placeholder,
    message,
}) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            id={idField}
                            type="text"
                            value={formatRupiah(field.value)}
                            placeholder={placeholder}
                            className={`uppercase text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                fieldState.error ? "border-rose-500" : ""
                            }`}
                            onChange={(e) =>
                                field.onChange(
                                    e.target.value.replace(/\D/g, ""),
                                )
                            }
                        />
                    </FormControl>
                    <FormMessage id={message}>
                        {fieldState.error?.message}
                    </FormMessage>
                </FormItem>
            )}
        />
    );
}
