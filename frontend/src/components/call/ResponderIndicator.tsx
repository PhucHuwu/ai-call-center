import { ResponderType } from "@/types";
import { Bot, User } from "lucide-react";

interface ResponderIndicatorProps {
    responder: ResponderType;
    className?: string;
}

export function ResponderIndicator({ responder, className = "" }: ResponderIndicatorProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {responder === "ai" ? (
                <>
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">AI đang trả lời</span>
                </>
            ) : (
                <>
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm">Nhân viên đang trả lời</span>
                </>
            )}
        </div>
    );
}
