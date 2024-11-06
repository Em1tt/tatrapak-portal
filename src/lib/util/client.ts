import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

export function getAvatar(name?: string){
    if(!name){
        return "User.svg";
    }else{
        return createAvatar(initials, {
            seed: name
        }).toDataUri();
    };
};