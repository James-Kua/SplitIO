

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DvKN1PCN.js","_app/immutable/chunks/B5vdJnoL.js","_app/immutable/chunks/D8mLhGtI.js"];
export const stylesheets = [];
export const fonts = [];
