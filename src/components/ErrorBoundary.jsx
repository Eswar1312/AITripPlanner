import { Component } from 'react';
import { FiAlertOctagon, FiHome, FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Talk2Trip ErrorBoundary]', error, errorInfo);
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#070b16] px-4 py-12 text-white">
          <div className="glass-strong w-full max-w-lg rounded-[28px] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
              <FiAlertOctagon className="text-3xl" />
            </div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Something went wrong</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 dark:text-white/70">
              An unexpected error occurred in Talk2Trip. Don't worry, your data is safe.
            </p>
            {this.state.error?.message && (
              <p className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-200 font-mono text-left break-words">
                {this.state.error.message}
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn-primary flex-1 !py-3"
              >
                <FiHome />
                Back to Home Page
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-ghost flex-1 !py-3"
              >
                <FiRefreshCw />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
