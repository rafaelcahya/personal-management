export default function CircleStatConic({
    label,
    count,
    percent = 0,
    color = "#10B981", // hijau default
    size = 80,
    trackColor = "#e6e9ee", // warna sisa progress
}) {
    const pct = Math.max(0, Math.min(100, percent));

    // bikin gradient otomatis
    const gradient = `conic-gradient(${color} ${pct}%, ${trackColor} ${pct}% 100%)`;

    return (
        <div className="flex flex-col items-center gap-2 w-full sm:w-1/2">
            <div
                className="rounded-full flex items-center justify-center"
                style={{
                    width: size,
                    height: size,
                    backgroundImage: gradient,
                }}
            >
                <div className="rounded-full bg-white w-[70%] h-[70%] flex items-center justify-center">
                    <span className="text-sm font-bold" style={{ color }}>
                        {pct}%
                    </span>
                </div>
            </div>

            <div className="text-center">
                <p className="font-medium">{count}</p>
                <p className="text-xs font-medium uppercase text-slate-foreground">
                    {label}
                </p>
            </div>
        </div>
    );
}
