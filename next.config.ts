import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },

    // FIX SUPABASE SSR + BUILD TIME ERRORS
    experimental: {
        serverComponentsExternalPackages: [
            "@supabase/supabase-js",
            "@supabase/ssr",
            "@supabase/auth-helpers-nextjs",
        ],
    },

    // DISABLE STATIC GENERATION UNTUK AUTH PAGES
    generateStaticParams: async () => {
        return []; // Skip semua static params
    },

    // OPTIONAL: Custom webpack untuk Supabase
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

    // CI BUILD OPTIMIZATION
    swcMinify: true,
    poweredByHeader: false,

    // OUTPUT UNTUK DOCKER/JENKINS
    output: "standalone",
};

export default nextConfig;
