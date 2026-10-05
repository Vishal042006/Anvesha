import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f1d] text-gray-100 flex items-center justify-center p-6 font-sans">
          <div className="glass-panel p-8 rounded-xl border border-rose-500/40 bg-rose-950/20 max-w-lg w-full space-y-4 text-center">
            <AlertOctagon className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              ANVESHA Research Terminal Telemetry Error
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              An unexpected UI component error occurred while rendering this module.
            </p>
            {this.state.error && (
              <div className="bg-gray-900 p-3 rounded border border-gray-800 font-mono text-[11px] text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Research Module</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
