export function calculateStandardDeviation(realizedGains) {
    if (!realizedGains || realizedGains.length === 0) {
        return {
            stdDevRupiah: 0,
            stdDevRatio: 0,
            stdDevComment: "⚠️ Data kosong, tidak bisa hitung Std Dev.",
        };
    }

    // Mean (average PnL)
    const mean =
        realizedGains.reduce((acc, val) => acc + val, 0) / realizedGains.length;

    // Standard Deviation (Rupiah)
    const variance =
        realizedGains.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
        realizedGains.length;
    const stdDevRupiah = Math.sqrt(variance);

    // Ratio (Std Dev ÷ Mean absolute)
    const stdDevRatio = Math.abs(mean) > 0 ? stdDevRupiah / Math.abs(mean) : 0;

    // Comment
    const stdDevComment =
        stdDevRatio > 1
            ? `⚠️ Std Dev is ${stdDevRatio.toFixed(
                  2
              )}x higher than average PnL. Reduce it ≤ 1 for consistency.`
            : `✅ Stable! Std Dev/Mean = ${stdDevRatio.toFixed(
                  2
              )}x. Keep consistency.`;

    return {
        stdDevRupiah,
        stdDevRatio,
        stdDevComment,
    };
}
