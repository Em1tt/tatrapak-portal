import {
	hashPassword,
	validatePassword
} from '$lib/server/auth.js';
import { Pouzivatel } from '$lib/server/models.js';
import { TokenBucket } from '$lib/server/ratelimit';
import { fail, type Actions } from '@sveltejs/kit';

const authBucket = new TokenBucket<string>(5, 1);

export const actions = {
	default: async function ({ locals, getClientAddress, request }) {
		if (request.method != 'POST') {
			return fail(405, { message: 'Metóda nie je povolená.' });
		}
		if (!authBucket.consume(getClientAddress(), 2)) {
			return fail(429, { message: 'Príliš veľa požiadaviek.' });
		}
		const formData = await request.formData();
		if (!locals.user) {
			return fail(404, { message: 'Musíte byť prihlásený' });
		}
		const password = formData.get('password');
		if (!password || typeof password !== 'string') {
			return fail(400, { message: 'Nesprávne heslo.', validate: ['password'] });
		}

        const user = await Pouzivatel.findOne({where: {PouzivatelID: (locals.user as Pouzivatel).PouzivatelID}});
        if(!user){
            return fail(404, { message: 'Používateľ sa nenašiel.' });
        }

		if (!(await validatePassword(password, user.Heslo))) {
			return fail(404, {
				message: 'Nesprávne heslo.',
				validate: ['password']
			});
		}

        const newPassword = formData.get("newPassword")?.toString();

        if(!newPassword){
            return fail(400, { message: 'Neplatné nové heslo.', validate: ['newPassword'] });
        }

        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(newPassword)) {
            return fail(404, {
                message: "Nové heslo nespĺňa zadané kritéria.",
                validate: ["newPassword"]
            });
        }

        const newPasswordHash = await hashPassword(newPassword);
        const updated = await user.update({Heslo: newPasswordHash});
        console.log(updated);
		return {};
	}
} satisfies Actions;