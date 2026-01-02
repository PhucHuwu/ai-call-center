"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { CallSession, TranscriptMessage } from "@/types";
import { connectSocket, disconnectSocket, joinAdminRoom } from "@/services/socket";
import { useAuth } from "./AuthContext";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    activeCalls: CallSession[];
    joinAdmin: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
    const { isAdmin, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [activeCalls, setActiveCalls] = useState<CallSession[]>([]);

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            const socketInstance = connectSocket();
            setSocket(socketInstance);

            socketInstance.on("connect", () => {
                setIsConnected(true);
                joinAdminRoom();
            });

            socketInstance.on("disconnect", () => {
                setIsConnected(false);
            });

            socketInstance.on("active_calls", (data: { calls: CallSession[] }) => {
                setActiveCalls(data.calls);
            });

            socketInstance.on("new_call", (data: { session: CallSession }) => {
                setActiveCalls((prev) => [...prev, data.session]);
            });

            socketInstance.on("call_update", (data: { session: CallSession }) => {
                setActiveCalls((prev) => prev.map((call) => (call.id === data.session.id ? data.session : call)));
            });

            socketInstance.on("new_message", (data: { session_id: string; message: TranscriptMessage }) => {
                setActiveCalls((prev) => prev.map((call) => (call.id === data.session_id ? { ...call, messages: [...call.messages, data.message] } : call)));
            });

            socketInstance.on("call_ended", (data: { session_id: string }) => {
                setActiveCalls((prev) => prev.filter((call) => call.id !== data.session_id));
            });

            return () => {
                disconnectSocket();
            };
        }
    }, [isAuthenticated, isAdmin]);

    const joinAdmin = () => {
        joinAdminRoom();
    };

    return <SocketContext.Provider value={{ socket, isConnected, activeCalls, joinAdmin }}>{children}</SocketContext.Provider>;
}

export function useSocket(): SocketContextType {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within SocketProvider");
    }
    return context;
}
