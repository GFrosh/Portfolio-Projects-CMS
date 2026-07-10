import jwt, { JwtPayload, SignOptions, Secret } from 'jsonwebtoken';
import env from '@/lib/env';

export interface TokenPayload extends JwtPayload {
	id: number;
	email: string;
	name: string;
}

export type token = string;

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60;
export const REMEMBER_ME_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
const JWT_SECRET: Secret = env.JWT_SECRET!;

export const AUTH_COOKIE_SECURE = process.env.NODE_ENV === 'production';

/**
 * Generate JWT token
 */
export function generateToken(
	payload: Omit<TokenPayload, 'iat' | 'exp'>,
	expiresIn?: string | number
): token;
export function generateToken(
	payload: Omit<TokenPayload, 'iat' | 'exp'>,
	expiresIn: string | number = DEFAULT_TOKEN_TTL_SECONDS
): token {
	const secret: Secret = JWT_SECRET;
	const signOptions: SignOptions = {
		expiresIn: expiresIn as SignOptions['expiresIn'],
		algorithm: 'HS256',
	};

	return jwt.sign(payload, secret, signOptions);
}


/**
 * Verify and decode JWT token
 */
export function verifyToken(token: token): TokenPayload {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		return decoded as TokenPayload;
	} catch {
		throw new Error('Invalid or expired token');
	}
}



/**
 * Decode token without verification (for debugging)
 */
function decodeToken(token: token): TokenPayload | null {
	try {
		return jwt.decode(token) as TokenPayload;
	} catch {
		return null;
	}
}

function getTokenExpiryDate(tokenValue: token): Date {
	const decoded = jwt.decode(tokenValue) as JwtPayload | null;
	if (!decoded?.exp) {
		throw new Error('Unable to read token expiration');
	}
	return new Date(decoded.exp * 1000);
}

export function getTokenMaxAgeSeconds(tokenValue: token): number {
	const expiresAt = getTokenExpiryDate(tokenValue).getTime();
	const now = Date.now();
	const seconds = Math.floor((expiresAt - now) / 1000);
	return seconds > 0 ? seconds : 0;
}

export function getTokenExpiresAt(tokenValue: token): Date {
	return getTokenExpiryDate(tokenValue);
}
