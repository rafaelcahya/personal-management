"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import background from "../../../../assets/background.jpg";
import Breadcrumbs from "../../../../../components/ui/common/Breadcrumbs";
import Image from "next/image";
import AddProduct from "./AddProduct";

export default function ProductsTable({ products: initialProducts }) {
    const [listProduct, setListProduct] = useState(initialProducts || []);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/inventory/product/list", {
                cache: "no-store",
            });
            const data = await res.json();
            if (data.success) setListProduct(data.products);
        } catch (err) {
            toast.error("Failed to fetch products:", err);
        }
    };

    useEffect(() => {
        setListProduct(initialProducts);
    }, [initialProducts]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div className="space-y-2">
                    <Breadcrumbs />
                    <div>
                        <p className="text-lg font-semibold">Product List</p>
                        <p className="text-sm text-gray-foreground">
                            Quick peek at your trading history — see what’s
                            winning and what’s not.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Link
                        href="/main/landing/inventory-management/dashboard"
                        className="hidden sm:block"
                    >
                        <Button className="bg-transparent hover:bg-secondary text-secondary-foreground font-medium">
                            Back
                        </Button>
                    </Link>
                    <AddProduct onAdded={fetchProducts} />
                </div>
            </div>

            {/* <SummaryTrade /> */}

            <div className="relative w-full flex-1 overflow-y-auto">
                {listProduct?.length === 0 ? (
                    <p className="text-center font-medium text-gray-foregroundpy-10">
                        No products yet. Start by adding a new product 🚀
                    </p>
                ) : (
                    <div className="grid grid-cols-4 gap-5">
                        {listProduct?.map((product) => (
                            <Card
                                key={product.id}
                                className="w-full max-w-xs flex-1 pt-0"
                            >
                                <Image
                                    src={background}
                                    className="w-full h-32 rounded-t-xl"
                                    alt="test"
                                />
                                <CardHeader>
                                    <CardTitle>
                                        <span className="">
                                            {product.brand} {product.type}{" "}
                                            {product.product}
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        <div className="flex justify-between">
                                            <p>Product Status</p>
                                            <p>{product.product_status}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>Quantity</p>
                                            <p>{product.quantity}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>On hand quantity</p>
                                            <p>{product.on_hand_quantity}</p>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>{product.note}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal Update */}
                {/* {selectedTrade && (
                    <TradeUpdate
                        trade={selectedTrade}
                        onClose={() => setSelectedTrade(null)}
                        onUpdated={fetchTrades}
                    />
                )} */}
            </div>
        </div>
    );
}
