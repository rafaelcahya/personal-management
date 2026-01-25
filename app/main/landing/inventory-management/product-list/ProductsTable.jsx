"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Card,
    CardFooter,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import background from "../../../../assets/background.jpg";
import Breadcrumbs from "../../../../../components/ui/common/Breadcrumbs";
import Image from "next/image";
import AddProduct from "./AddProduct";
import StockAdjustment from "./StockAdjustment";
import { getProductList } from "@/lib/services/inventory/product/getProductList";
import AddStockForm from "./AddStockForm";

export default function ProductsTable({ products: initialProducts }) {
    const [listProduct, setListProduct] = useState(initialProducts || []);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            const products = await getProductList();
            setListProduct(products || []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }, []);

    useEffect(() => {
        if (initialProducts && initialProducts.length > 0) {
            setListProduct(initialProducts);
        } else {
            fetchProducts();
        }
    }, [initialProducts, fetchProducts]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div className="space-y-2">
                    {/* TODO: Add and fix breadcrumbs */}
                    {/* <Breadcrumbs /> */}
                    <div>
                        <p className="text-lg font-semibold">Product List</p>
                        <p className="text-sm text-slate-foreground">
                            Quick peek at your trading history — see what’s
                            winning and what’s not.
                        </p>
                    </div>
                </div>
                <AddProduct onAdded={fetchProducts} />
            </div>

            <div className="relative w-full flex-1 overflow-y-auto z-20">
                {listProduct?.length === 0 ? (
                    <p className="text-center font-medium text-slate-foreground py-10">
                        No products yet. Start by adding a new product 🚀
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 z-20">
                        {listProduct.map((product) => (
                            <Card
                                key={product.id}
                                className="w-full max-w-xs flex-1 border-none shadow-xl shadow-slate-200"
                            >
                                <CardHeader className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-foreground">
                                        {product.type}
                                    </p>
                                    <Image
                                        src={background}
                                        className="w-10 h-10 rounded-xl"
                                        alt="Product"
                                    />
                                </CardHeader>

                                <CardTitle className="px-6">
                                    <span className="leading-tight">
                                        {product.brand} {product.type}{" "}
                                        {product.product}
                                    </span>
                                </CardTitle>

                                <CardDescription className="space-y-2 px-6">
                                    <div className="flex justify-between">
                                        <p className="text-slate-foreground">
                                            Quantity
                                        </p>
                                        <p className="text-slate-800 font-medium font-mono text-center">
                                            {product.quantity}
                                        </p>
                                    </div>

                                    <Separator className="bg-slate-200" />

                                    <div className="flex justify-between">
                                        <p className="text-slate-foreground whitespace-nowrap">
                                            On hand quantity
                                        </p>
                                        <p className="text-slate-800 font-medium font-mono text-center">
                                            {product.usage_quantity}
                                        </p>
                                    </div>

                                    <Separator className="bg-slate-200" />

                                    <div className="flex justify-between">
                                        <p className="text-slate-foreground">
                                            Usage date
                                        </p>
                                        <p className="text-xs text-slate-600 font-mono">
                                            {product.usage_date
                                                ? new Date(
                                                      product.usage_date,
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </p>
                                    </div>

                                    <Separator className="bg-slate-200" />

                                    <div className="flex justify-between">
                                        <p className="text-slate-foreground whitespace-nowrap">
                                            Product status
                                        </p>
                                        <Badge
                                            className={`${
                                                product.product_status ===
                                                "active"
                                                    ? "bg-green-100 text-green-600 capitalize"
                                                    : "bg-red-100 text-red-600 capitalize"
                                            }`}
                                        >
                                            {product.product_status}
                                        </Badge>
                                    </div>
                                </CardDescription>

                                <CardFooter className="flex justify-between gap-2">
                                    <AddStockForm
                                        product={product}
                                        onAdded={fetchProducts}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setSelectedProduct(product)
                                        }
                                    >
                                        Update Usage
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {selectedProduct && (
                    <StockAdjustment
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onUpdated={async () => {
                            await fetchProducts();
                            setSelectedProduct(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
