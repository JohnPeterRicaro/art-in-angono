import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default: "bg-[#000000] text-white shadow hover:bg-gray-800 lol",
        orange:
          "bg-dd-dark-orange text-white shadow hover:bg-dd-dark-orange/90",
        destructive:
          "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outlineDestructive:
          "bg-white text-red-700 shadow-red-200 shadow-[0px_1px_2px_0px] hover:bg-red-300/50 border border-red-300 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outlinePrimary:
          "bg-white text-primary shadow-sm border-[1px] border-primary",
        outline:
          "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
        success: "text-white bg-success",
        warning:
          "bg-[#D30D14] text-white shadow-sm hover:bg-[#D30D14]/70 dark:bg-[#D30D14] dark:text-white dark:hover:bg-[#D30D14]/90",
        "gradient-primary":
          "bg-gradient-to-r from-fusion-800 to-fusion-400 hover:from-fusion-900 hover:to-fusion-600 transition-all",
      },
      size: {
        xs: "h-5 rounded-[4px] text-xs p-[4px]",
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    if (loading) {
      return <Skeleton className={"w-full rounded-[8px] h-9"} />;
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
