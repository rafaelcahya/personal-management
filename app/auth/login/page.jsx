"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/login";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!username || !password) {
            toast.error("Username and password cannot be empty");
            setLoading(false);
            return;
        }

        try {
            const data = await login(username, password);

            localStorage.setItem("tradform-user", JSON.stringify(data.user));

            toast.success("Login successful!");
            router.replace("/main/landing");
        } catch (err) {
            toast.error("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                {/* Layer 1: Gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-blue-50/50 to-orange-100/50"></div>

                {/* Layer 2: Frosted glass noise */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent backdrop-blur-lg"></div>
            </div>
            <Card className="max-w-sm shadow-gray-500/10 shadow-2xl bg-white border-none rounded-[24px] z-10">
                <CardHeader>
                    <CardTitle className="text-2xl text-black font-bold">
                        Welcome 👋
                    </CardTitle>
                    <CardDescription className="font-medium">
                        Log in to access your trading performance dashboard
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 font-medium">
                        <div className="space-y-2">
                            <Label
                                htmlFor="username"
                                className="font-semibold text-black"
                            >
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="!bg-background focus-visible:ring-violet-100 focus-visible:border-white selection:bg-violet-500 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="font-semibold text-black"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="!bg-background focus-visible:ring-violet-100 focus-visible:border-white selection:bg-violet-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            id="loginBtn"
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Spinner /> Logging in...
                                </span>
                            ) : (
                                "Log In"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
