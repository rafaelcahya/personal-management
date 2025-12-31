export function calculatePayOffRatio(avgProfit, avgLoss) {
    const payoffRatio = avgLoss ? avgProfit / avgLoss : 0;
    let payoffComment = "";
    if (payoffRatio >= 2)
        payoffComment =
            "🔥 Excellent! Your average profit is more than 2x your average loss (healthy risk-reward).";
    else if (payoffRatio >= 1)
        payoffComment =
            "✅ Good! Average profit per win is higher than average loss per loss. Keep it consistent.";
    else
        payoffComment =
            "⚠️ Caution! Average profit per win is smaller than average loss per loss. Review your strategy.";
    return { payoffRatio, payoffComment };
}
