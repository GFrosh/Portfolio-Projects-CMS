import { useCallback, useEffect, useState } from 'react';
import { authRepository } from '../data/auth/repository';
import type { AuthCredentials, AuthSignUpData, AuthUser } from '../types/auth';

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
			const result = await authRepository.signIn(credentials);
			if (!result) {
				setError('Invalid email or password.');
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
			const result = await authRepository.signUp(data);
			if (!result) {
				setError('Unable to create account. Email may already exist or fields are invalid.');
				return false;
			}

			setUser(result.user);
			return true;
		} finally {
			setIsAuthenticating(false);
		}
	}, []);

	const signOut = useCallback(async () => {
		await authRepository.signOut();
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
