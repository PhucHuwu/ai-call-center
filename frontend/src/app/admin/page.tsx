"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { AuthGuard } from "@/components/auth";
import { CallList } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, LogOut, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const { isConnected, activeCalls } = useSocket();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <AuthGuard requireAdmin>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <Phone className="h-6 w-6 text-blue-500" />
                                <h1 className="text-xl font-bold">AI Call Center</h1>
                            </Link>
                            <span className="text-sm text-muted-foreground">Admin Dashboard</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Connection Status */}
                            <div className="flex items-center gap-2 text-sm">
                                {isConnected ? (
                                    <>
                                        <Wifi className="h-4 w-4 text-green-500" />
                                        <span className="text-green-600">Đã kết nối</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="h-4 w-4 text-red-500" />
                                        <span className="text-red-600">Mất kết nối</span>
                                    </>
                                )}
                            </div>

                            <span className="text-sm">Xin chào, {user?.display_name}</span>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-1" />
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    {/* Stats */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Cuộc gọi đang hoạt động</CardTitle>
                                <Phone className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{activeCalls.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Đang chờ AI trả lời</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{activeCalls.filter((c) => c.current_responder === "ai").length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Calls */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cuộc gọi đang hoạt động</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CallList calls={activeCalls} />
                        </CardContent>
                    </Card>
                </main>
            </div>
        </AuthGuard>
    );
}
