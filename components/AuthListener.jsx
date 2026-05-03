"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthListener() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                const intentional = sessionStorage.getItem("intentional_logout");
                sessionStorage.removeItem("intentional_logout");
                if (!intentional) {
                    router.push("/login?reason=session_expired");
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return null;
}
