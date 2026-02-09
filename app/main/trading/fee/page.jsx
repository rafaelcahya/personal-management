import { requireAuth } from "@/lib/auth/utils";
import { getFeeList } from "@/lib/services/fee/getFeeList";
import FeesPageClient from "./FeesPageClient";

export default async function FeesPage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }

    const fees = await getFeeList(user.id);

    return <FeesPageClient initialFees={fees} />;
}
