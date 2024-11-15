import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import { writable } from 'svelte/store';

export function getAvatar(name?: string) {
	if (!name) {
		return 'User.svg';
	} else {
		return createAvatar(initials, {
			seed: name
		}).toDataUri();
	}
}

export function isValidEmail(email: string): boolean {
	return /.+@.+/.test(email);
}

export const serializeNonPOJOs = (obj: object) => {
	return JSON.parse(JSON.stringify(obj));
};

export function recursiveSearch(
	obj: { [key: string]: unknown },
	searchFor: string,
	depth: number = 1
): boolean {
	if (depth < 0) return false;

	for (const key in obj) {
		if (typeof obj[key] === 'object' && obj[key] !== null) {
			if (Array.isArray(obj[key])) {
				for (const item of obj[key]) {
					if (typeof item === 'object' && item !== null) {
						if (recursiveSearch(item as { [key: string]: unknown }, searchFor, depth - 1)) {
							return true;
						}
					}
				}
			} else {
				if (recursiveSearch(obj[key] as { [key: string]: unknown }, searchFor, depth - 1)) {
					return true;
				}
			}
		} else if (typeof obj[key] === 'string') {
			if (!isNaN(parseInt(searchFor))) continue;
			if (obj[key].toLowerCase().includes(searchFor.toLowerCase())) {
				return true;
			}
		} else if (typeof obj[key] === 'number') {
			if (obj[key] > 1262304000) {
				const date = new Date(obj[key]);
				const langs = ['sk', 'en', 'cs'];

				const dateData = langs.flatMap((lang) => [
					date.toLocaleDateString(lang, { month: 'long' }).toLowerCase(),
					date.toLocaleDateString(lang, { month: 'short' }).toLowerCase(),
					date.toLocaleDateString(lang, { month: 'numeric' }).toLowerCase(),
					date.toLocaleDateString(lang, { day: 'numeric' }).toLowerCase(),
					date.toLocaleDateString(lang, { year: 'numeric' }).toLowerCase(),
					date.toLocaleDateString(lang, { weekday: 'long' }).toLowerCase(),
				]);
				console.log(dateData);
				if (dateData.includes(searchFor.toLowerCase().trim())) {
					return true;
				}
			}
			if (obj[key] == parseInt(searchFor)) {
				return true;
			}
		}
	}
	return false;
}

export const dropDown = writable('');
