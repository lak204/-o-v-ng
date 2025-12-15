import { X } from "lucide-react";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    children: ReactNode;
    title?: string;
    color?: "blue" | "red" | "green" | "yellow";
}

export function Modal({ isOpen, onClose, children, title, color = "blue" }: ModalProps) {
    const colorClasses = {
        blue: "bg-blue-600 border-blue-800",
        red: "bg-red-600 border-red-800",
        green: "bg-green-600 border-green-800",
        yellow: "bg-yellow-500 border-yellow-700 text-yellow-950",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className={`w-full max-w-lg rounded-xl border-4 shadow-2xl overflow-hidden ${colorClasses[color]} text-white`}
                    >
                        {(title || onClose) && (
                            <div className="flex items-center justify-between p-4 border-b border-white/20">
                                {title && <h2 className="text-2xl font-black uppercase tracking-wide">{title}</h2>}
                                {onClose && (
                                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="p-6 bg-white text-slate-800 font-medium text-lg">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
