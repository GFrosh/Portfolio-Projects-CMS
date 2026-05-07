import { useEffect, useState } from 'react';
import type { AuthCredentials, AuthSignUpData } from '../types/auth';
import Portal from '../data/auth/Portal';

interface LoginScreenProps {
    isSubmitting: boolean;
    error: string | null;
    onSignIn: (credentials: AuthCredentials) => Promise<void>;
    onSignUp: (data: AuthSignUpData) => Promise<void>;
    initialMode?: 'signin' | 'signup';
}

export default function LoginScreen({ isSubmitting, error, onSignIn, onSignUp, initialMode = 'signin' }: LoginScreenProps) {
	const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('gideononyegbula@example.com');
	const [password, setPassword] = useState('password123');

	useEffect(() => {
		setMode(initialMode);
	}, [initialMode]);

	const submit = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (mode === 'signup') {
			await onSignUp({ name, email, password });
			return;
		}
		await onSignIn({ email, password });
	};

	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
		<section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur p-6 sm:p-8 shadow-2xl">
			<h1 className="text-xl font-semibold text-white">Portfolio CMS</h1>
			<p className="text-sm text-slate-400 mt-2">
			{mode === 'signup' ? 'Create an account to start managing projects.' : 'Sign in to manage your portfolio projects.'}
			</p>

			<div className="mt-4 grid grid-cols-2 rounded-lg border border-slate-800 bg-slate-950/60 p-1">
			<button
				type="button"
				onClick={() => setMode('signin')}
				className={`px-3 py-1.5 rounded-md text-sm transition-colors ${mode === 'signin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
			>
				Sign In
			</button>
			<button
				type="button"
				onClick={() => setMode('signup')}
				className={`px-3 py-1.5 rounded-md text-sm transition-colors ${mode === 'signup' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
			>
				Sign Up
			</button>
			</div>

			<form onSubmit={submit} className="mt-6 space-y-4">
			{mode === 'signup' && (
				<div>
				<label className="block text-xs text-slate-400 mb-1.5" htmlFor="name">
					Name
				</label>
				<input
					id="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-brand-500 text-sm text-slate-100 outline-none transition-colors"
					required={mode === 'signup'}
				/>
				</div>
			)}

			<div>
				<label className="block text-xs text-slate-400 mb-1.5" htmlFor="email">
				Email
				</label>
				<input
				id="email"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-brand-500 text-sm text-slate-100 outline-none transition-colors"
				required
				/>
			</div>

			<div>
				<label className="block text-xs text-slate-400 mb-1.5" htmlFor="password">
				Password
				</label>
				<input
				id="password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-brand-500 text-sm text-slate-100 outline-none transition-colors"
				required
				/>
			</div>

			{error && <p className="text-sm text-red-400">{error}</p>}

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
			>
				{isSubmitting ? 'Submitting...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
			</button>
			</form>

			<div className="mt-6 relative">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-slate-700"></div>
				</div>
				<div className="relative flex justify-center text-xs">
					<span className="px-2 bg-slate-900 text-slate-400">Or continue with GitHub</span>
				</div>
			</div>

			<a
				href={Portal.getGitHubLoginUrl()}
				className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-950/50 hover:bg-slate-900 text-slate-200 text-sm font-medium transition-colors gap-2"
			>
				<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.557.636-1.914-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.270.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.194 20 14.440 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
				</svg>
				Sign in with GitHub
			</a>

			<div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400 space-y-1">
			<p>Demo User: user@portfolio.local / user123</p>
			<p>You can also create a new account from Sign Up.</p>
			</div>
		</section>
		</main>
	);
}
