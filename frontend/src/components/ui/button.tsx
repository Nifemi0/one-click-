import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function Button({ 
  className = "", 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-orange-500 text-white hover:bg-orange-600",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white",
    ghost: "text-white hover:bg-gray-800"
  };
  
  const sizeClasses = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 py-1.5",
    lg: "h-10 px-6 py-2"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
