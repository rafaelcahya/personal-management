export default function calcChange(prev, curr, hasTodayTrade = true) {
    if (!hasTodayTrade || prev === 0) return "0.00";

    const change = ((curr - prev) / Math.abs(prev)) * 100;
    return change.toFixed(2);
}
