import TradeList from "./TradeList";
import FeeList from "./FeeList";
import EventList from "./EventList";
import OverallPerformance from "./OverallPerformance";
import Settings from "../settings/Settings";

export default function Page() {
    return (
        <div className="min-h-svh flex flex-col gap-5 w-full mx-auto px-6 py-6 xl:py-20 max-w-full sm:max-w-xl md:max-w-5xl xl:max-w-7xl">
            <div className="flex flex-wrap justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold">
                        Trading Performance Dashboard
                    </h1>
                    <p className="text-gray-500 text-[15px] w-full lg:w-3/4">
                        Keep track of commissions and fees — the little things
                        that add up.
                    </p>
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                    <Settings />
                </div>
            </div>
            <div className="space-y-5">
                <OverallPerformance />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TradeList />
                    <FeeList />
                </div>
                <EventList />
            </div>
        </div>
    );
}
