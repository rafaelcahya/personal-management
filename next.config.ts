import type { NextConfig } from "next";

const isTurbopack = process.env.TURBOPACK === "1";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },

    // FIX SUPABASE SSR + BUILD TIME ERRORS
    serverExternalPackages: [
        "@supabase/supabase-js",
        "@supabase/ssr",
        "@supabase/auth-helpers-nextjs",
    ],

    poweredByHeader: false,

    // WEBPACK CONFIG — only runs when NOT using Turbopack
    ...(!isTurbopack && {
        webpack: (config, { isServer }) => {
            if (!isServer) {
                config.resolve.fallback = {
                    ...config.resolve.fallback,
                    fs: false,
                    net: false,
                    tls: false,
                };
            }
            return config;
        },
    }),
};

export default nextConfig;
