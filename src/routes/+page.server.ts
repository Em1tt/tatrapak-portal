import type { Actions } from '@sveltejs/kit';

export const actions = {
	theme: async ({ request, cookies }) => {
		const formData = await request.formData();
		let theme = formData.get('theme');
		if (!theme || typeof theme != 'string') {
			theme = 'light';
		}
		cookies.set('theme', theme, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/'
		});

		return { success: true };
	}
} satisfies Actions;
