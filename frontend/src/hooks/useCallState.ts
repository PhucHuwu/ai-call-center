"use client";

import { useState, useCallback, useRef } from "react";
import { CallState, TranscriptMessage, ResponderType } from "@/types";
import { useAudioRecorder } from "./useAudioRecorder";
import { useAudioPlayer } from "./useAudioPlayer";
import { sendVoiceMessage } from "@/services/api";

interface UseCallStateReturn {
    callState: CallState;
    transcript: TranscriptMessage[];
    currentResponder: ResponderType;
    error: string | null;
    startCall: () => void;
    endCall: () => void;
    toggleRecording: () => void;
    isRecording: boolean;
    isProcessing: boolean;
}

export function useCallState(): UseCallStateReturn {
    const [callState, setCallState] = useState<CallState>("idle");
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
    const [currentResponder, setCurrentResponder] = useState<ResponderType>("ai");
    const [error, setError] = useState<string | null>(null);

    const { isRecording, startRecording, stopRecording } = useAudioRecorder();
    const { play, stop: stopAudio, onEnded } = useAudioPlayer();

    const isProcessingRef = useRef(false);

    const addMessage = useCallback((role: "user" | "assistant" | "admin", content: string, responder: ResponderType = "ai") => {
        setTranscript((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                role,
                content,
                timestamp: new Date(),
                responder,
            },
        ]);
    }, []);

    const startCall = useCallback(() => {
        setCallState("connecting");
        setTranscript([]);
        setError(null);

        setTimeout(() => {
            setCallState("active");
            addMessage("assistant", "Xin chào! Tôi là trợ lý AI của cửa hàng. Tôi có thể giúp gì cho bạn?", "ai");
        }, 1000);
    }, [addMessage]);

    const endCall = useCallback(() => {
        stopAudio();
        setCallState("ended");
        setTimeout(() => setCallState("idle"), 2000);
    }, [stopAudio]);

    const processVoiceInput = useCallback(
        async (audioBlob: Blob) => {
            if (isProcessingRef.current) return;

            isProcessingRef.current = true;
            setCallState("processing");

            try {
                const response = await sendVoiceMessage(audioBlob);

                if (response.transcription) {
                    addMessage("user", response.transcription, "ai");
                }

                if (response.responseText) {
                    const responder = response.responder || "ai";
                    setCurrentResponder(responder);
                    addMessage(responder === "admin" ? "admin" : "assistant", response.responseText, responder);
                }

                if (response.audioBlob && response.audioBlob.size > 0) {
                    setCallState("speaking");
                    await play(response.audioBlob);
                }
            } catch (err) {
                setError("Có lỗi xảy ra. Vui lòng thử lại.");
                console.error("Voice processing error:", err);
                setCallState("active");
            } finally {
                isProcessingRef.current = false;
            }
        },
        [addMessage, play]
    );

    onEnded(() => {
        if (callState === "speaking") {
            setCallState("active");
        }
    });

    const toggleRecording = useCallback(async () => {
        if (isRecording) {
            const blob = await stopRecording();
            await processVoiceInput(blob);
        } else {
            setCallState("listening");
            await startRecording();
        }
    }, [isRecording, startRecording, stopRecording, processVoiceInput]);

    return {
        callState,
        transcript,
        currentResponder,
        error,
        startCall,
        endCall,
        toggleRecording,
        isRecording,
        isProcessing: callState === "processing",
    };
}
