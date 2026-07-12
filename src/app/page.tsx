import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';
import styles from '@/components/PortDeck.module.css';

export default async function RootPage() {
	const session = await auth();

	if (!session) {
		return redirect('/login');
	}
	redirect('/dashboard');
}
