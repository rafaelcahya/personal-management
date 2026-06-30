"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const themes = {
  pill: {
    root: "h-6 w-11 border-2 border-transparent data-[state=checked]:bg-violet-600 data-[state=unchecked]:bg-input",
    thumb: "h-5 w-5 shadow-lg data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
  },
  track: {
    root: "h-[6px] w-8 overflow-visible data-[state=checked]:bg-violet-600 data-[state=unchecked]:bg-input",
    thumb: "h-4 w-4 shadow-md border border-black/10 data-[state=checked]:border-violet-300 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
  },
}

function Switch({
  className,
  theme = "pill",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  theme?: "pill" | "track"
}) {
  const t = themes[theme] ?? themes.pill
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        t.root,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-background ring-0 transition-transform",
          t.thumb
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
