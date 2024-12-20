import { hash, verify } from '@node-rs/argon2';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { Pouzivatel, Session } from './models';
import type { Cookies } from '@sveltejs/kit';

export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		algorithm: 2,
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

export async function validatePassword(password: string, hash: string): Promise<boolean> {
	return await verify(hash, password);
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = await Session.create({
		session_id: sessionId,
		expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		user_id: userId
	});
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = await Session.findOne({
		where: {
			session_id: sessionId
		}
	});
	if (!session) {
		return { session: null, user: null };
	}

	const user = await session.getPouzivatel();

	if (!user) {
		//Something went horribly wrong, maybe the user was deleted and tried to login again with the same session token
		//Shouldn't happen, but just in case
		//Also TypeScript doesn't bite me now
		session.destroy();
		return { session: null, user: null };
	}

	if (Date.now() >= session.expires_at.getTime()) {
		session.destroy();
		return { session: null, user: null };
	}
	if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		session.update('expires_at', session.expires_at);
	}
	return { session, user };
}

export type SessionValidationResult =
	| { session: Session; user: Pouzivatel }
	| { session: null; user: null };

export async function invalidateSession(sessionId: string): Promise<void> {
	await Session.destroy({
		where: {
			session_id: sessionId
		}
	});
}

export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
	cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}