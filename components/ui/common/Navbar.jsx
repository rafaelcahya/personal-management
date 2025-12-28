"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getUser } from "@/lib/api/user";
import Settings from "@/app/main/settings/Settings";

const navItems = [
    { name: "Dashboard", href: "/main/dashboard" },
    { name: "Trades", href: "/main/trade" },
    { name: "Fees", href: "/main/fee" },
    { name: "Events", href: "/main/event" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [nickname, setNickname] = useState("User");

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
        <nav className="fixed top-0 w-full bg-black text-white px-6 py-3 flex items-center justify-between -z-10">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <p>Hi! {nickname ?? "User"}</p>
            </div>

            {/* Middle: Navigation */}
            <div className="hidden md:flex items-center gap-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`px-4 py-1 rounded-full font-medium transition-colors ${
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Right: Avatar */}
            <div className="hidden lg:flex items-center space-x-2">
                <Settings />
            </div>
        </nav>
    );
}
