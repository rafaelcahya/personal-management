"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilePenLine, MoreHorizontalIcon, StarIcon } from "lucide-react";
import { toast } from "sonner";
import { favoriteProduct } from "@/lib/api/product";
import AddStockForm from "../detail/AddStockForm";
import StockAdjustment from "../detail/StockAdjustment";
import DeleteProductDialog from "./component/DeleteProductDialog";

export default function ProductsTable({
    products,
    allProducts,
    onProductsChange,
    onRefresh,
}) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loadingFavorite, setLoadingFavorite] = useState(null);

    const handleToggleFavorite = async (product) => {
        const newFavoriteStatus = !product.is_favorite;
        const previousState = [...allProducts];
        setLoadingFavorite(product.id);

        onProductsChange((prev) => {
            const updated = prev.map((p) =>
                p.id === product.id
                    ? { ...p, is_favorite: newFavoriteStatus }
                    : p,
            );
            return updated.sort((a, b) => {
                if (a.is_favorite === b.is_favorite) return 0;
                return a.is_favorite ? -1 : 1;
            });
        });

        try {
            await favoriteProduct(product.id, newFavoriteStatus);

            toast.success(
                newFavoriteStatus
                    ? `${product.brand} added to favorites`
                    : `${product.brand} removed from favorites`,
            );
        } catch (error) {
            onProductsChange(previousState);

            toast.error(error.message || "Failed to update favorite status");
        } finally {
            setLoadingFavorite(null);
        }
    };

    return (
        <>
            <Table className="w-full table-auto">
                <TableHeader className="bg-slate-100 sticky top-0 z-20">
                    <TableRow className="border-none">
                        <TableHead className="py-2 text-slate-foreground rounded-l-lg w-[35%]">
                            Product
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-center w-[12%]">
                            Quantity
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-center w-[15%]">
                            On Hand Quantity
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-center w-[13%]">
                            Usage Date
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-center w-[13%]">
                            Product Status
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-center rounded-r-lg w-[12%]">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => {
                        return (
                            <TableRow
                                key={product.id}
                                className="hover:bg-slate-100"
                            >
                                <TableCell className="w-[35%]">
                                    <div className="flex items-center gap-3">
                                        {product.is_favorite && (
                                            <StarIcon className="size-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">
                                                {product.brand}
                                            </p>
                                            <p className="text-slate-500 text-sm truncate">
                                                {product.type} {product.product}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-mono font-medium w-[12%]">
                                    <span
                                        className={`${
                                            product.quantity === 0
                                                ? "text-red-600 font-bold"
                                                : product.quantity < 5
                                                  ? "text-yellow-600 font-bold"
                                                  : ""
                                        }`}
                                    >
                                        {product.quantity}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center font-mono font-medium w-[15%]">
                                    {product.usage_quantity}
                                </TableCell>
                                <TableCell className="text-center text-sm w-[13%]">
                                    {product.usage_date
                                        ? new Date(
                                              product.usage_date,
                                          ).toLocaleDateString("id-ID", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                          })
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-center w-[13%]">
                                    <Badge
                                        className={`${
                                            product.product_status === "active"
                                                ? "bg-green-100 text-green-600 capitalize"
                                                : "bg-red-100 text-red-600 capitalize"
                                        }`}
                                    >
                                        {product.product_status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center w-[12%]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 mx-auto outline-none hover:bg-slate-200"
                                            >
                                                <MoreHorizontalIcon />
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="p-0 hover:bg-violet-50 hover:outline-none focus:bg-violet-50"
                                            >
                                                <AddStockForm
                                                    product={product}
                                                    onAdded={onRefresh}
                                                />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setSelectedProduct(product)
                                                }
                                                className="hover:bg-violet-50 hover:outline-none focus:bg-violet-50 cursor-pointer"
                                            >
                                                <FilePenLine className="h-4 w-4 mr-2" />
                                                Update Usage
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleToggleFavorite(
                                                        product,
                                                    )
                                                }
                                                disabled={
                                                    loadingFavorite ===
                                                    product.id
                                                }
                                                className="hover:bg-violet-50 hover:outline-none focus:bg-violet-50 cursor-pointer"
                                            >
                                                <StarIcon
                                                    className={`size-4 mr-2 ${
                                                        product.is_favorite
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : ""
                                                    }`}
                                                />
                                                {product.is_favorite
                                                    ? "Remove from Favorites"
                                                    : "Add to Favorites"}
                                            </DropdownMenuItem>

                                            {!product.deleted_at && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                        className="p-0"
                                                    >
                                                        <DeleteProductDialog
                                                            product={product}
                                                            onDeleted={
                                                                onRefresh
                                                            }
                                                        />
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {selectedProduct && (
                <StockAdjustment
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onUpdated={async () => {
                        await onRefresh();
                        setSelectedProduct(null);
                    }}
                />
            )}
        </>
    );
}
