"use client";

import { PhoneOff, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CallStatus } from "./CallStatus";
import { TranscriptView } from "./TranscriptView";
import { AudioWaveform } from "./AudioWaveform";
import { ResponderIndicator } from "./ResponderIndicator";
import { CallState, TranscriptMessage, ResponderType } from "@/types";

interface CallScreenProps {
    callState: CallState;
    transcript: TranscriptMessage[];
    currentResponder: ResponderType;
    isRecording: boolean;
    onToggleRecording: () => void;
    onEndCall: () => void;
}

export function CallScreen({ callState, transcript, currentResponder, isRecording, onToggleRecording, onEndCall }: CallScreenProps) {
    const isActive = callState !== "ended";

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden">
            {/* Header - AI Avatar and Status */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-center text-white">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/30">
                    <AvatarFallback className="bg-white/20 text-3xl">AI</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">Trợ lý AI</h2>
                <CallStatus state={callState} />

                {/* Responder Indicator */}
                {callState === "speaking" && (
                    <div className="mt-2 flex justify-center">
                        <ResponderIndicator responder={currentResponder} className="text-white/80" />
                    </div>
                )}

                {/* Audio Waveform Visualization */}
                {(isRecording || callState === "speaking") && (
                    <div className="mt-4">
                        <AudioWaveform isActive={isRecording || callState === "speaking"} />
                    </div>
                )}
            </div>

            {/* Transcript Area */}
            <div className="h-64 overflow-hidden">
                <TranscriptView messages={transcript} />
            </div>

            {/* Control Buttons */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-center gap-4">
                {/* Mic Button */}
                <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className={`w-16 h-16 rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"}`}
                    onClick={onToggleRecording}
                    disabled={callState === "processing" || callState === "speaking"}
                >
                    {callState === "processing" ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : isRecording ? (
                        <MicOff className="h-6 w-6" />
                    ) : (
                        <Mic className="h-6 w-6" />
                    )}
                </Button>

                {/* End Call Button */}
                <Button size="lg" variant="destructive" className="w-16 h-16 rounded-full" onClick={onEndCall} disabled={!isActive}>
                    <PhoneOff className="h-6 w-6" />
                </Button>
            </div>
        </Card>
    );
}
