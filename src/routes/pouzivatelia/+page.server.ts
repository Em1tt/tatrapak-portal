import { Oddelenie, Pouzivatel } from '$lib/server/models';
import { isValidEmail, serializeNonPOJOs } from '$lib/util/client';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hashPassword } from '$lib/server/auth';

export const actions = {
	editUser: async ({ request, locals }) => {
		if (!locals.user) return error(401, { message: 'Nie ste prihlásený' });
		const formData = await request.formData();
		console.log(formData);
		const submit_button = formData.get('submit_button');
		if (!submit_button)
			return fail(400, {
				message: 'Neplatný submit_button'
			});
		const userID = formData.get('userID');

		if (submit_button == 'delete') {
			const user = await Pouzivatel.findByPk(userID);
			if (!user)
				return fail(400, {
					message: 'Používateľ neexistuje'
				});
			if(locals.user.PouzivatelID == user.PouzivatelID)
				return fail(400, {
					message: 'Nemôžete vymazať svoj účet'
				});
			await user.destroy();
			return {success: true, message: "Používateľ bol vymazaný."};
		}
		if(locals.user.Rola != "spravca"){
			return fail(403, {
				message: 'Nemáte oprávnenie'
			});
		}
		const name = formData.get('name');
		const email = formData.get('email');
		const rola = formData.get('rola');
		const oddelenie = formData.get('oddelenie');
		const heslo = formData.get('password');

		const user = await Pouzivatel.findByPk(userID);
		if (!user)
			return fail(400, {
				message: 'Používateľ neexistuje'
			});
		let hashedPassword = user.Heslo;

		if (!name)
			return fail(400, {
				message: 'Neplatné meno',
				validate: [`name`]
			});
		if (!email || !isValidEmail(email.toString()))
			return fail(400, {
				message: 'Neplatný email',
				validate: [`email`]
			});
		const emailExists = await Pouzivatel.findOne({ where: { Email: email?.toString() ?? '' } });
		if (emailExists && emailExists.PouzivatelID != user.PouzivatelID)
			return fail(400, {
				message: 'Používateľ s týmto emailom už existuje',
				validate: [`email`]
			});
		if (!rola)
			return fail(400, {
				message: 'Neplatná rola',
				validate: [`rola`]
			});
		if (
			rola != 'obchodnik' &&
			rola != 'administrativny pracovnik' &&
			rola != 'vyroba' &&
			rola != 'spravca'
		)
			return fail(400, {
				message: 'Neplatná rola',
				validate: [`rola`]
			});
		if (rola == 'vyroba' && !oddelenie)
			return fail(400, {
				message: 'Neplatné oddelenie',
				validate: [`oddelenie`]
			});
		if (heslo) {
			if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(heslo.toString()))
				return fail(400, {
					message: 'Neplatné heslo',
					validate: [`password`]
				});
			hashedPassword = await hashPassword(heslo.toString());
		}
		if(oddelenie && rola == "vyroba"){
			await user.update({
				Email: email.toString(),
				Heslo: hashedPassword,
				Rola: rola,
				Meno: name.toString(),
				OddelenieID: parseInt(oddelenie.toString())
			});
		}else{
			await user.update({
				Email: email.toString(),
				Heslo: hashedPassword,
				Rola: rola,
				Meno: name.toString(),
				OddelenieID: null
			});
		}
		return {};
	},
	createUser: async ({ request, locals }) => {
		if (!locals.user) return error(401, { message: 'Nie ste prihlásený' });
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const rola = formData.get('rola');
		const oddelenie = formData.get('oddelenie');
		const heslo = formData.get('password');

		if (!name)
			return fail(400, {
				message: 'Neplatné meno',
				validate: [`name`]
			});
		if (!email || !isValidEmail(email.toString()))
			return fail(400, {
				message: 'Neplatný email',
				validate: [`email`]
			});
		if (await Pouzivatel.findOne({ where: { Email: email.toString() } }))
			return fail(400, {
				message: 'Používateľ s týmto emailom už existuje',
				validate: [`email`]
			});
		if (!rola)
			return fail(400, {
				message: 'Neplatná rola',
				validate: [`rola`]
			});
		if (
			rola != 'obchodnik' &&
			rola != 'administrativny pracovnik' &&
			rola != 'vyroba' &&
			rola != 'spravca'
		)
			return fail(400, {
				message: 'Neplatná rola',
				validate: [`rola`]
			});
		if (rola == 'vyroba' && !oddelenie)
			return fail(400, {
				message: 'Neplatné oddelenie',
				validate: [`oddelenie`]
			});
		if (!heslo || !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(heslo.toString()))
			return fail(400, {
				message: 'Neplatné heslo',
				validate: [`password`]
			});
		const hashedPassword = await hashPassword(heslo.toString());
		if(oddelenie && rola == "vyroba"){
			await Pouzivatel.create({
				Email: email.toString(),
				Heslo: hashedPassword,
				Rola: rola,
				Meno: name.toString(),
				OddelenieID: parseInt(oddelenie.toString())
			});
		}else{
			await Pouzivatel.create({
				Email: email.toString(),
				Heslo: hashedPassword,
				Rola: rola,
				Meno: name.toString(),
				OddelenieID: null
			});
		}
		return {success: true};
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) error(401, { message: 'Nie ste prihlásený' });
	if (
		(locals.user as Pouzivatel).Rola != 'spravca' &&
		(locals.user as Pouzivatel).Rola != 'administrativny pracovnik'
	)
		error(403, { message: 'Nemáte oprávnenie' });
	const pouzivatelia = await Pouzivatel.findAll({
		attributes: { exclude: ['Heslo'] },
		include: { model: Oddelenie }
	});
	const oddelenia = await Oddelenie.findAll();

	return {
		pouzivatelia: pouzivatelia ? (serializeNonPOJOs(pouzivatelia) as Pouzivatel[]) : [],
		oddelenia: oddelenia ? (serializeNonPOJOs(oddelenia) as Oddelenie[]) : [],
		pouzivatel: serializeNonPOJOs(locals.user) as Pouzivatel
	};
};
