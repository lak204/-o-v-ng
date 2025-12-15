import { motion } from "framer-motion";

interface ScoreBoardProps {
    scoreA: number;
    scoreB: number;
    currentTeam: 'A' | 'B';
}

export function ScoreBoard({ scoreA, scoreB, currentTeam }: ScoreBoardProps) {
    return (
        <>
            {/* Team A Score - Top Left */}
            <div className={`absolute top-4 left-4 z-40 transition-all duration-300 ${currentTeam === 'A' ? 'scale-110' : 'scale-95 opacity-80'}`}>
                <div className="bg-blue-600 rounded-2xl p-1 shadow-[0_6px_0_#1e3a8a] border-2 border-blue-900">
                    <div className="bg-blue-500 rounded-xl px-4 py-2 flex flex-col items-center min-w-[120px]">
                        <span className="text-blue-100 font-bold uppercase text-xs tracking-wider mb-1">Team A</span>
                        <motion.span
                            key={`a-${scoreA}`}
                            initial={{ scale: 1.5, color: '#fbbf24' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            className="text-4xl font-black font-mono drop-shadow-md"
                        >
                            {scoreA}
                        </motion.span>
                    </div>
                </div>
                {currentTeam === 'A' && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                        🔻
                    </div>
                )}
            </div>

            {/* Team B Score - Top Right */}
            <div className={`absolute top-4 right-4 z-40 transition-all duration-300 ${currentTeam === 'B' ? 'scale-110' : 'scale-95 opacity-80'}`}>
                <div className="bg-red-600 rounded-2xl p-1 shadow-[0_6px_0_#7f1d1d] border-2 border-red-900">
                    <div className="bg-red-500 rounded-xl px-4 py-2 flex flex-col items-center min-w-[120px]">
                        <span className="text-red-100 font-bold uppercase text-xs tracking-wider mb-1">Team B</span>
                        <motion.span
                            key={`b-${scoreB}`}
                            initial={{ scale: 1.5, color: '#fbbf24' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            className="text-4xl font-black font-mono drop-shadow-md"
                        >
                            {scoreB}
                        </motion.span>
                    </div>
                </div>
                {currentTeam === 'B' && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                        🔻
                    </div>
                )}
            </div>
        </>
    );
}
