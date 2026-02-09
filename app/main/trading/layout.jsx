import TradeNavigation from "./TradeNavigation";

export default function TradingManagementLayout({ children }) {
    return (
        <div className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-10 max-w-full md:max-w-5xl xl:max-w-7xl">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                <div className="absolute inset-0 bg-slate-50"></div>
            </div>

            <TradeNavigation />

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
