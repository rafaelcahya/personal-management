export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(2));
};