'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import DashboardShell from '@/components/DashboardShell';
import styles from '@/components/PortDeck.module.css';
import type { Session } from 'next-auth';

export default function DashboardPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const isReady = status !== 'loading';
	const user: Session['user'] | null = useMemo(() => {
		if (session?.user) return {
			id: (session.user as { id?: string }).id ?? '',
			name: session.user.name ?? '',
			email: session.user.email ?? '',
			createdAt: '',
			lastLoginAt: null,
		};
	}, [session]);

	useEffect(() => {
		if (isReady && !user) router.replace('/login');
	}, [isReady, user, router]);
	
	if (!isReady || !user) {
		return (
			<main className={styles.loaderScreen}>
				<div className={styles.loaderStack}>
					<div className={styles.loaderSpinner} />
					<p className={styles.loaderText}>Loading dashboard…</p>
				</div>
			</main>
		);
	}

	return (
		<DashboardShell
			user={user}
			signOut={() => signOut({ callbackUrl: '/login' })}
		/>
	);
}
