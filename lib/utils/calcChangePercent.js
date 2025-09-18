export default function calcChangePercent(prev, curr, hasTodayTrade) {
    if (!hasTodayTrade) return 0; // kalau tidak ada trade hari ini, return 0
    if (prev === 0) return 0;
    return parseFloat((((curr - prev) / Math.abs(prev)) * 100).toFixed(2));
}
