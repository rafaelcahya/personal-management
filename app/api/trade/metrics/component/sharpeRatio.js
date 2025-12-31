import { calculateStandardDeviation } from "./standardDeviation.js";

export function calculateSharpeRatio(returnPercent, riskFreeBI, riskFreePersonal) {
    const { stdDevRatio } =
        calculateStandardDeviation(returnPercent);

    // Mean return
    const avgReturn =
        returnPercent.reduce((acc, val) => acc + val, 0) / returnPercent.length;

    // Sharpe Ratio BI
    const sharpeBI =
        stdDevRatio > 0 ? (avgReturn - riskFreeBI / 100) / stdDevRatio : 0;

    // Sharpe Ratio Personal
    const sharpePersonal =
        stdDevRatio > 0
            ? (avgReturn - riskFreePersonal / 100) / stdDevRatio
            : 0;

    // Comment
    const sharpeComment = (ratio) => {
        if (ratio < 1) return "⚠️ Not efficient (Sharpe < 1)";
        if (ratio < 2) return "✅ Decent (Sharpe 1-2)";
        return "🚀 Excellent (Sharpe > 2)";
    };

    return {
        avgReturn,
        stdDevRatio,
        sharpeBI,
        sharpeBIComment: sharpeComment(sharpeBI),
        sharpePersonal,
        sharpePersonalComment: sharpeComment(sharpePersonal),
    };
}
