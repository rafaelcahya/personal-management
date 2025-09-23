export function safeZoneMean(realizedGains, stdDevRupiah, moe) {
    if (!realizedGains || realizedGains.length === 0) return null;

    const n = realizedGains.length;

    const safeZoneMean = realizedGains.reduce((sum, val) => sum + val, 0) / n;
    const safeZoneWithoutMoe = safeZoneMean + stdDevRupiah;
    const safeZoneWithMoe = (safeZoneMean + stdDevRupiah) / (1 + moe / 100);

    return { safeZoneWithoutMoe: safeZoneWithoutMoe.toFixed(2), safeZoneWithMoe: safeZoneWithMoe.toFixed(2) };
}

export function safeZoneAvgProfit(avgProfit, moe) {
    if (!avgProfit) return null;

    const safeZoneAvgProfitWithoutMoe = avgProfit;
    const safeZoneAvgProfitWithMoe = avgProfit - avgProfit / moe;

    return { safeZoneAvgProfitWithoutMoe: safeZoneAvgProfitWithoutMoe.toFixed(2), safeZoneAvgProfitWithMoe: safeZoneAvgProfitWithMoe.toFixed(2) };
}

export function safeZoneAvgLoss(avgLoss, moe) {
    if (!avgLoss) return null;

    const safeZoneAvgLossWithoutMoe = avgLoss;
    const safeZoneAvgLossWithMoe = avgLoss - avgLoss / moe;

    return { safeZoneAvgLossWithoutMoe: safeZoneAvgLossWithoutMoe.toFixed(2), safeZoneAvgLossWithMoe: safeZoneAvgLossWithMoe.toFixed(2) };
}
