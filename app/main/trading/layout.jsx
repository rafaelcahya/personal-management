import TradeNavigation from "./TradeNavigation";

export default function TradingManagementLayout({ children }) {
    return (
        <div className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-10 max-w-full md:max-w-5xl xl:max-w-7xl">
            {/* Background */}
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50" />
            </div>

            {/* Header Section */}
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                        Trading Management
                    </h1>
                    <p className="text-sm text-slate-600">
                        Track your trades, analyze performance, and manage your
                        trading journey
                    </p>
                </div>

                <TradeNavigation />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
