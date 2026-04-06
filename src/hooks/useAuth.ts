import { useCallback, useEffect, useState } from 'react';
import { authRepository } from '../data/auth/repository';
import type { AuthCredentials, AuthSignUpData, AuthUser } from '../types/auth';
import Portal from '../data/auth/Portal';

export function useAuth() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		(async () => {
			const currentUser = await authRepository.getCurrentUser();
			if (!active) return;
			setUser(currentUser);
			setIsReady(true);
		})();

		return () => {
			active = false;
		};
	}, []);

	const signIn = useCallback(async (credentials: AuthCredentials): Promise<boolean> => {
		setIsAuthenticating(true);
		setError(null);

		try {
			const result = await Portal.signIn(credentials);
			if (!result.success || !result.user) {
				setError(result.message || 'Invalid email or password.');
				return false;
			}

			setUser(result.user);
			return true;
		} finally {
			setIsAuthenticating(false);
		}
	}, []);

	const signUp = useCallback(async (data: AuthSignUpData): Promise<boolean> => {
		setIsAuthenticating(true);
		setError(null);

		try {
			const result = await Portal.signup(data);
			if (!result.success || !result.user) {
				setError(result.message || 'Unable to create account.');
				return false;
			}

			setUser(result.user);
			return true;
		} finally {
			setIsAuthenticating(false);
		}
	}, []);

	const signOut = useCallback(async () => {
		const ok = await Portal.logout();
		if (!ok) {
			setError('Unable to sign out right now.');
			return;
		}

		setUser(null);
		setError(null);
	}, []);

	return {
		user,
		isReady,
		isAuthenticating,
		error,
		signIn,
		signUp,
		signOut,
	};
}
