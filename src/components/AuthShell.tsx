'use client';



import { useEffect, useState, type SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './PortDeck.module.css';
import { signIn, signUp } from '@/utils/auth';
import { auth } from '@/app/auth';


interface AuthShellProps {
  	mode: 'signin' | 'signup';
}


export default function AuthShell({ mode }: AuthShellProps) {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('user@portdeck.local');
	const [password, setPassword] = useState('password123');
	const [error, setError] = useState('');
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	useEffect(() => {
		async function fetchUser() {
			const session = await auth();
			if (session) setUser(session);
			else setUser(null);
		}
		fetchUser();
		if (user) router.replace('/dashboard');
	}, [user, router]);

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const ok = mode === 'signup'
			? await signUp({ name, email, password })
			: await signIn({ email, password });
		if (ok) router.replace('/dashboard');
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

				<a 
					href="/api/auth/github"
					className={`${styles.buttonSecondary} ${styles.authSocialButton}`}>
					<GitHubIcon />
					GitHub
				</a>

				<p className={styles.authAsideFooter} style={{ textAlign: 'center', marginTop: '1.5rem' }}>
					Demo credentials pre-filled · you can also create a new account.
				</p>
			</div>
			</div>
		</section>
		</main>
	);
}


function TextField({label, id, type,  value,  onChange, required, placeholder}: {
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


function GitHubIcon() {
	return (
		<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
		<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
		</svg>
	);
}
