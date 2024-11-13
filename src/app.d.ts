// See https://kit.svelte.dev/docs/types#app

import type { User, UserSession } from '$lib/server/models';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: UserSession | null;
		}
	}
}

export {};