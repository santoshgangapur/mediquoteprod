import React, { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React render:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f3faff] flex items-center justify-center p-6 text-[#071e27] font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#c3c6d4] p-8 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-[#003178]/10 rounded-2xl flex items-center justify-center mx-auto text-[#003178]">
              <span className="material-symbols-outlined text-[32px]">health_and_safety</span>
            </div>
            <h1 className="text-[20px] font-black text-[#071e27]">MediQuote AI Ready</h1>
            <p className="text-[13px] text-[#434652] leading-relaxed">
              The application encountered a transient loading state. Please refresh or click reset to reload the latest clinical interface.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                try {
                  window.location.reload();
                } catch {
                  window.location.href = '/';
                }
              }}
              className="w-full py-3 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[14px] rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Reload MediQuote AI</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
