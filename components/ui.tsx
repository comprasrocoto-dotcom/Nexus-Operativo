import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
  {
        variants: {
                variant: {
                  default: "bg-primary text-white shadow-soft hover:bg-orange-600 active:scale-[0.98]",
                          secondary: "bg-secondary text-white shadow-soft hover:bg-blue-700 active:scale-[0.98]",
                          outline: "border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
                          ghost: "hover:bg-slate-100 dark:hover:bg-slate-800",
                          success: "bg-success text-white hover:bg-green-600",
                },
                size: {
                  default: "h-10 px-4 py-2",
                          sm: "h-8 px-3 text-xs",
                          lg: "h-12 px-6 text-base",
                          icon: "h-10 w-10",
                },
        },
        defaultVariants: { variant: "default", size: "default" },
  }
  );

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
          <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
        )
  );
Button.displayName = "Button";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
          <div
                  className={cn(
                            "rounded-2xl border border-slate-200/70 bg-white shadow-soft transition-shadow hover:shadow-soft-lg dark:border-slate-800 dark:bg-slate-900",
                            className
                          )}
            {...props}
                />
        );
}

type BadgeVariant = "default" | "success" | "warning" | "danger" | "secondary" | "muted";

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    success: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    secondary: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    muted: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function Badge({
    className,
    variant = "default",
    ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
    return (
          <span
                  className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            badgeStyles[variant],
                            className
                          )}
            {...props}
                />
        );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
          <input
                  ref={ref}
                  className={cn(
                            "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
                            className
                          )}
            {...props}
                />
        )
  );
Input.displayName = "Input";
