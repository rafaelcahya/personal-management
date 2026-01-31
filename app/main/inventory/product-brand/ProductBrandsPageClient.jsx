"use client";

import { useState } from "react";
import ProductBrandsTable from "./ProductBrandsTable";

export default function ProductBrandsPageClient({ initialBrands }) {
    const [brands, setBrands] = useState(initialBrands);

    return <ProductBrandsTable brands={brands} />;
}
