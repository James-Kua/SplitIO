

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CFjwDxPk.js","_app/immutable/chunks/B5vdJnoL.js","_app/immutable/chunks/D8mLhGtI.js"];
export const stylesheets = [];
export const fonts = [];
