// components/ui/badge.jsx
export default function Badge({ children, className = "", variant = "default" }) {
    const baseStyles = "px-2 py-1 rounded-full text-sm font-semibold";

    const variants = {
        default: "bg-gray-200 text-gray-800",
        secondary: "bg-blue-500 text-white",
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
