import { cn } from "@/src/lib/utils"
import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "coral" | "seafoam" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", loading = false, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          // Sizes
          size === "sm" && "px-3 py-2 text-sm",
          size === "md" && "px-4 py-2.5 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          // Variants
          variant === "primary" && "ocean-gradient text-white hover:shadow-lg focus:ring-ocean-500 shadow-md",
          variant === "secondary" && "bg-ocean-100 text-ocean-700 hover:bg-ocean-200 focus:ring-ocean-500",
          variant === "coral" && "coral-gradient text-white hover:shadow-lg focus:ring-coral-500 shadow-md",
          variant === "seafoam" && "seafoam-gradient text-white hover:shadow-lg focus:ring-seafoam-500 shadow-md",
          variant === "outline" && "border-2 border-ocean-500 text-ocean-600 hover:bg-ocean-50 focus:ring-ocean-500",
          variant === "ghost" && "text-ocean-600 hover:bg-ocean-50 focus:ring-ocean-500",
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
