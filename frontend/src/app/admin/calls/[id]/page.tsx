"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth";
import { TranscriptView, ResponderIndicator } from "@/components/call";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, HandMetal, Bot, Send, Phone } from "lucide-react";
import Link from "next/link";
import { CallSession, TranscriptMessage } from "@/types";
import { getAuthHeaders } from "@/services/auth";
import { useSocket } from "@/contexts/SocketContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3724";

export default function CallDetailPage() {
    const params = useParams();
    const router = useRouter();
    const callId = params.id as string;
    const { activeCalls } = useSocket();

    const [call, setCall] = useState<CallSession | null>(null);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Find call from active calls or fetch from API
    useEffect(() => {
        const activeCall = activeCalls.find((c) => c.id === callId);
        if (activeCall) {
            setCall(activeCall);
        } else {
            // Fetch from API if not in active calls
            fetch(`${API_URL}/api/admin/calls/${callId}`, {
                headers: getAuthHeaders(),
            })
                .then((res) => res.json())
                .then((data) => setCall(data.session))
                .catch(() => router.push("/admin"));
        }
    }, [callId, activeCalls, router]);

    const handleTakeover = async () => {
        try {
            await fetch(`${API_URL}/api/admin/takeover/${callId}`, {
                method: "POST",
                headers: getAuthHeaders(),
            });
        } catch (error) {
            console.error("Takeover failed:", error);
        }
    };

    const handleRelease = async () => {
        try {
            await fetch(`${API_URL}/api/admin/release/${callId}`, {
                method: "POST",
                headers: getAuthHeaders(),
            });
        } catch (error) {
            console.error("Release failed:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        setIsSending(true);
        try {
            await fetch(`${API_URL}/api/admin/respond/${callId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({ message }),
            });
            setMessage("");
        } catch (error) {
            console.error("Send message failed:", error);
        } finally {
            setIsSending(false);
        }
    };

    if (!call) {
        return (
            <AuthGuard requireAdmin>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                </div>
            </AuthGuard>
        );
    }

    const isAdminResponding = call.current_responder === "admin";

    return (
        <AuthGuard requireAdmin>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Quay lại
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-blue-500" />
                                <h1 className="text-lg font-semibold">Cuộc gọi: {call.guest_name}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ResponderIndicator responder={call.current_responder} />

                            {isAdminResponding ? (
                                <Button variant="outline" onClick={handleRelease}>
                                    <Bot className="h-4 w-4 mr-1" />
                                    Trả lại cho AI
                                </Button>
                            ) : (
                                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleTakeover}>
                                    <HandMetal className="h-4 w-4 mr-1" />
                                    Tiếp nhận cuộc gọi
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Transcript */}
                        <div className="lg:col-span-2">
                            <Card className="h-[600px]">
                                <CardHeader>
                                    <CardTitle>Lịch sử hội thoại</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[calc(100%-80px)]">
                                    <TranscriptView
                                        messages={
                                            call.messages.map((m) => ({
                                                ...m,
                                                timestamp: new Date(m.timestamp),
                                            })) as TranscriptMessage[]
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Respond Panel */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin cuộc gọi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Khách:</span>
                                        <span>{call.guest_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Trạng thái:</span>
                                        <span>{call.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bắt đầu:</span>
                                        <span>{new Date(call.started_at).toLocaleTimeString("vi-VN")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tin nhắn:</span>
                                        <span>{call.messages.length}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Respond Panel - Only show if admin is responding */}
                            {isAdminResponding && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Trả lời khách hàng</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Textarea
                                            placeholder="Nhập tin nhắn để trả lời..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={4}
                                        />
                                        <Button className="w-full" onClick={handleSendMessage} disabled={!message.trim() || isSending}>
                                            <Send className="h-4 w-4 mr-1" />
                                            {isSending ? "Đang gửi..." : "Gửi tin nhắn"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
