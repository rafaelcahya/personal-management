"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import TradeNavigation from "./TradeNavigation";
import SettingsDialog from "./settings/SettingsDialog";
import TradingFooter from "../trading/TradingFooter"

export default function TradingManagementLayout({ children }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSettingsUpdated = () => {
        // Refresh page or trigger re-fetch in child components
        window.location.reload();
    };

    return (
        <div className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-10 max-w-full md:max-w-5xl xl:max-w-7xl">
            {/* Background */}
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50" />
            </div>

            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">
                            Trading Management
                        </h1>
                        <p className="text-sm text-slate-600">
                            Track your trades, analyze performance, and manage
                            your trading journey
                        </p>
                    </div>

                    {/* Settings Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSettingsOpen(true)}
                        className="gap-2 shrink-0"
                        id="openSettingsBtn"
                    >
                        <Settings className="size-4" />
                        <span className="hidden sm:inline">Settings</span>
                    </Button>
                </div>

                <TradeNavigation />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">{children}</div>

            {/* Settings Dialog */}
            <SettingsDialog
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                onUpdated={handleSettingsUpdated}
            />

            <TradingFooter />
        </div>
    );
}
