export interface AuthUser {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	lastLoginAt: string | null;
}

export interface AuthCredentials {
	email: string;
	password: string;
}

export interface AuthSignUpData {
	name: string;
	email: string;
	password: string;
}

export interface AuthSession {
	token: string;
	userId: string;
	issuedAt: string;
}

export interface SignInResult {
	user: AuthUser;
	session: AuthSession;
}

export interface AuthRepository {
	signIn(credentials: AuthCredentials): Promise<SignInResult | null>;
	signUp(data: AuthSignUpData): Promise<SignInResult | null>;
	signOut(): Promise<void>;
	getCurrentUser(): Promise<AuthUser | null>;
}
