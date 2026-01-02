"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptMessage } from "@/types";
import { cn } from "@/lib/utils";

interface TranscriptViewProps {
    messages: TranscriptMessage[];
}

export function TranscriptView({ messages }: TranscriptViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground p-4">
                <p className="text-center text-sm">Cuộc hội thoại sẽ hiển thị ở đây...</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full" ref={scrollRef}>
            <div className="p-4 space-y-3">
                {messages.map((message) => (
                    <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                        <div
                            className={cn(
                                "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                                message.role === "user"
                                    ? "bg-blue-500 text-white"
                                    : message.role === "admin"
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            )}
                        >
                            {message.responder === "admin" && message.role !== "user" && <div className="text-xs opacity-75 mb-1">Nhân viên</div>}
                            <p>{message.content}</p>
                            <p className="text-xs opacity-60 mt-1">
                                {message.timestamp.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
