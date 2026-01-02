"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioPlayerReturn {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    play: (audioBlob: Blob) => Promise<void>;
    stop: () => void;
    onEnded: (callback: () => void) => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const onEndedCallbackRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        audioRef.current = new Audio();

        audioRef.current.onended = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            onEndedCallbackRef.current?.();
        };

        audioRef.current.ontimeupdate = () => {
            setCurrentTime(audioRef.current?.currentTime || 0);
        };

        audioRef.current.onloadedmetadata = () => {
            setDuration(audioRef.current?.duration || 0);
        };

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    const play = useCallback(async (audioBlob: Blob) => {
        if (!audioRef.current) return;

        const url = URL.createObjectURL(audioBlob);
        audioRef.current.src = url;

        try {
            await audioRef.current.play();
            setIsPlaying(true);
        } catch (err) {
            console.error("Error playing audio:", err);
        }
    }, []);

    const stop = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
    }, []);

    const onEnded = useCallback((callback: () => void) => {
        onEndedCallbackRef.current = callback;
    }, []);

    return {
        isPlaying,
        currentTime,
        duration,
        play,
        stop,
        onEnded,
    };
}
