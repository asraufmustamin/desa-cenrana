"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

/**
 * Form Components
 * ===============
 * 
 * Reusable form components dengan styling konsisten
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | null;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            w-full px-4 py-3 rounded-xl
                            bg-[var(--bg-panel)] text-[var(--text-primary)]
                            border border-[var(--border-color)]
                            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                            placeholder:text-[var(--text-secondary)]
                            transition-all outline-none
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${leftIcon ? "pl-10" : ""}
                            ${rightIcon ? "pr-10" : ""}
                            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
                            ${className}
                        `}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                {hint && !error && <p className="mt-1 text-sm text-[var(--text-secondary)]">{hint}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string | null;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
                        w-full px-4 py-3 rounded-xl
                        bg-[var(--bg-panel)] text-[var(--text-primary)]
                        border border-[var(--border-color)]
                        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                        placeholder:text-[var(--text-secondary)]
                        transition-all outline-none resize-none
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                {hint && !error && <p className="mt-1 text-sm text-[var(--text-secondary)]">{hint}</p>}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string | null;
    hint?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, hint, options, placeholder, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
                        w-full px-4 py-3 rounded-xl
                        bg-[var(--bg-panel)] text-[var(--text-primary)]
                        border border-[var(--border-color)]
                        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
                        transition-all outline-none
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
                        ${className}
                    `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                {hint && !error && <p className="mt-1 text-sm text-[var(--text-secondary)]">{hint}</p>}
            </div>
        );
    }
);
Select.displayName = "Select";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", loading, leftIcon, rightIcon, children, className = "", disabled, ...props }, ref) => {
        const variantStyles = {
            primary: "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90",
            secondary: "bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-opacity-80",
            danger: "bg-red-500 text-white hover:bg-red-600",
            ghost: "bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-panel)]",
        };

        const sizeStyles = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2.5 text-base",
            lg: "px-6 py-3.5 text-lg",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={`
                    inline-flex items-center justify-center gap-2 font-bold rounded-xl
                    transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${variantStyles[variant]}
                    ${sizeStyles[size]}
                    ${className}
                `}
                {...props}
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : leftIcon}
                {children}
                {!loading && rightIcon}
            </button>
        );
    }
);
Button.displayName = "Button";
