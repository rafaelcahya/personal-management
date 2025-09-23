// // /lib/utils/metrics.js

// // =========================
// // Date Helper
// // =========================
// export const toDateKey = (d) => {
//     if (!d) return null;
//     return new Date(d).toISOString().split("T")[0]; // YYYY-MM-DD
// };

// // =========================
// // Percent Change Helper
// // =========================
// export const pctChange = (oldVal, newVal) => {
//     const a = Number(oldVal) || 0;
//     const b = Number(newVal) || 0;
//     const oldAbs = Math.abs(a);
//     const denom = oldAbs !== 0 ? oldAbs : Math.abs(b) || 1;
//     const raw = ((b - a) / denom) * 100;
//     return parseFloat(raw.toFixed(2));
// };

// // =========================
// // Stats Helpers
// // =========================
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(2));
};




// export const mean = (arr) => (arr.length ? sum(arr) / arr.length : 0);

// export const stdDev = (arr) => {
//     if (!arr.length) return 0;
//     const m = mean(arr);
//     const variance =
//         arr.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / arr.length;
//     return Math.sqrt(variance);
// };

// export const groupByDateKey = (trades) => {
//     const map = new Map();
//     trades.forEach((t) => {
//         const k = t.dateKey;
//         if (!map.has(k)) map.set(k, []);
//         map.get(k).push(t);
//     });
//     return map;
// };

// export const sumRealizedUpTo = (trades, key) =>
//     trades
//         .filter((t) => t.dateKey <= key)
//         .reduce((acc, t) => acc + Number(t.realized_gain || 0), 0);

// export const countTradesUpTo = (trades, key) =>
//     trades.filter((t) => t.dateKey <= key).length;

// // =========================
// // Suggested TP Calculation
// // =========================
// export function calculateSuggestedTP(winRate, avgLoss, payoffRatio) {
//     if (!avgLoss || avgLoss <= 0) {
//         return { tp: 0, expectedValue: 0 };
//     }

//     // base TP = avgLoss * payoffRatio (tapi jangan kurang dari 1.5x avgLoss)
//     const tp = avgLoss * Math.max(1.5, payoffRatio);

//     // expected value = (prob menang * profit) - (prob kalah * loss)
//     const expectedValue =
//         (winRate / 100) * tp - ((100 - winRate) / 100) * avgLoss;

//     return {
//         tp: parseFloat(tp.toFixed(2)),
//         expectedValue: parseFloat(expectedValue.toFixed(2)),
//     };
// }
