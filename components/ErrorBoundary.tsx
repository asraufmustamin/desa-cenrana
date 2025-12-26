"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Error Boundary Component
 * ========================
 * 
 * Catch JavaScript errors di child components
 */

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error
        console.error("Error caught by ErrorBoundary:", error, errorInfo);

        // Call custom error handler
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                        Terjadi Kesalahan
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-4 max-w-sm">
                        Maaf, terjadi kesalahan saat memuat halaman ini.
                        Silakan coba lagi atau hubungi admin jika masalah berlanjut.
                    </p>
                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <pre className="text-xs text-red-400 bg-red-500/10 p-4 rounded-lg mb-4 max-w-full overflow-x-auto">
                            {this.state.error.message}
                        </pre>
                    )}
                    <button
                        onClick={this.handleRetry}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

/**
 * Hook untuk error handling dalam async functions
 */
export function withErrorHandler<T>(
    fn: () => Promise<T>,
    onError?: (error: Error) => void
): Promise<T | null> {
    return fn().catch((error: Error) => {
        console.error("Async error:", error);
        onError?.(error);
        return null;
    });
}
