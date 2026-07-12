import styles from '@/components/PortDeck.module.css';

export default function Loading() {
	return (
		<main className={styles.loaderScreen}>
			<div className={styles.loaderStack}>
				<div className={styles.loaderSpinner} />
				<p className={styles.loaderText}>Loading PortDeck…</p>
			</div>
		</main>
	);
}
