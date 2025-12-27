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
            router.replace("/main/dashboard");
        } catch (err) {
            toast.error("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-200 via-blue-100 to-orange-50">
            <Card className="max-w-sm shadow-black/10 shadow-2xl bg-white/70 backdrop-blur-lg border-none rounded-[24px] z-10">
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
                                className="!bg-white focus-visible:ring-violet-100 focus-visible:border-white selection:bg-violet-500 text-sm"
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
                                className="!bg-white focus-visible:ring-violet-100 focus-visible:border-white selection:bg-violet-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            id="loginBtn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white hover:text-white rounded-lg"
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
