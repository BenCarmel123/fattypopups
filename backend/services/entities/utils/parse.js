// Normalize a name by trimming whitespace and capitalizing the first letter of each word
export function normalizeName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return name
    .trim()
    .split(/\s+/) // Split by whitespace
    .map(word => {
      // Handle hyphenated names
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

// Wrappers
export function normalizeVenueName(venueName) {
  return normalizeName(venueName);
}

export function normalizeChefName(chefName) {
  return normalizeName(chefName);
}
