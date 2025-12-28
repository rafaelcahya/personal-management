"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [value, setValue] = useState("system");

    useEffect(() => {
        if (theme === "system") {
            setValue("system");
        } else {
            setValue(theme);
        }
    }, [theme]);

    return (
        <div className="flex flex-col h-full w-full max-w-lg">
            {/* Header */}
            <div className="px-5 py-4">
                <p className="font-semibold">Theme</p>
                <p className="text-sm font-medium text-gray-foreground">
                    Choose how the interface looks. Select light, dark, or
                    system default.
                </p>
            </div>
            <Separator />

            {/* Radio group */}
            <div className="flex-1 px-5 py-4 space-y-4">
                <RadioGroup
                    value={value}
                    onValueChange={(val) => {
                        setValue(val);
                        setTheme(val);
                    }}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="font-semibold">
                            Light
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="font-semibold">
                            Dark
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="font-semibold">
                            System{" "}
                            <span className="text-xs font-semibold text-slate-500">
                                ({systemTheme})
                            </span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
