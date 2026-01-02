"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CallDialerProps {
    onStartCall: () => void;
    isConnecting?: boolean;
}

export function CallDialer({ onStartCall, isConnecting }: CallDialerProps) {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                    <Phone className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl">AI Call Center</CardTitle>
                <p className="text-muted-foreground">Trợ lý chăm sóc khách hàng AI</p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                    Nhấn nút bên dưới để bắt đầu cuộc gọi với trợ lý AI. Bạn có thể hỏi về sản phẩm, chính sách hoặc các câu hỏi thường gặp.
                </p>
                <Button size="lg" className="w-full bg-green-500 hover:bg-green-600" onClick={onStartCall} disabled={isConnecting}>
                    {isConnecting ? (
                        <span className="animate-pulse">Đang kết nối...</span>
                    ) : (
                        <>
                            <Phone className="mr-2 h-5 w-5" />
                            Bắt đầu cuộc gọi
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
