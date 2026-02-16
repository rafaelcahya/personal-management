import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardFooter,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/utils";
import { LogoutButton } from "../../login/components/Logout";
import { TrendingUp, Package } from "lucide-react";

export default async function LandingPage() {
    const user = await requireAuth();

    return (
        <div className="min-h-screen flex flex-col">
            <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <LogoutButton />
            </div>

            <div className="flex-1 flex items-center justify-center p-4 -mt-[12.5vh]">
                <div className="w-full max-w-7xl space-y-10">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Good to see you,{" "}
                            <span
                                id="fullNameAuth_landingPage"
                                className="text-primary"
                            >
                                {user.user_metadata.full_name?.split(" ")[0] ||
                                    user.email.split("@")[0]}
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Where do you want to dive in today?
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                        <Card
                            id="tradeManagementCard_landingPage"
                            className="w-full max-w-sm flex-1 md:max-w-sm hover:border-primary duration-200 group relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/20" />

                            <CardHeader className="relative">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                </div>

                                <CardTitle>Trade Management</CardTitle>
                                <CardDescription>
                                    Why trades win/lose. Fees, margins,
                                    FCA/E-IPO patterns. Data drives profit.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="relative">
                                <Link
                                    href="/main/trading/dashboard"
                                    prefetch={false}
                                    id="tradeBtn_landingPage"
                                    className="w-full"
                                >
                                    <Button className="w-full">
                                        Launch Trading Analytics
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        <Card
                            id="inventoryManagementCard_landingPage"
                            className="w-full max-w-sm flex-1 md:max-w-sm hover:border-primary duration-200 group relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/20" />

                            <CardHeader className="relative">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                                    <Package className="w-6 h-6 text-primary" />
                                </div>

                                <CardTitle>Inventory Management</CardTitle>
                                <CardDescription>
                                    Predict demand before it happens. Your
                                    inventory works smarter, so you don't have
                                    to.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="relative">
                                <Link
                                    href="/main/inventory/product-list"
                                    prefetch={false}
                                    id="inventoryBtn_landingPage"
                                    className="w-full"
                                >
                                    <Button className="w-full">
                                        Master Inventory Control
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
