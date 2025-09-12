import { Loader2Icon } from "lucide-react";

export default function LoadingComponent({ description = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <Loader2Icon className="w-10 h-10 text-gray-400 animate-spin" />
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}
