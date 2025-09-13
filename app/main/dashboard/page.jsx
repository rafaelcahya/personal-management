"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TradeList from "./TradeList";
import FeeList from "./FeeList";
import EventList from "./EventList";
import OverallPerformance from "./OverallPerformance";
import Settings from "../settings/Settings";
import Logout from "../auth/logout/Logout";
import Breadcrumbs from "../../../components/ui/common/Breadcrumbs"

export default function Page() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            if (!res.ok) {
                router.replace("/auth/login");
                return;
            }
            const data = await res.json();
            setUser(data.user);
        }
        fetchUser();
    }, [router]);

    return (
        <div className="min-h-svh flex flex-col gap-5 w-full mx-auto px-6 py-6 xl:py-20 max-w-full sm:max-w-xl md:max-w-5xl xl:max-w-7xl">
            <Breadcrumbs/>
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
                <div className="flex items-center gap-5">
                    <div className="hidden lg:flex items-center space-x-2">
                        <Settings />
                    </div>
                    <Logout />
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
