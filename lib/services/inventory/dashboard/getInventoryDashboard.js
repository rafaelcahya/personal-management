import { createClient } from "@/lib/supabase/server";

async function fetchProductList(supabase, userId) {
    const { data, error } = await supabase
        .from("product_list")
        .select("id, product, brand, type, quantity, product_status, is_favorite, usage_date")
        .eq("user_id", userId)
        .is("deleted_at", null);
    if (error) throw new Error(error.message);
    return data || [];
}

async function fetchSpentByProduct(supabase, userId) {
    const { data, error } = await supabase
        .from("product_quantity")
        .select("product_list_id, price")
        .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return (data || []).reduce((acc, q) => {
        acc[q.product_list_id] = (acc[q.product_list_id] || 0) + Number(q.price || 0);
        return acc;
    }, {});
}

async function fetchHistoryUnitsByProduct(supabase, userId) {
    const { data, error } = await supabase
        .from("product_history")
        .select("product_list_id, quantity")
        .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return (data || []).reduce((acc, h) => {
        acc[h.product_list_id] = (acc[h.product_list_id] || 0) + Number(h.quantity || 0);
        return acc;
    }, {});
}

async function fetchQuantityRecordsWithDate(supabase, userId) {
    const { data, error } = await supabase
        .from("product_quantity")
        .select("product_list_id, price, purchase_date")
        .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return data || [];
}

async function fetchProductHistoryFull(supabase, userId) {
    const { data, error } = await supabase
        .from("product_history")
        .select("product_list_id, depleted_quantity, start_usage_date")
        .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return data || [];
}

function buildCostPerUseList(products, spentByProduct, historyUnitsByProduct) {
    return products.map((p) => {
        const totalSpent = spentByProduct[p.id] || 0;
        const totalUnits = Number(p.quantity || 0) + (historyUnitsByProduct[p.id] || 0);
        const costPerUse = totalSpent > 0 && totalUnits > 0 ? totalSpent / totalUnits : null;
        return {
            id: p.id,
            product: p.product,
            brand: p.brand,
            type: p.type,
            quantity: p.quantity,
            product_status: p.product_status,
            is_favorite: p.is_favorite,
            total_spent: totalSpent,
            total_units: totalUnits,
            cost_per_use: costPerUse,
        };
    });
}

function sortByCostPerUse(list) {
    return [...list].sort((a, b) => {
        if (a.cost_per_use === null && b.cost_per_use === null) return 0;
        if (a.cost_per_use === null) return 1;
        if (b.cost_per_use === null) return -1;
        return b.cost_per_use - a.cost_per_use;
    });
}

function buildLowStockAlerts(products) {
    return products
        .filter(p => p.quantity <= 2)
        .sort((a, b) => a.quantity - b.quantity)
        .map(p => ({
            id: p.id,
            product: p.product,
            brand: p.brand,
            type: p.type,
            quantity: p.quantity,
            product_status: p.product_status,
        }));
}

function buildNeglectedProducts(products) {
    const now = new Date();
    const THRESHOLD_DAYS = 30;
    return products
        .filter(p => {
            if (p.product_status !== "active") return false;
            if (!p.usage_date) return true;
            const days = (now - new Date(p.usage_date)) / 86400000;
            return days >= THRESHOLD_DAYS;
        })
        .map(p => ({
            id: p.id,
            product: p.product,
            brand: p.brand,
            type: p.type,
            quantity: p.quantity,
            last_used: p.usage_date || null,
            days_since_used: p.usage_date
                ? Math.round((now - new Date(p.usage_date)) / 86400000)
                : null,
        }))
        .sort((a, b) => {
            if (!a.last_used && !b.last_used) return 0;
            if (!a.last_used) return -1;
            if (!b.last_used) return 1;
            return new Date(a.last_used) - new Date(b.last_used);
        });
}

