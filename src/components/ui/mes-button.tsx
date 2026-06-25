import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "md" | "sm" | "lg";

interface MesButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground active:bg-primary-hover disabled:opacity-50",
  secondary:
    "bg-blue-50 text-primary border border-blue-200 active:bg-blue-100 dark:bg-blue-950/40 dark:border-blue-900 dark:text-sky-300 dark:active:bg-blue-950/60",
  outline:
    "bg-surface text-foreground border border-border active:bg-secondary",
  ghost: "bg-transparent text-primary active:bg-blue-50 dark:active:bg-blue-950/40",
  danger:
    "bg-destructive text-destructive-foreground active:opacity-90",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-lg",
  md: "h-12 px-5 text-sm rounded-xl",
  lg: "h-14 px-6 text-base rounded-xl",
};

export const MesButton = forwardRef<HTMLButtonElement, MesButtonProps>(
  function MesButton(
    {
      variant = "primary",
      size = "md",
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      className = "",
      children,
      disabled,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`press inline-flex items-center justify-center gap-2 font-semibold transition ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...rest}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);
