import { writable } from 'svelte/store';


export const chatName = writable("");
export const chats = writable([]);
export let getChats = writable([]);
export let viewersArray =writable([]);
export const viewers = writable({});