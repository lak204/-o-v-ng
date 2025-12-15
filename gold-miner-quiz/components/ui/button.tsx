import clsx from "clsx";
import { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "sm" | "md" | "lg";
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
    const variants = {
        primary: "bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 text-white",
        secondary: "bg-gray-500 hover:bg-gray-600 border-b-4 border-gray-800 active:border-b-0 active:translate-y-1 text-white",
        success: "bg-green-500 hover:bg-green-600 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 text-white",
        danger: "bg-red-500 hover:bg-red-600 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 text-white",
    };

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-6 py-2 text-base",
        lg: "px-8 py-3 text-xl",
    };

    return (
        <button
            className={clsx(
                "rounded-xl font-bold transition-all outline-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
