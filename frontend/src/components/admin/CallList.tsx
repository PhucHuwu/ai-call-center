"use client";

import Link from "next/link";
import { CallSession } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, HandMetal, Bot, User } from "lucide-react";
import { getAuthHeaders } from "@/services/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3724";

interface CallListProps {
    calls: CallSession[];
}

export function CallList({ calls }: CallListProps) {
    const handleTakeover = async (sessionId: string) => {
        try {
            await fetch(`${API_URL}/api/admin/takeover/${sessionId}`, {
                method: "POST",
                headers: getAuthHeaders(),
            });
        } catch (error) {
            console.error("Takeover failed:", error);
        }
    };

    if (calls.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">Không có cuộc gọi nào đang hoạt động</div>;
    }

    return (
        <div className="space-y-4">
            {calls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-medium">{call.guest_name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {call.messages.length} tin nhắn • Bắt đầu lúc {new Date(call.started_at).toLocaleTimeString("vi-VN")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Badge variant={call.current_responder === "ai" ? "secondary" : "default"}>
                            {call.current_responder === "ai" ? (
                                <>
                                    <Bot className="h-3 w-3 mr-1" /> AI
                                </>
                            ) : (
                                <>
                                    <User className="h-3 w-3 mr-1" /> Admin
                                </>
                            )}
                        </Badge>

                        <Link href={`/admin/calls/${call.id}`}>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Xem
                            </Button>
                        </Link>

                        {call.current_responder === "ai" && (
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => handleTakeover(call.id)}>
                                <HandMetal className="h-4 w-4 mr-1" />
                                Tiếp nhận
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
