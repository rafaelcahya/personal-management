"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import Profile from "./Profile";
import PerformConfig from "./PerformConfig";
import ThemeToggle from "./ThemeToggle";
import Logout from "../auth/logout/Logout";
import { Palette, Settings2, User } from "lucide-react";
import { getUser } from "@/lib/api/user";

export default function Settings() {
    const [open, setOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState("profile");
    const [isMobile, setIsMobile] = useState(false);
    const [userId, setUserId] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [nickname, setNickname] = useState("User");

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (typeof document !== "undefined") {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("authToken="))
                ?.split("=")[1];

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserId(decoded.sub);
                } catch (err) {
                    console.error("JWT decode error:", err);
                }
            }
        }
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUser();
                if (data?.user?.avatar) setAvatarPreview(data.user.avatar);
                if (data?.user?.nickname) setNickname(data.user.nickname);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    const renderContent = () => {
        switch (selectedMenu) {
            case "profile":
                return <Profile userId={userId} />;
            case "configuration":
                return <PerformConfig />;
            case "theme":
                return <ThemeToggle />;
            case "logout":
                return <Logout />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 pl-4 pr-1 py-1 hover:bg-violet-100 dark:hover:bg-violet-500/5 rounded-full">
                    <span className="hidden sm:block font-semibold text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {nickname ?? "User"}
                    </span>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="flex items-center justify-center w-full h-full bg-gray-300 text-white font-bold">
                                U
                            </span>
                        )}
                    </div>
                </button>
            </DialogTrigger>

            <DialogContent className="flex sm:max-w-xl h-[600px] overflow-y-auto p-0 gap-0">
                {isMobile ? (
                    // Mobile: Dropdown menu
                    <div className="flex flex-col w-full">
                        <div className="p-4 space-y-4">
                            <DialogTitle className="font-semibold">
                                Settings
                            </DialogTitle>
                            <Select
                                value={selectedMenu}
                                onValueChange={(val) => setSelectedMenu(val)}
                            >
                                <SelectTrigger className="w-full font-semibold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="profile"
                                        className="font-semibold"
                                    >
                                        <User className="inline mr-2 w-4 h-4" />
                                        Profile
                                    </SelectItem>
                                    <SelectItem
                                        value="configuration"
                                        className="font-semibold"
                                    >
                                        <Settings2 className="inline mr-2 w-4 h-4" />
                                        Configuration
                                    </SelectItem>
                                    <SelectItem
                                        value="theme"
                                        className="font-semibold"
                                    >
                                        <Palette className="inline mr-2 w-4 h-4" />
                                        Theme
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="flex-1 overflow-y-auto p-0 sm:px-4">
                            {renderContent()}
                        </div>
                        <div className="border-t p-0 sm:p-4">
                            <Logout />
                        </div>
                    </div>
                ) : (
                    // Desktop: Sidebar layout
                    <>
                        <div className="w-48 border-r flex flex-col justify-between">
                            <div className="flex flex-col">
                                <DialogTitle className="font-semibold p-4">
                                    Settings
                                </DialogTitle>
                                <Separator />
                                <nav className="flex flex-col p-2 space-y-1">
                                    <Button
                                        variant={
                                            selectedMenu === "profile"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className={`justify-start hover:bg-violet-50 font-semibold ${
                                            selectedMenu === "profile"
                                                ? "bg-violet-100 hover:bg-violet-200 dark:bg-violet-500"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedMenu("profile")
                                        }
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Profile
                                    </Button>
                                    <Button
                                        variant={
                                            selectedMenu === "configuration"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className={`justify-start hover:bg-violet-50 font-semibold ${
                                            selectedMenu === "configuration"
                                                ? "bg-violet-100 hover:bg-violet-200 dark:bg-violet-500"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedMenu("configuration")
                                        }
                                    >
                                        <Settings2 className="w-4 h-4 mr-2" />
                                        Configuration
                                    </Button>
                                    <Button
                                        variant={
                                            selectedMenu === "theme"
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className={`justify-start hover:bg-violet-50 font-semibold ${
                                            selectedMenu === "theme"
                                                ? "bg-violet-100 hover:bg-violet-200 dark:bg-violet-500"
                                                : ""
                                        }`}
                                        onClick={() => setSelectedMenu("theme")}
                                    >
                                        <Palette className="w-4 h-4 mr-2" />
                                        Theme
                                    </Button>
                                </nav>
                            </div>
                            <Logout />
                        </div>
                        <div className="flex-1 overflow-y-auto w-[450px]">
                            {renderContent()}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
