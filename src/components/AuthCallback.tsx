import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Portal from '../data/auth/Portal';

export default function AuthCallback() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		const token = searchParams.get('token');
		const error = searchParams.get('error');

		if (error) {
			setStatus('error');
			setErrorMessage(error === 'access_denied' 
				? 'You cancelled the GitHub sign-in. Please try again.' 
				: `Authentication failed: ${error}`);
			return;
		}

		if (!token) {
			setStatus('error');
			setErrorMessage('No authentication token received. Please try signing in again.');
			return;
		}

		// Process the OAuth callback
		(async () => {
			const result = await Portal.processOAuthCallback(token);
			
			if (result.success && result.user) {
				setStatus('success');
				// Redirect to dashboard after a brief delay
				setTimeout(() => {
					navigate('/dashboard', { replace: true });
				}, 500);
			} else {
				setStatus('error');
				setErrorMessage(result.message || 'Failed to process authentication.');
			}
		})();
	}, [searchParams, navigate]);

	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
			<section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur p-6 sm:p-8 shadow-2xl">
				{status === 'loading' && (
					<div className="flex flex-col items-center justify-center space-y-4">
						<div className="w-12 h-12 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin"></div>
						<p className="text-slate-300 text-center">Processing your GitHub sign-in...</p>
					</div>
				)}

				{status === 'success' && (
					<div className="flex flex-col items-center justify-center space-y-4">
						<div className="w-12 h-12 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center">
							<svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
						</div>
						<p className="text-slate-300 text-center">Successfully signed in! Redirecting...</p>
					</div>
				)}

				{status === 'error' && (
					<div className="flex flex-col items-center justify-center space-y-4">
						<div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center">
							<svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
							</svg>
						</div>
						<p className="text-slate-300 text-center font-medium">{errorMessage}</p>
						<a
							href="/login"
							className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
						>
							Return to Sign In
						</a>
					</div>
				)}
			</section>
		</main>
	);
}
