import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) setError(error);
      else setSignupDone(true);
    }
    setLoading(false);
  }

  if (signupDone) {
    return (
      <div className="h-screen bg-[#050508] text-gray-100 flex items-center justify-center">
        <div className="max-w-sm text-center px-6">
          <h1 className="text-xl font-semibold mb-4">Check your email</h1>
          <p className="text-sm text-gray-400">
            We sent a confirmation link to <span className="text-gray-200">{email}</span>.
            Click the link to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050508] text-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-lg font-bold tracking-tight">LUMINA STUDIO</h1>
          <p className="text-xs text-gray-500 mt-1">AI Fashion Photography</p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full py-2.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600">or</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-cyan-500 text-gray-950 text-sm font-semibold hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-xs text-gray-500 mt-6">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button type="button" onClick={() => { setMode('signup'); setError(null); }} className="text-cyan-400 hover:underline">
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('login'); setError(null); }} className="text-cyan-400 hover:underline">
                Log in
              </button>
            </>
          )}
        </p>

        {/* Links */}
        <div className="text-center mt-8 flex flex-col gap-2">
          <a href="/pricing" className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">
            View Plans & Pricing →
          </a>
          <a href="/agency" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            View Model Agency →
          </a>
        </div>
      </div>
    </div>
  );
}
