import { Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GenerationPage from './pages/GenerationPage';
import AgencyPage from './pages/AgencyPage';

// ─── Error Boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-[#050508] text-gray-100 flex items-center justify-center">
          <div className="max-w-md text-center px-6">
            <h1 className="text-xl font-semibold mb-4">Something went wrong</h1>
            <p className="text-sm text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-lg bg-cyan-500 text-gray-950 text-sm font-semibold hover:bg-cyan-400 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GenerationPage />} />
          <Route path="/agency" element={<AgencyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
