import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/auth';
import { Session} from '$lib/server/models';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {

	const s = await Session.findByPk("239dab70c4706dc90a3064872c0f80639d496509beade05570cc08e515a5890d");
	console.log(await s?.getPouzivatel());

	const token = event.cookies.get('session') ?? null;

	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;

		return await resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event.cookies, token, session.expires_at);
	} else {
		deleteSessionTokenCookie(event.cookies);
	}

	event.locals.session = session;
	event.locals.user = user;

	return await resolve(event);
};
