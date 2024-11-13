import { Pouzivatel } from '$lib/server/models';
import { isValidEmail } from '$lib/util/client';
import {
	hashPassword,
} from '$lib/server/auth.js';
import { TokenBucket } from '$lib/server/ratelimit';

const createUserBucket = new TokenBucket<string>(8, 1);

export async function POST({ request, locals, getClientAddress }) {
	if (!createUserBucket.consume(getClientAddress(), 1)) {
		return new Response('Príliš veľa požiadaviek.', {
			status: 429
		});
	}
	if (locals.session) {
		return new Response('Nie je možné vytvoriť účet, ak ste prihlásený.', {
			status: 400
		});
	}
	const formData = await request.formData();
	let email = formData.get('email');
	if (!email || typeof email !== 'string' || !isValidEmail(email)) {
		return new Response('E-Mail je neplatný.', {
			status: 400
		});
	}
	email = email.toLowerCase();
	if (await Pouzivatel.findOne({ where: { Email: email } })) {
		return new Response('E-Mail je už použitý.', {
			status: 409
		});
	}
	const password = formData.get('password');
	if (!password || typeof password !== 'string') {
		return new Response('Neplatné heslo.', {
			status: 400
		});
	}
	const name = formData.get('firstName');
	if (!name || typeof name !== 'string') {
		return new Response('Neplatné meno.', {
			status: 400
		});
	}
	const surname = formData.get('lastName');
	if (!surname || typeof surname !== 'string') {
		return new Response('Neplatné priezvisko.', {
			status: 400
		});
	}
	if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(password)) {
		return new Response('Heslo nespĺňa zadané kritéria.', {
			status: 400
		});
	}
	
	const passwordHash = await hashPassword(password);
	const user = await Pouzivatel.create({
		Email: email,
		Heslo: passwordHash,
		Rola: "obchodnik",
		Meno: name,
	}).catch(e => {
        return new Response("Nepodarilo sa vytvoriť používateľa.", {status: 400});
    });

	return new Response(null, { status: 200 });
}