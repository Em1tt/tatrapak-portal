import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import { writable } from 'svelte/store';

export function getAvatar(name?: string){
    if(!name){
        return "User.svg";
    }else{
        return createAvatar(initials, {
            seed: name
        }).toDataUri();
    };
};

export function isValidEmail(email: string): boolean {
	return /.+@.+/.test(email);
}

export const serializeNonPOJOs = (obj: object) => {
	return JSON.parse(JSON.stringify(obj));
};

export function recursiveSearch(obj: { [key: string]: unknown }, searchFor: string, depth: number = 5): boolean {
    if (depth < 0) return false;

    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (Array.isArray(obj[key])) {
                for (const item of obj[key]) {
                    if (typeof item === 'object' && item !== null) {
                        if (recursiveSearch(item as { [key: string]: unknown }, searchFor, depth - 1)) {
                            return true;
                        }
                    } else if (typeof item === 'string') {
                        if (item.toLowerCase().includes(searchFor.toLowerCase())) {
                            return true;
                        }
                    } else if (typeof item === "number") {
                        if (item === parseInt(searchFor)) {
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
            if ((obj[key] as string).toLowerCase().includes(searchFor.toLowerCase())) {
                return true;
            }
        }
    }
    return false;
}

export const dropDown = writable("");