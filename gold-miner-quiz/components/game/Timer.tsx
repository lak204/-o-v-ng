import { useEffect, useState } from "react";

interface TimerProps {
    duration: number;
    onTimeEnd: () => void;
    isActive: boolean;
}

export function Timer({ duration, onTimeEnd, isActive }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeEnd();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onTimeEnd]);

    return (
        <div className="absolute top-24 left-4 z-40">
            <div className="w-20 h-20 bg-white border-4 border-gray-700 rounded-full flex flex-col items-center justify-center shadow-xl">
                <span className="text-xs font-bold uppercase text-gray-500">Time</span>
                <span className={`text-4xl font-black ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
                    {timeLeft}
                </span>
            </div>
        </div>
    );
}
