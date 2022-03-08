import { readable, writable } from 'svelte/store';


export const chatName = writable("");
export const chats = writable([]);
export const slices = writable({});
export let getChats = writable([]);
export let viewersArray =writable([]);
export const viewers = writable({});
export const currentIndex = writable(-1) ;
export const spinStatus = writable(false);
export const flag = writable(true);
export  const colors = readable(["red", "blue", "pink", "green", "purple"])
export const numberOfSlices = readable(1);
