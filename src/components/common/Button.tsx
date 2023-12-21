import Link from "next/link";
import { twMerge } from "tailwind-merge";

type ButtonColors = "primary" | "success" | "dark" | "danger";
type ButtonVariants = "normal" | "rounded" | "roundedFull";

const buttonColors: Record<ButtonColors, string> = {
    primary: "bg-primary text-white font-medium hover:bg-opacity-90",
    success: "bg-meta-3 text-white font-medium hover:bg-opacity-90",
    dark: "bg-black text-white font-medium hover:bg-opacity-90",
    danger: "bg-danger text-white font-semibold hover:bg-danger-hover",
};

const buttonVariants: Record<ButtonVariants, string> = {
    normal: "",
    rounded: "rounded",
    roundedFull: "rounded-full",
};

type ButtonSizes = "small" | "medium" | "large";

const buttonSizes: Record<ButtonSizes, string> = {
    small: "px-4 py-2",
    medium: "px-6 py-3",
    large: "px-8 py-4",
};

interface ButtonProps {
    color?: ButtonColors;
    variant?: ButtonVariants;
    size?: ButtonSizes;
    href?: string;
    newTab?: boolean;
    isLoading?: boolean;
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const Button = ({
    color = "primary",
    variant = "normal",
    size = "medium",
    href,
    newTab = false,
    isLoading = false,
    className = "",
    onClick,
    children,
}: ButtonProps) => {
    let target;
    if (newTab) {
        target = "_blank";
    }
    if (href) {
        return (
            <Link
                href={href}
                target={target}
                className={twMerge(
                    `${buttonColors[color]} ${buttonVariants[variant]} ${buttonSizes[size]} ${className} transition-all duration-500`
                )}
            >
                {children}
            </Link>
        );
    }
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={twMerge(
                `${buttonVariants[variant]} ${buttonSizes[size]} ${className} ${
                    isLoading
                        ? "bg-body border-body cursor-not-allowed"
                        : buttonColors[color]
                } flex items-center justify-center transition-all duration-500 capitalize`
            )}
        >
            {isLoading ? (
                <div className="w-6 h-6 border-4 border-bodydark1 rounded-full flex items-center justify-center border-t-4 border-t-white animate-spin" />
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
