'use client';


import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/PortDeck.module.css';

export default function RootPage() {
	const router = useRouter();
	


	return (
		<main className={styles.loaderScreen}>
			<div className={styles.loaderStack}>
				<div className={styles.loaderSpinner} />
				<p className={styles.loaderText}>Loading PortDeck…</p>
			</div>
		</main>
	);
}
