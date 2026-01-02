import { CallState } from "@/types";

interface CallStatusProps {
    state: CallState;
}

const STATUS_TEXT: Record<CallState, string> = {
    idle: "",
    connecting: "Đang kết nối...",
    active: "Đang hoạt động",
    listening: "Đang nghe...",
    processing: "Đang xử lý...",
    speaking: "AI đang trả lời...",
    ended: "Cuộc gọi đã kết thúc",
};

const STATUS_COLOR: Record<CallState, string> = {
    idle: "text-gray-400",
    connecting: "text-yellow-300",
    active: "text-green-300",
    listening: "text-blue-300",
    processing: "text-yellow-300",
    speaking: "text-purple-300",
    ended: "text-red-300",
};

export function CallStatus({ state }: CallStatusProps) {
    return (
        <div className={`flex items-center justify-center gap-2 mt-2 ${STATUS_COLOR[state]}`}>
            {state !== "idle" && state !== "ended" && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                </span>
            )}
            <span className="text-sm">{STATUS_TEXT[state]}</span>
        </div>
    );
}
