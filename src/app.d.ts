// See https://kit.svelte.dev/docs/types#app

import type { User, Session } from '$lib/server/models';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
	}
}

export {};