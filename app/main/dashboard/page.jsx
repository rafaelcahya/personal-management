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
import Navbar from "../../../components/ui/common/Navbar";
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
        <div className="min-h-svh flex flex-col gap-5 w-full mx-auto px-6 py-6 xl:py-20 max-w-full sm:max-w-xl md:max-w-5xl xl:max-w-7xl">
            <Breadcrumbs />
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-sm font-semibold text-slate-500 dark:text-gray-400">
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
        </div>
    );
}
