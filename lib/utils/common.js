export const stringToNumber = (value) => {
    if (value == null) return 0;
    return parseFloat(String(value).replace(/,/g, "").trim()) || 0;
}
