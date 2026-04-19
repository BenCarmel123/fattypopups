export function normalizeName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return name
    .trim()
    .split(/\s+/) 
    .map(word => {
      return word
        .split('-')
        .map(part => {
          if (part.length === 0) return part;
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join('-');
    })
    .join(' ');
}

export function normalizeVenueName(venueName) {
  return normalizeName(venueName);
}

export function normalizeChefName(chefName) {
  return normalizeName(chefName);
}
