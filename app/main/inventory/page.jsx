import { requireAuth } from "@/lib/auth/utils";
import InventoryDashboard from "./InventoryDashboard";

export default async function InventoryPage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }

    return <InventoryDashboard />;
}
