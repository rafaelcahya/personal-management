import InventoryNavigation from "./InventoryNavigation";
import ProductAIChat from "@/components/ProductAIChat";
import { LogoutButton } from "@/app/login/components/Logout";

export default function InventoryLayout({ children }) {
    return (
        <div className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-10 max-w-full md:max-w-5xl xl:max-w-7xl">
            <ProductAIChat />
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                <div className="absolute inset-0 bg-slate-50"></div>
            </div>

            <div className="flex items-center justify-between">
                <InventoryNavigation />
                <LogoutButton />
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
