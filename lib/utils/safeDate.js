import { parseISO } from "date-fns";

export default function safeDate(value) {
    if (!value) return undefined;
    const d = parseISO(value);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
