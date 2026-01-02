interface AudioWaveformProps {
    isActive: boolean;
}

export function AudioWaveform({ isActive }: AudioWaveformProps) {
    if (!isActive) return null;

    return (
        <div className="flex items-center justify-center gap-1 h-8">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="w-1 bg-white/80 rounded-full animate-pulse"
                    style={{
                        height: `${Math.random() * 24 + 8}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: "0.5s",
                    }}
                />
            ))}
        </div>
    );
}
