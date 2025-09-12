import React from "react";

export const highlightKeyword = (
    text,
    keyword,
    colorClass = "bg-violet-500"
) => {
    if (!keyword) return text;

    const parts = text.split(new RegExp(`(${keyword})`, "gi"));

    return parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
            <mark key={i} className={`${colorClass} text-violet-200 px-2 py-1 rounded-lg`}>
                {part}
            </mark>
        ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
        )
    );
};

