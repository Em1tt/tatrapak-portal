import type { LayoutServerLoad } from './$types';
import type { Pouzivatel, Session } from '$lib/server/models';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
    const theme = cookies.get("theme");
	return {
        theme: theme || "light",
		user: locals.user ? JSON.parse(JSON.stringify(locals.user)) as Pouzivatel : null,
		session: locals.session ? JSON.parse(JSON.stringify(locals.session)) as Session: null
	};
};