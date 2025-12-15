"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GameItem, HOOK_SPEED, HOOK_RETURN_SPEED_FAST, HOOK_RETURN_SPEED_SLOW, generateItems, GAME_DURATION } from "@/lib/game-logic";
import { questions } from "@/data/questions";
import { Item } from "@/components/game/item";
import { motion } from "framer-motion";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { Timer } from "@/components/game/Timer";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import canvasConfetti from "canvas-confetti";

export default function GamePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    // Game State
    const [items, setItems] = useState<GameItem[]>([]);
    // Load items on mount to ensure hydration match
    useEffect(() => {
        setItems(generateItems());
    }, []);

    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');
    const [gameStatus, setGameStatus] = useState<'playing' | 'paused' | 'gameover'>('playing');

    // Hook State
    const [angle, setAngle] = useState(0);
    const [hookLen, setHookLen] = useState(100);
    const [hookState, setHookState] = useState<'rotate' | 'shoot' | 'rewind'>('rotate');
    const [caughtItem, setCaughtItem] = useState<GameItem | null>(null);
    const angleDirection = useRef(1);

    // Question State
    const [showQuestion, setShowQuestion] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
    const [pendingScore, setPendingScore] = useState(0);

    // Constants
    const MIN_ANGLE = -70;
    const MAX_ANGLE = 70;
    const ROTATION_SPEED = 0.8;
    const MAX_LEN = 1000;

    // Update container size on resize
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Game Loop
    useEffect(() => {
        if (gameStatus !== 'playing') return;

        let animationFrameId: number;

        const loop = () => {
            if (hookState === 'rotate') {
                setAngle(prev => {
                    let next = prev + ROTATION_SPEED * angleDirection.current;
                    if (next >= MAX_ANGLE) { next = MAX_ANGLE; angleDirection.current = -1; }
                    if (next <= MIN_ANGLE) { next = MIN_ANGLE; angleDirection.current = 1; }
                    return next;
                });
            } else if (hookState === 'shoot') {
                setHookLen(prev => {
                    const next = prev + HOOK_SPEED;

                    // Collision Logic using real Pixel Coordinates
                    const rad = (angle * Math.PI) / 180;

                    // Hook Origin in Pixels (Relative to Container)
                    // Origin is at 50% width, and roughly 15vh from top (top-[15vh] is ground start, miner is at top-[8vh])
                    // To be precise, let's look at the Hook Line render position:
                    // absolute top-[80px] left-1/2
                    // We need to match that.
                    // Note: top-[8vh] is container relative if container is screen.
                    // Let's assume containerRef is the full screen div.
                    const originX = containerSize.width * 0.5;
                    const originY = (containerSize.height * 0.08) + 80; // 8vh + 80px offset in CSS? 
                    // Wait, CSS says: top-[8vh] ... then inner div mechanism ... then absolute top-[80px].
                    // Let's refine originY based on visual approximation or specific element measure if possible.
                    // Simpler: 8vh is approx 8% height. + 80px.

                    const actualOriginY = (containerSize.height * 0.08) + 80;

                    const tipX = originX + (next * Math.sin(rad));
                    const tipY = actualOriginY + (next * Math.cos(rad));

                    // Check collision vs Items (also in Pixels)
                    const hitItem = items.find(item => {
                        const itemX = (item.x / 100) * containerSize.width;
                        const itemY = (item.y / 100) * containerSize.height;

                        // Distance check - Hitbox radius approx 30px
                        const dist = Math.sqrt(Math.pow(itemX - tipX, 2) + Math.pow(itemY - tipY, 2));
                        return dist < 40; // 40px radius tolerance
                    });

                    if (hitItem) {
                        setCaughtItem(hitItem);
                        setHookState('rewind');
                        setItems(prev => prev.filter(i => i.id !== hitItem.id));
                        return next;
                    }

                    // Bounds check
                    if (tipX < 0 || tipX > containerSize.width || tipY > containerSize.height || next > MAX_LEN) {
                        setHookState('rewind');
                    }
                    return next;
                });
            } else if (hookState === 'rewind') {
                setHookLen(prev => {
                    const weightMod = caughtItem ? caughtItem.weight : 0;
                    const actualSpeed = Math.max(2, HOOK_RETURN_SPEED_FAST - weightMod);

                    const next = prev - actualSpeed;
                    if (next <= 100) {
                        // Returned to top
                        if (caughtItem) {
                            if (caughtItem.value > 0 || caughtItem.type === 'mystery-bag') {
                                handleItemCaught(caughtItem);
                            } else {
                                // Stone caught (0 points)
                                setGameStatus('playing');
                                setHookState('rotate');
                                switchTurn();
                            }
                        } else {
                            // Missed shot
                            setHookState('rotate');
                            switchTurn();
                        }
                        setCaughtItem(null);
                        return 100;
                    }
                    return next;
                });
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [hookState, gameStatus, items, angle, caughtItem, containerSize]);

    const handleShoot = () => {
        if (hookState === 'rotate') {
            setHookState('shoot');
        }
    };

    const handleItemCaught = (item: GameItem) => {
        setPendingScore(item.value);
        setGameStatus('paused');
        setShowAnswer(false);

        const randomQ = questions[Math.floor(Math.random() * questions.length)];
        setCurrentQuestion(randomQ);
        setShowQuestion(true);
    };

    const handleAnswer = (correct: boolean) => {
        if (correct) {
            canvasConfetti();
            if (currentTeam === 'A') setScoreA(s => s + pendingScore);
            else setScoreB(s => s + pendingScore);
        } else {
            // Wrong answer feedback could go here if needed (e.g. sound)
        }

        setShowQuestion(false);
        setGameStatus('playing');
        setHookState('rotate');
        switchTurn();

        if (items.length === 0) {
            setGameStatus('gameover');
        }
    };

    const switchTurn = () => {
        setCurrentTeam(prev => prev === 'A' ? 'B' : 'A');
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FDF6E3] overflow-hidden relative select-none font-sans">
            {/* Game Header Area */}
            <div className="absolute top-0 w-full h-[15vh] bg-[#FFCC66] z-0 border-b-[6px] border-[#8B4513] shadow-lg flex items-center justify-between px-8">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200 to-orange-400"></div>
            </div>

            {/* Background Ground */}
            <div className="absolute top-[15vh] w-full h-[85vh] bg-[#F4E4BC] z-0">
                <div className="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]"></div>
                {/* Underground layers decorations */}
                <div className="absolute bottom-0 w-full h-32 bg-[#E6D2A0] transform skew-y-1 opacity-50"></div>
            </div>

            {/* ScoreBoard - Adjusted to top corners to clear center */}
            <ScoreBoard scoreA={scoreA} scoreB={scoreB} currentTeam={currentTeam} />
            <Timer duration={GAME_DURATION} onTimeEnd={() => setGameStatus('gameover')} isActive={gameStatus === 'playing'} />

            {/* Miner / Hook Origin - Centered */}
            <div className="absolute top-[8vh] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                {/* Miner Character */}
                <div className="relative z-20 mb-[-10px]">
                    <div className="text-6xl md:text-7xl filter drop-shadow-xl animate-bounce-slow">👷</div>
                </div>

                {/* Mechanism */}
                <div className="w-20 h-20 bg-[#333] rounded-full border-8 border-gray-500 flex items-center justify-center relative shadow-2xl">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-spin-slow"></div>
                </div>

                {/* The Hook Line */}
                <div className="absolute top-[80px] left-1/2 w-0 h-0 z-10">
                    <div
                        className="absolute top-0 left-0 w-1.5 bg-black origin-top shadow-sm"
                        style={{
                            height: `${hookLen}px`,
                            transform: `rotate(${angle}deg)`
                        }}
                    >
                        {/* Hook Head */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                            {/* Simple Hook SVG or CSS shape */}
                            <div className="relative">
                                <div className="w-8 h-8 border-b-[6px] border-r-[6px] border-[#333] rounded-br-3xl transform rotate-45"></div>
                            </div>
                        </div>

                        {/* Caught Item */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-8">
                            {caughtItem && (
                                <div className="transform scale-75 origin-top drop-shadow-2xl">
                                    <Item item={{ ...caughtItem, x: 0, y: 0, rotation: 0 }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Click Area */}
            <div
                className="absolute inset-0 z-10 cursor-crosshair"
                onClick={handleShoot}
            ></div>

            {/* Items */}
            {items.map(item => <Item key={item.id} item={item} />)}

            {/* Question Modal */}
            <Modal isOpen={showQuestion} title="Question Time" color={currentTeam === 'A' ? 'blue' : 'red'}>
                <div className="text-center space-y-6">
                    <h3 className="text-xl font-medium text-gray-500 uppercase tracking-widest mb-2">Team {currentTeam} is answering</h3>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800">{currentQuestion.question}</p>

                    {/* Step 1: Show Answer Button */}
                    {!showAnswer && (
                        <div className="py-8">
                            <Button size="lg" variant="secondary" onClick={() => setShowAnswer(true)}>
                                Show Answer 👁️
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Answer Revealed & Grading */}
                    {showAnswer && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400 text-left">
                                <span className="text-xs font-bold text-yellow-600 uppercase">Correct Answer</span>
                                <p className="text-xl font-bold text-gray-900 mt-1">{currentQuestion.answer}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <Button variant="danger" size="lg" className="w-full" onClick={() => handleAnswer(false)}>
                                    Wrong ❌
                                </Button>
                                <Button variant="success" size="lg" className="w-full" onClick={() => handleAnswer(true)}>
                                    Correct ✅
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </Modal>

            {/* Game Over Modal handled same as before... */}
            <Modal isOpen={gameStatus === 'gameover'} title="Mission Complete" color="yellow">
                <div className="text-center space-y-6">
                    <div className="text-6xl">🏆</div>
                    <h2 className="text-4xl font-black text-amber-900">
                        {scoreA > scoreB ? 'TEAM A WINS!' : (scoreB > scoreA ? 'TEAM B WINS!' : 'IT\'S A TIE!')}
                    </h2>
                    <div className="flex justify-center gap-12 text-3xl font-bold bg-white/50 p-6 rounded-xl">
                        <div className="text-blue-600 flex flex-col">
                            <span className="text-sm text-gray-500 uppercase">Team A</span>
                            {scoreA}
                        </div>
                        <div className="text-red-600 flex flex-col">
                            <span className="text-sm text-gray-500 uppercase">Team B</span>
                            {scoreB}
                        </div>
                    </div>
                    <Button size="lg" onClick={() => window.location.reload()}>Play Again 🔄</Button>
                </div>
            </Modal>

        </div>
    );
}
