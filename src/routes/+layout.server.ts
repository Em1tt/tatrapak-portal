import type { LayoutServerLoad } from './$types';
import type { Pouzivatel } from '$lib/server/models';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
    const theme = cookies.get("theme");


	return {
        theme: theme || "light",
		pouzivatel: JSON.parse(JSON.stringify(locals.user)) as Pouzivatel,
	};
};