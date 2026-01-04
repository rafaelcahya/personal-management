import { Button } from "@/components/ui/button";
import Link from "next/link";

function page() {
    return (
        <div>
            <Link href="/main/landing/inventory-management/product-list">
                <Button>Product List</Button>
            </Link>
            <Link
                href="/main/landing/inventory-management/product-brand"
                id="productBrandBtn"
            >
                <Button>Product Brand</Button>
            </Link>
            <Link
                href="/main/landing/inventory-management/product-name"
                id="productNameBtn"
            >
                <Button>Product Name</Button>
            </Link>
            <Link href="/main/landing/inventory-management/product-history">
                <Button>Product History</Button>
            </Link>
        </div>
    );
}

export default page;
