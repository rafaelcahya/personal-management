"use client";

import { useState } from "react";
import ProductNamesTable from "./ProductNamesTable";

export default function ProductNamesPageClient({ initialNames }) {
    const [names, setNames] = useState(initialNames);

    return <ProductNamesTable productNames={names} />;
}
