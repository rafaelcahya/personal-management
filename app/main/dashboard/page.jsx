"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TradeList from "./TradeList";
import FeeList from "./FeeList";
import EventList from "./EventList";
import OverallPerformance from "./OverallPerformance";
import Settings from "../settings/Settings";
import Breadcrumbs from "../../../components/ui/common/Breadcrumbs";
import { getUser } from "@/lib/api/user";

export default function Page() {
    const [user, setUser] = useState(null);
    const [nickname, setNickname] = useState("User");
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

    useEffect(() => {
        const fetchNickname = async () => {
            try {
                const data = await getUser();
                if (data?.user?.nickname) setNickname(data.user.nickname);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNickname();
    }, []);

    return (
        <main className="min-h-svh flex flex-col gap-5 w-full mx-auto px-3 py-6 xl:py-20 max-w-full sm:max-w-xl md:max-w-5xl xl:max-w-7xl">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                {/* Layer 1: Gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-blue-50/50 to-orange-100/50"></div>

                {/* Layer 2: Frosted glass noise */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent backdrop-blur-lg"></div>
            </div>

            <Breadcrumbs />
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-sm font-semibold text-black dark:text-gray-400">
                        Hi! {nickname ?? "User"}
                    </h1>
                    <p className="font-bold text-sm sm:text-xl w-full">
                        Your trading journey at a glance.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
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
        </main>
    );
}
