"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/services/user/getUser";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const [nickname, setNickname] = useState("User");

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = localStorage.getItem("tradform-user");
                if (!userData) return;
                const { id: userId } = JSON.parse(userData);

                const user = await getUserById(userId);
                setNickname(user.nickname ?? user.username);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        }
        fetchUser();
    }, []);

    let pathParts = pathname
        .split("/")
        .filter(Boolean)
        .filter((part) => part !== "main");

    if (pathParts[0] !== "dashboard") {
        pathParts = ["dashboard", ...pathParts];
    }

    const crumbs = pathParts.map((part, idx) => {
        const href = "/" + ["main", ...pathParts.slice(0, idx + 1)].join("/");
        const isLast = idx === pathParts.length - 1;
        return {
            label: part.charAt(0).toUpperCase() + part.slice(1),
            href,
            isLast,
        };
    });

    const finalCrumbs = [
        { label: nickname, href: "#", isUsername: true },
        ...crumbs,
    ];

    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {finalCrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                    {crumb.isUsername || crumb.isLast ? (
                        <span
                            className={cn(
                                crumb.isLast &&
                                    "font-medium text-gray-700 dark:text-gray-400"
                            )}
                        >
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            href={crumb.href}
                            className="hover:text-violet-600 transition-colors"
                        >
                            {crumb.label}
                        </Link>
                    )}
                    {idx < finalCrumbs.length - 1 && (
                        <ChevronRight className="w-4" />
                    )}
                </div>
            ))}
        </nav>
    );
}
