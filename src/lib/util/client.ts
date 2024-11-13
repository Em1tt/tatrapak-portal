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

export const dropDown = writable("");