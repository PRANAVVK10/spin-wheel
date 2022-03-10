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
export  const colors = readable(["#FF9896", "#9467BD", "#C5B0D5", "#1F77B4", "#AEC7E8", "#FF7F0E", "#FFBB78", "#2CA02C", "#98DF8A", "#D62728"])
// export  const colors = readable(["#0A496B", "#0F5882", "#3093C3", "#0A496B", "#0F5882", "#3093C3", "#0A496B", "#0F5882", "#3093C3", "#0A496B"])
export const numberOfSlices = readable(9);
