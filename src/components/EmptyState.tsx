'use client';

import { PlusIcon, ImageIcon } from './icons';
import styles from './PortDeck.module.css';

interface EmptyStateProps {
	filtered: boolean;
	onNewProject: () => void;
}

export default function EmptyState({ filtered, onNewProject }: EmptyStateProps) {
	return (
		<div className={`${styles.emptyState} ${styles.glass}`}>
			<div className={`${styles.emptyStateIconWrap} ${styles.glassStrong}`}>
				<ImageIcon className="w-10 h-10 text-ink-400" />
				<span className={styles.emptyStateBadge} />
			</div>
			{filtered ? (
				<>
					<h3 className={styles.emptyStateTitle}>
						No projects match
					</h3>
					<p className={styles.emptyStateCopy}>
						Try adjusting your search or filter criteria to find what you&apos;re
						looking for.
					</p>
				</>
			) : (
				<>
					<h3 className={styles.emptyStateTitle}>
						Start your deck
					</h3>
					<p className={styles.emptyStateCopy}>
						Add your first portfolio project — import from GitHub or start from a
						blank slate.
					</p>
					<button
						onClick={onNewProject}
						className={`${styles.buttonPrimary} ${styles.emptyStateButton}`}
					>
						<PlusIcon style={{height: 24}} />
						Add your first project
					</button>
				</>
			)}
		</div>
	);
}
