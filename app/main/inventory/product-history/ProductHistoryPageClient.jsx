"use client";

import { useState } from "react";
import ProductHistoryTable from "./ProductHistoryTable";

export default function ProductHistoryPageClient({ initialHistory }) {
    const [history, setHistory] = useState(initialHistory);

    return <ProductHistoryTable productHistories={history} />;
}
