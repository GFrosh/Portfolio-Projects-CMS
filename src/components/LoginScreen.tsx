import { useEffect, useState } from 'react';
import type { AuthCredentials, AuthSignUpData } from '../types/auth';

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

			<div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400 space-y-1">
			<p>Demo User: user@portfolio.local / user123</p>
			<p>You can also create a new account from Sign Up.</p>
			</div>
		</section>
		</main>
	);
}
