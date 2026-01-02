import { VoiceResponse, ChatResponse, ResponderType } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getAuthHeaders(): HeadersInit {
    if (typeof window === "undefined") return {};
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function sendVoiceMessage(audioBlob: Blob): Promise<VoiceResponse> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const response = await fetch(`${API_URL}/api/voice`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Voice API error: ${response.status}`);
    }

    const responseBlob = await response.blob();
    const transcription = response.headers.get("X-Transcription") || undefined;
    const responseText = response.headers.get("X-Response-Text") || undefined;
    const responder = response.headers.get("X-Responder") as ResponderType | undefined;
    const sessionId = response.headers.get("X-Session-Id") || undefined;

    return {
        audioBlob: responseBlob,
        transcription: transcription ? decodeURIComponent(transcription) : undefined,
        responseText: responseText ? decodeURIComponent(responseText) : undefined,
        responder,
        sessionId,
    };
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
    }

    return response.json();
}

export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        return data.status === "ok";
    } catch {
        return false;
    }
}
