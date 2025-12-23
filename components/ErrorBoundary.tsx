"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary Component
 * Menangkap error JavaScript di child components dan menampilkan fallback UI
 * yang ramah pengguna daripada crash seluruh aplikasi.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Update state sehingga render berikutnya menampilkan fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error ke console untuk debugging
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleRefresh = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback jika disediakan
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg-primary)]">
                    <div className="max-w-md w-full text-center">
                        {/* Glowing Effect */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl animate-pulse" />

                            <div className="relative p-8 rounded-2xl bg-[var(--bg-card)] border border-red-500/30 shadow-2xl">
                                {/* Icon */}
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30">
                                    <AlertTriangle className="w-10 h-10 text-red-400" />
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                                    Oops! Terjadi Kesalahan
                                </h1>

                                {/* Description */}
                                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                                    Maaf, terjadi kesalahan tak terduga. Tim kami telah diberitahu dan sedang memperbaikinya.
                                </p>

                                {/* Error Details (Development Only) */}
                                {process.env.NODE_ENV === "development" && this.state.error && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-left">
                                        <p className="text-xs font-mono text-red-400 break-all">
                                            {this.state.error.message}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={this.handleRefresh}
                                        className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Refresh Halaman
                                    </button>
                                    <button
                                        onClick={this.handleGoHome}
                                        className="px-6 py-3 rounded-xl font-bold text-[var(--text-primary)] bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Home className="w-4 h-4" />
                                        Ke Beranda
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Help Text */}
                        <p className="mt-6 text-sm text-[var(--text-secondary)]">
                            Jika masalah berlanjut, silakan hubungi admin desa.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * HOC untuk membungkus komponen dengan Error Boundary
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}

export default ErrorBoundary;
