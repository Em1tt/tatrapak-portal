import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth.js';
import { TokenBucket } from '$lib/server/ratelimit';
import { fail, type Actions } from '@sveltejs/kit';

const authBucket = new TokenBucket<string>(2, 1);

export const actions = {
	default: async function ({ locals, getClientAddress, cookies, request }) {
		if (request.method != 'POST') {
			return fail(405, { message: 'Metóda nie je povolená.' });
		}
		if (!authBucket.consume(getClientAddress(), 3)) {
			fail(429, { message: 'Príliš veľa požiadaviek.' });
		}

		if (!locals.session) {
			return fail(401, { message: 'Nie ste prihlásený.' });
		}
		await invalidateSession(locals.session.session_id);
		deleteSessionTokenCookie(cookies);

		return {};
	}
} satisfies Actions;