function buildMonthlySpendByType(quantityRecords, productMap) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const byKey = {};
    for (const q of quantityRecords) {
        if (!q.purchase_date || new Date(q.purchase_date) < sixMonthsAgo) continue;
        const product = productMap[q.product_list_id];
        const type = product?.type || "Other";
        const month = q.purchase_date.slice(0, 7);
        const key = `${month}__${type}`;
        if (!byKey[key]) byKey[key] = { month, type, total_spent: 0 };
        byKey[key].total_spent += Number(q.price || 0);
    }

    return Object.values(byKey).sort((a, b) =>
        b.month.localeCompare(a.month) || b.total_spent - a.total_spent
    );
}

function buildAvgUsageDuration(historyRecords, productMap) {
    const byProduct = {};
    for (const h of historyRecords) {
        if (!byProduct[h.product_list_id]) byProduct[h.product_list_id] = [];
        byProduct[h.product_list_id].push(h.start_usage_date);
    }

    const now = new Date();
    return Object.entries(byProduct)
        .map(([productId, dates]) => {
            const product = productMap[productId];
            if (!product) return null;
            dates.sort();
            let avgDays;
            if (dates.length >= 2) {
                const gaps = [];
                for (let i = 1; i < dates.length; i++) {
                    gaps.push((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000);
                }
                avgDays = Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length);
            } else {
                avgDays = Math.round((now - new Date(dates[0])) / 86400000);
            }
            return {
                product_list_id: Number(productId),
                product: product.product,
                brand: product.brand,
                type: product.type,
                avg_days: avgDays,
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.avg_days - a.avg_days);
}

function buildDaysUntilEmpty(products, historyRecords) {
    const byProduct = {};
    for (const h of historyRecords) {
        if (!byProduct[h.product_list_id]) {
            byProduct[h.product_list_id] = { total_depleted: 0, earliest_date: h.start_usage_date };
        }
        byProduct[h.product_list_id].total_depleted += Number(h.depleted_quantity || 0);
        if (h.start_usage_date < byProduct[h.product_list_id].earliest_date) {
            byProduct[h.product_list_id].earliest_date = h.start_usage_date;
        }
    }

    const now = new Date();
    return products
        .filter(p => p.quantity > 0 && byProduct[p.id]?.total_depleted > 0)
        .map(p => {
            const hist = byProduct[p.id];
            const daysSince = Math.max(1, (now - new Date(hist.earliest_date)) / 86400000);
            const dailyConsumption = hist.total_depleted / daysSince;
            if (dailyConsumption <= 0) return null;
            return {
                id: p.id,
                product: p.product,
                brand: p.brand,
                type: p.type,
                quantity: p.quantity,
                daily_consumption: Math.round(dailyConsumption * 1000) / 1000,
                days_until_empty: Math.round(p.quantity / dailyConsumption),
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.days_until_empty - b.days_until_empty);
}

export async function getInventoryDashboard(userId) {
    const supabase = await createClient();

    const [products, spentByProduct, historyUnitsByProduct, quantityRecords, historyFull] =
        await Promise.all([
            fetchProductList(supabase, userId),
            fetchSpentByProduct(supabase, userId),
            fetchHistoryUnitsByProduct(supabase, userId),
            fetchQuantityRecordsWithDate(supabase, userId),
            fetchProductHistoryFull(supabase, userId),
        ]);

    const productMap = products.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});

    const sorted = sortByCostPerUse(buildCostPerUseList(products, spentByProduct, historyUnitsByProduct));
    const lowStockAlerts = buildLowStockAlerts(products);
    const neglectedProducts = buildNeglectedProducts(products);
    const monthlySpendByType = buildMonthlySpendByType(quantityRecords, productMap);
    const avgUsageDuration = buildAvgUsageDuration(historyFull, productMap);
    const daysUntilEmpty = buildDaysUntilEmpty(products, historyFull);

    return {
        top5: sorted.slice(0, 5),
        all: sorted,
        lowStockAlerts,
        neglectedProducts,
        monthlySpendByType,
        avgUsageDuration,
        daysUntilEmpty,
    };
}
