// Call States
export type CallState = "idle" | "connecting" | "active" | "listening" | "processing" | "speaking" | "ended";

// Responder Type
export type ResponderType = "ai" | "admin";

// User & Auth Types
export type UserRole = "guest" | "admin";

export interface User {
    id: string;
    username: string;
    role: UserRole;
    display_name: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

// Transcript Message
export interface TranscriptMessage {
    id: string;
    role: "user" | "assistant" | "admin";
    content: string;
    timestamp: Date;
    responder: ResponderType;
    audioUrl?: string;
}

// API Response
export interface ChatResponse {
    response: string;
    sources?: string[];
}

export interface VoiceResponse {
    audioBlob: Blob;
    transcription?: string;
    responseText?: string;
    responder?: ResponderType;
    sessionId?: string;
}

// Call Session (for Admin)
export interface CallSession {
    id: string;
    guest_id: string;
    guest_name: string;
    status: "active" | "ended" | "admin_takeover";
    current_responder: ResponderType;
    admin_id?: string;
    messages: TranscriptMessage[];
    started_at: string;
    ended_at?: string;
}

// Audio Recorder State
export interface AudioRecorderState {
    isRecording: boolean;
    audioBlob: Blob | null;
    audioUrl: string | null;
    error: string | null;
}

// Audio Player State
export interface AudioPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}
