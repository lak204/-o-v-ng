import { GameItem } from "@/lib/game-logic";
import { motion } from "framer-motion";
import { Gem } from "lucide-react";

interface ItemProps {
    item: GameItem;
}

export function Item({ item }: ItemProps) {

    const ValueBadge = () => (
        <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10 
          ${item.value === 0 ? 'bg-gray-700 text-gray-300' : 'bg-white text-black border border-yellow-600'}`}>
            {item.value}
        </span>
    );

    const renderVisual = () => {
        switch (item.type) {
            case 'gold-large':
                return (
                    <div className="relative">
                        <div className="w-16 h-14 md:w-20 md:h-16 bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#D4AF37] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-[#8a6e2f] shadow-[2px_2px_0px_rgba(0,0,0,0.2)] flex items-center justify-center">
                            <div className="absolute top-2 left-3 w-4 h-2 bg-white rounded-full opacity-40 blur-[1px]"></div>
                        </div>
                        <ValueBadge />
                    </div>
                );
            case 'gold-small':
                return (
                    <div className="relative">
                        <div className="w-10 h-8 md:w-12 md:h-10 bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#D4AF37] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] border-2 border-[#8a6e2f] shadow-[1px_1px_0px_rgba(0,0,0,0.2)]">
                            <div className="absolute top-1 left-2 w-2 h-1 bg-white rounded-full opacity-40 blur-[1px]"></div>
                        </div>
                        <ValueBadge />
                    </div>
                );
            case 'diamond':
                return (
                    <div className="relative">
                        <Gem className="w-10 h-10 md:w-12 md:h-12 text-cyan-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] fill-cyan-100 stroke-cyan-600 stroke-1" />
                        <ValueBadge />
                    </div>
                );
            case 'stone':
                return (
                    <div className="relative">
                        <div className="w-12 h-10 md:w-16 md:h-12 bg-[#808080] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] border-2 border-[#505050] flex items-center justify-center shadow-inner">
                            <div className="w-full h-full bg-gradient-to-b from-transparent to-black/20 rounded-[inherit]"></div>
                        </div>
                        <ValueBadge />
                    </div>
                );
            case 'mystery-bag':
                return (
                    <div className="relative">
                        <div className="w-12 h-14 md:w-14 md:h-16 bg-[#A52A2A] rounded-b-[40%] rounded-t-md border-2 border-[#5a1515] relative flex items-center justify-center shadow-lg">
                            <span className="text-yellow-200 font-bold text-xl drop-shadow-md">?</span>
                            <div className="absolute -top-1 w-full flex justify-center">
                                <div className="w-8 h-1.5 bg-[#FFD700] rounded-sm"></div>
                            </div>
                        </div>
                        {/* Mystery bag value hidden? Or shown? Usually hidden. User didn't specify, but implies value shown on Gold/Diamond. Let's hide for mystery. */}
                        {/* For consistency with user request "display random points on items", I will render it IF it's not a mystery bag. But Wait, user said "Gold 50-100, Diamond 100-150, Stone 0". Mystery bag wasn't clear. I'll hide it for mystery bag to keep it "Mystery". */}
                    </div>
                );
            default:
                return <div className="w-10 h-10 bg-gray-500"></div>;
        }
    };

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
            }}
        >
            <motion.div
                animate={{ rotate: item.rotation }}
                className="relative cursor-pointer transition-transform hover:scale-105"
            >
                {renderVisual()}
            </motion.div>
        </div>
    );
}
