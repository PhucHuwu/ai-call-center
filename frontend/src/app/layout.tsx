import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";

const inter = Inter({
    subsets: ["latin", "vietnamese"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "AI Call Center - Trợ lý chăm sóc khách hàng",
    description: "Hệ thống trợ lý chăm sóc khách hàng AI thông minh",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className={`${inter.variable} font-sans antialiased`}>
                <AuthProvider>
                    <SocketProvider>{children}</SocketProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
