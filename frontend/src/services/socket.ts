import { io, Socket } from "socket.io-client";
import { getToken } from "./auth";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3724";

let socket: Socket | null = null;

export function connectSocket(): Socket {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: false,
    });

    socket.connect();

    return socket;
}

export function disconnectSocket(): void {
    socket?.disconnect();
    socket = null;
}

export function getSocket(): Socket | null {
    return socket;
}

export function joinAdminRoom(): void {
    const token = getToken();
    if (socket && token) {
        socket.emit("admin_join", { token });
    }
}

export function leaveAdminRoom(): void {
    socket?.emit("admin_leave");
}
