import { Button } from "@/components/ui/button";
import Link from "next/link";

function page() {
    return (
        <div>
            <Link href="/main/landing/inventory-management/product-list">
                <Button>Product List</Button>
            </Link>
            <Link href="/inventory-management/product-history">
                <Button>Product History</Button>
            </Link>
        </div>
    );
}

export default page;
