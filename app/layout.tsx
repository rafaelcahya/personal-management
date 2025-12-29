import type { Metadata } from "next";
import { Figtree, Geist, Google_Sans_Code, Manrope, Mulish, Nunito, Nunito_Sans, Outfit, Quicksand } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "sonner";
import "./style/index.css";
import background from "./assets/background.jpg";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Trading Performance",
    description: "Trading Performance",
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
                // style={{
                //     backgroundImage: `url(${background.src})`,
                //     backgroundSize: "cover",
                //     backgroundPosition: "center",
                //     backgroundAttachment: "fixed",
                // }}
            >
                {/* Overlay frosted glass */}
                {/* <div className="absolute inset-0 bg-white/80 dark:bg-[#0e0f11] backdrop-blur-2xl" /> */}

                {/* Main Content */}
                <div className="relative z-10">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
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