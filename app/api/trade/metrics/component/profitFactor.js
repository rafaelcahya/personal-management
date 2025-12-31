export function calculateProfitFactor(totalProfit, totalLoss) {
    const profitFactor =
        totalLoss !== 0
            ? totalProfit / Math.abs(totalLoss)
            : totalProfit > 0
            ? Infinity
            : 0;

    let profitFactorComment = "";

    if (profitFactor < 1) {
        profitFactorComment =
            "❌ Your losses are bigger than your profits (PF < 1)";
    } else if (profitFactor < 1.5) {
        profitFactorComment =
            "⚠️ You are making profit, but not strong yet (PF 1.0–1.5)";
    } else {
        profitFactorComment =
            "✅ Great! Your profits are much bigger than your losses (PF ≥ 1.5 🚀)";
    }

    return { profitFactor, profitFactorComment };
}
