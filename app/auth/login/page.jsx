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
import background from "../../assets/background.jpg";
import { login } from "@/lib/api/login";

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
            router.replace("/main/dashboard");
        } catch (err) {
            toast.error("Unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-50"
            style={{
                backgroundImage: `url(${background.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <Card className="shadow-black/5 shadow-lg border-none bg-white dark:bg-[#1a1b1e] backdrop-blur-2xl rounded-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Welcome back 👋
                    </CardTitle>
                    <CardDescription className="text-center">
                        Log in to access your trading performance dashboard
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white hover:text-white"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
