"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function SkeletonGrid({ count = 4 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(count)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                            <div className="w-16 h-5 bg-slate-200 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="w-20 h-3 bg-slate-200 rounded" />
                            <div className="w-32 h-8 bg-slate-200 rounded" />
                            <div className="w-24 h-3 bg-slate-200 rounded" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
