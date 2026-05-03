import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "sonner";
import "./style/index.css";
import { AuthListener } from "@/components/AuthListener";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Personal Management",
    description: "Personal Management",
};

const geist = Figtree({
    variable: "--font-geist",
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geist.className} antialiased relative min-h-screen`}
            >
                {/* Main Content */}
                <div className="relative z-10">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AuthListener />
                        {children}
                        <div id="toast">
                            <Toaster richColors position="top-center" />
                        </div>
                    </ThemeProvider>
                </div>
            </body>
        </html>
    );
}
