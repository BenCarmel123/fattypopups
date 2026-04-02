export const splitList = (str) => str?.split(',').map(s => s.trim()).filter(Boolean) || [];
