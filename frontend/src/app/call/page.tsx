"use client";

import { useCallState } from "@/hooks";
import { CallDialer, CallScreen } from "@/components/call";

export default function CallPage() {
    const { callState, transcript, currentResponder, isRecording, startCall, endCall, toggleRecording } = useCallState();

    const showDialer = callState === "idle" || callState === "connecting";

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
            {showDialer ? (
                <CallDialer onStartCall={startCall} isConnecting={callState === "connecting"} />
            ) : (
                <CallScreen
                    callState={callState}
                    transcript={transcript}
                    currentResponder={currentResponder}
                    isRecording={isRecording}
                    onToggleRecording={toggleRecording}
                    onEndCall={endCall}
                />
            )}
        </main>
    );
}
