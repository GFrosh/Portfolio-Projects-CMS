'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './PortDeck.module.css';
import { signUp } from '@/utils/auth';
import { signIn, useSession } from 'next-auth/react'; // Cleaned client-side imports
import { GitHubLoginButton } from '@/components/SignIn';

interface AuthShellProps {
	mode: 'signin' | 'signup';
}

export default function AuthShell({ mode }: AuthShellProps) {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('user@portdeck.local');
	const [password, setPassword] = useState('password123');
	const [error, setError] = useState('');
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	// Handle automated redirection if already logged in
	useEffect(() => {
		if (status === 'loading') {
			setIsAuthenticating(true);
			return;
		}

		if (status === 'authenticated' && session?.user) {
			router.replace('/dashboard');
		} else {
			setIsAuthenticating(false);
		}
	}, [status, session, router]);

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setIsAuthenticating(true);

		try {
			if (mode === 'signup') {
				const ok = await signUp({ name, email, password });
				if (ok) {
					router.replace('/dashboard');
				} else {
					setError('Sign up failed. Please check your credentials.');
					setIsAuthenticating(false);
				}
			} else {
				// Handle Credentials login or standard action fallback
				const result = await signIn('credentials', {
					email,
					password,
					redirect: false,
				});

				if (result?.error) {
					setError('Invalid email or password.');
					setIsAuthenticating(false);
				} else {
					router.replace('/dashboard');
				}
			}
		} catch (err) {
			setError('An unexpected authentication error occurred.');
			setIsAuthenticating(false);
		}
	};

	return (
		<main className={styles.authLayout}>
			<aside className={styles.authAside}>
				<div className={styles.authAsideBackdrop}>
					<div className={styles.authGlow1} />
					<div className={styles.authGlow2} />
					<div className={styles.authGlow3} />
				</div>

				<div className={styles.authBrand}>
					<LogoMark />
					<div>
						<p className={styles.authBrandName}>PortDeck</p>
						<p className={styles.authBrandMeta}>Portfolio CMS · v2</p>
					</div>
				</div>

				<div className={styles.authIntro}>
					<p className={styles.authKicker}>Ship your work · fast</p>
					<h2 className={styles.authTitle}>
						A quiet, focused home for <span className={styles.textGradient}>every project</span> you ship.
					</h2>
					<p className={styles.authCopy}>
						Create, curate, and publish your portfolio in a clean, backend-first CMS. Import from GitHub, tag your stack, and expose ready-to-use REST endpoints for your public site.
					</p>

					<ul className={styles.authFeatureList}>
						{[
							'GitHub import — auto-fills metadata from any repo',
							'Draft, publish, archive — clean lifecycle',
							'REST endpoints for your public portfolio',
						].map((item) => (
							<li key={item} className={styles.authFeatureItem}>
								<span className={styles.authFeatureIcon}>
									<CheckIcon />
								</span>
								<span style={{ color: 'var(--color-ink-200)' }}>{item}</span>
							</li>
						))}
					</ul>
				</div>

				<p className={styles.authAsideFooter}>
					© {new Date().getFullYear()} PortDeck. Backend-first portfolio manager.
				</p>
			</aside>

			<section className={styles.authMain}>
				<div className={styles.authMainInner}>
					<div className={styles.authMobileBrand}>
						<LogoMark />
						<p className={styles.authBrandName}>PortDeck</p>
					</div>

					<div className={`${styles.authCard} ${styles.glassStrong} ${styles.shadowCard}`}>
						<div className={styles.authCardHeader}>
							<h1 className={styles.authCardTitle}>
								{mode === 'signup' ? 'Create your account' : 'Welcome back'}
							</h1>
						</div>
						<p className={styles.authCardSubtitle}>
							{mode === 'signup'
								? 'Start managing your portfolio projects in minutes.'
								: 'Sign in to continue to your dashboard.'}
						</p>

						<div className={styles.authModeSwitcher}>
							<Link
								href="/login"
								className={`${styles.authModeLink} ${mode === 'signin' ? styles.authModeLinkActive : styles.authModeLinkInactive}`}
							>
								Sign In
							</Link>
							<Link
								href="/signup"
								className={`${styles.authModeLink} ${mode === 'signup' ? styles.authModeLinkActive : styles.authModeLinkInactive}`}
							>
								Sign Up
							</Link>
						</div>

						<form onSubmit={handleSubmit} className={styles.authForm}>
							{mode === 'signup' && (
								<TextField
									label="Name"
									id="name"
									type="text"
									value={name}
									onChange={setName}
									required
									placeholder="Ada Lovelace"
								/>
							)}
							<TextField
								label="Email"
								id="email"
								type="email"
								value={email}
								onChange={setEmail}
								required
								placeholder="you@portdeck.local"
							/>
							<TextField
								label="Password"
								id="password"
								type="password"
								value={password}
								onChange={setPassword}
								required
								placeholder="••••••••"
							/>

							{error && <div className={styles.authError}>{error}</div>}

							<button
								type="submit"
								disabled={isAuthenticating}
								className={`${styles.buttonPrimary} ${styles.authPrimaryButton}`}
							>
								{isAuthenticating
									? 'Please wait…'
									: mode === 'signup'
									? 'Create Account'
									: 'Sign In'}
								<ArrowIcon />
							</button>
						</form>

						<div className={styles.authDivider}>
							<div className={styles.authDividerLine} />
							<div className={styles.authDividerLabel}>
								<span className={styles.dividerLabel}>Or continue with</span>
							</div>
						</div>

						{/* Make sure your inner component handles client clicking with signIn("github") */}
						<GitHubLoginButton />

						<p className={styles.authAsideFooter} style={{ textAlign: 'center', marginTop: '1.5rem' }}>
							Demo credentials pre-filled · you can also create a new account.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}

function TextField({ label, id, type, value, onChange, required, placeholder }: {
	label: string;
	id: string;
	type: string;
	value: string;
	onChange: (v: string) => void;
	required?: boolean;
	placeholder?: string;
}) {
	return (
		<div className={styles.field}>
			<label htmlFor={id} className={styles.fieldLabel}>
				{label}
			</label>
			<input
				id={id}
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				required={required}
				placeholder={placeholder}
				className={styles.input}
			/>
		</div>
	);
}

function LogoMark() {
	return (
		<div className={`${styles.logoMark} ${styles.logoMarkSm}`}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: '1.25rem', height: '1.25rem' }}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8-4 8 4v10l-8 4-8-4V7z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 4 8-4M12 11v10" />
			</svg>
		</div>
	);
}

function CheckIcon() {
	return (
		<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
		</svg>
	);
}

function ArrowIcon() {
	return (
		<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M5 12h13" />
		</svg>
	);
}
