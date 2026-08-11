import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:bg-primary/90 active:translate-y-px",
        secondary: "bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-background px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "min-h-6 px-0 py-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "text-sm",
        sm: "min-h-9 rounded-lg px-3 text-xs",
        lg: "min-h-12 px-5 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, variant, size, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
