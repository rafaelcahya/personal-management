import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardFooter,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function CardDemo() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 min-h-screen">
            <Card className="w-full max-w-sm flex-1 md:max-w-sm">
                <CardHeader>
                    <CardTitle>Trade Management</CardTitle>
                    <CardDescription>
                        Why trades win/lose. Fees, margins, FCA/E-IPO patterns.
                        Data drives profit.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href="/main/landing/trading-management/dashboard" prefetch={false} id="tradeBtn">
                        <Button>Launch Trading Analytics</Button>
                    </Link>
                </CardFooter>
            </Card>

            <Card className="w-full max-w-sm flex-1 md:max-w-sm">
                <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>
                        Predict demand before it happens. Your inventory works
                        smarter, so you don't have to.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button>Master Inventory Control</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
